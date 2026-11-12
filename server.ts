import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Generous limit for PDF uploads encoded in base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models in priority order with graceful fallback for resilience
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

async function generateWithFallback(params: any) {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} failed (${err.status || err.message}). Trying next candidate...`);
      lastError = err;
    }
  }
  throw lastError;
}

// Clean and safely parse JSON from model response
function safeParseJSON(rawText: string) {
  if (!rawText) return null;
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  }
  return null;
}

// API Route: Parse University Exam Document (PDF or text/images)
app.post('/api/parse-exam', async (req, res) => {
  try {
    const { pdfBase64, mimeType = 'application/pdf', textContent, disciplineConfig } = req.body;

    if (!pdfBase64 && !textContent) {
      return res.status(400).json({ error: 'É necessário fornecer um ficheiro PDF ou o texto do teste.' });
    }

    const systemPrompt = `És um especialista rigoroso em digitalização e simulação de testes e exames universitários.
A tua missão é extrair e replicar IPSIS VERBIS (absolutamente idêntico, literal, palavra por palavra) todas as questões de escolha múltipla e opções de resposta presentes no teste submetido.

REGRAS ESTRITAS:
1. REPLICAÇÃO IPSIS VERBIS: Não resumas nem alteres palavras, fórmulas, números, terminologia ou a formulação do enunciado. Mantém o rigor exato do professor universitário original.
2. OPÇÕES DE RESPOSTA: Extrai todas as hipóteses (A, B, C, D, E, etc.) exatamente como formuladas no teste.
3. CHAVE DE CORREÇÃO / RESPOSTA CERTA:
   - Se o teste incluir gabarito, critérios de correção ou soluções no final ou assinaladas, usa rigorosamente essas respostas oficiais.
   - Se não tiver gabarito explícito, resolve cada questão com elevado rigor universitário e indica a alínea correta ('A', 'B', 'C', 'D' ou 'E') em 'correctOptionKey'.
4. EXPLICAÇÃO CONCISA: Para cada questão, fornece uma explicação sucinta e pedagógica (2 a 4 frases) justificando por que a opção certa está correta e porque as outras falham.
5. PONTUAÇÃO: Se o teste indicar a cotação específica de cada pergunta (ex: 1.5 val, 2.0 val), preenche o campo 'points'.
6. METADADOS: Identifica o nome da disciplina, ano letivo/semestre (se detetável), instituição/faculdade e título do teste.`;

    const contentsParts: any[] = [];

    if (pdfBase64) {
      // Remove data URL prefix if present
      const cleanBase64 = pdfBase64.replace(/^data:[^;]+;base64,/, '').trim();
      contentsParts.push({
        inlineData: {
          mimeType: mimeType || 'application/pdf',
          data: cleanBase64,
        },
      });
    }

    const userPrompt = `Analisa este teste de faculdade e extrai todas as perguntas de escolha múltipla ipsis verbis.
${textContent ? `\nTexto adicional / Enunciado:\n${textContent}` : ''}
${disciplineConfig?.name ? `\nDisciplina indicada pelo utilizador: ${disciplineConfig.name}` : ''}
Garante que cada pergunta contém todas as opções de resposta idênticas ao original e a respetiva resposta correta fundamentada.`;

    contentsParts.push({ text: userPrompt });

    const response = await generateWithFallback({
      contents: contentsParts.length === 1 ? contentsParts[0].text : { parts: contentsParts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Título do teste ou exame (ex: 1º Teste de Avaliação Contínua)',
            },
            subject: {
              type: Type.STRING,
              description: 'Nome da disciplina universitária (ex: Microeconomia I, Direito das Obrigações)',
            },
            year: {
              type: Type.STRING,
              description: 'Ano letivo ou época (ex: 2023/2024 - Época Normal)',
            },
            institution: {
              type: Type.STRING,
              description: 'Universidade ou Faculdade (se mencionada)',
            },
            instructions: {
              type: Type.STRING,
              description: 'Instruções gerais ou regras de pontuação indicadas no cabeçalho do teste (se houver)',
            },
            questions: {
              type: Type.ARRAY,
              description: 'Lista completa de questões de escolha múltipla replicadas ipsis verbis',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Identificador único da pergunta, ex: q1, q2' },
                  number: { type: Type.INTEGER, description: 'Número de ordem da pergunta' },
                  text: { type: Type.STRING, description: 'Enunciado IPSIS VERBIS completo da questão' },
                  options: {
                    type: Type.ARRAY,
                    description: 'Todas as hipóteses de resposta (A, B, C, D...)',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        key: { type: Type.STRING, description: 'Letra da alínea, ex: A, B, C, D' },
                        text: { type: Type.STRING, description: 'Texto IPSIS VERBIS da hipótese de resposta' },
                      },
                      required: ['key', 'text'],
                    },
                  },
                  correctOptionKey: {
                    type: Type.STRING,
                    description: 'A letra da alínea correta (ex: A, B, C, D)',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Explicação detalhada da resolução e por que esta opção é a correta',
                  },
                  points: {
                    type: Type.NUMBER,
                    description: 'Cotação da questão em valores (ex: 1.0, 2.0, 2.5)',
                  },
                },
                required: ['id', 'number', 'text', 'options', 'correctOptionKey', 'explanation'],
              },
            },
          },
          required: ['title', 'subject', 'questions'],
        },
      },
    });

    const parsedJson = safeParseJSON(response.text || '');
    if (!parsedJson || !Array.isArray(parsedJson.questions) || parsedJson.questions.length === 0) {
      throw new Error('O modelo não conseguiu extrair perguntas de escolha múltipla legíveis deste ficheiro.');
    }

    // Ensure all questions have proper ids and normalized option keys
    parsedJson.questions = parsedJson.questions.map((q: any, idx: number) => ({
      ...q,
      id: q.id || `q-${idx + 1}-${Date.now()}`,
      number: q.number || idx + 1,
      correctOptionKey: (q.correctOptionKey || 'A').toUpperCase().trim(),
      options: Array.isArray(q.options)
        ? q.options.map((opt: any, optIdx: number) => ({
            key: (opt.key || String.fromCharCode(65 + optIdx)).toUpperCase().trim(),
            text: opt.text || '',
          }))
        : [],
    }));

    return res.json({ success: true, exam: parsedJson });
  } catch (error: any) {
    console.error('Erro ao processar exame com Gemini:', error);
    return res.status(500).json({
      error: 'Não foi possível processar o documento do teste. Verifique se o ficheiro é legível e tente novamente.',
      details: error.message || String(error),
    });
  }
});

// API Route: Deep explanation or tutoring for a specific question
app.post('/api/explain-question', async (req, res) => {
  try {
    const { questionText, options, selectedOption, correctOption, subject } = req.body;

    const response = await generateWithFallback({
      contents: `És um professor universitário da cadeira de "${subject || 'Ensino Superior'}".
Um aluno fez a seguinte pergunta num simulador de teste:
Enunciado: "${questionText}"
Opções:
${options.map((o: any) => `${o.key}) ${o.text}`).join('\n')}

O aluno respondeu: ${selectedOption || 'Deixou em branco'}
A resposta correta é: ${correctOption}

Explica em detalhe didático:
1. Por que a opção ${correctOption} é estritamente correta (com demonstração teórica/prática se aplicável).
2. Onde reside a "rasteira" ou o erro conceitual das opções incorretas.
3. Dica de estudo ou fórmula mnemónica para nunca mais errar isto no exame final.`,
    });

    return res.json({ success: true, explanation: response.text });
  } catch (error: any) {
    console.error('Erro ao gerar explicação:', error);
    return res.status(500).json({ error: 'Erro ao gerar explicação adicional.' });
  }
});

// Vite Middleware for development & Static serving for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();

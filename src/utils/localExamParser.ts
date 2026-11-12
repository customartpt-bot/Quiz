import { Exam, Question, ExamOption } from '../types/exam';

/**
 * 100% Offline Local Exam Parser
 * Parses academic multiple-choice exams directly in the browser without any AI or server calls.
 */
export function parseExamLocally(rawText: string, defaultTitle = 'Teste Importado'): Exam {
  const lines = rawText.split('\n');
  const questions: Question[] = [];

  let currentTitle = defaultTitle;
  let currentSubject = 'Programação / Engenharia';
  let currentInstitution = 'Ensino Superior';

  // Check header lines for title
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const l = lines[i].trim();
    if (l.toLowerCase().includes('exame') || l.toLowerCase().includes('teste')) {
      currentTitle = l.replace(/^[#*\s-]+/, '').trim();
      break;
    }
  }

  // Regexes for question start: "Pergunta 1", "Questão 1", "1.", "1 -", "1)"
  const questionStartRegex = /^(?:pergunta|quest[aã]o|\d+[\.\)\-])\s*(\d+)?/i;

  let currentQuestion: {
    number: number;
    textLines: string[];
    options: ExamOption[];
    correctKeys: string[];
    explanation: string;
  } | null = null;

  function commitCurrentQuestion() {
    if (!currentQuestion) return;
    if (currentQuestion.options.length === 0 && currentQuestion.textLines.length === 0) return;

    // Filter out trailing blank lines from text
    const text = currentQuestion.textLines.join('\n').trim();
    const isMulti =
      text.toLowerCase().includes('opções corretas') ||
      text.toLowerCase().includes('respostas corretas') ||
      currentQuestion.correctKeys.length > 1;

    // Default correct keys
    const correctKeys =
      currentQuestion.correctKeys.length > 0
        ? currentQuestion.correctKeys
        : [currentQuestion.options[0]?.key || 'a'];

    questions.push({
      id: `local-q-${currentQuestion.number || questions.length + 1}-${Date.now()}`,
      number: currentQuestion.number || questions.length + 1,
      text: text || `Questão ${questions.length + 1}`,
      options: currentQuestion.options.length > 0 ? currentQuestion.options : [
        { key: 'a', text: 'Verdadeiro' },
        { key: 'b', text: 'Falso' },
      ],
      correctOptionKeys: correctKeys.map((k) => k.toLowerCase()),
      correctOptionKey: correctKeys[0]?.toLowerCase() || 'a',
      multiSelect: isMulti,
      explanation: currentQuestion.explanation || 'Critério didático da questão.',
      points: Number((20 / Math.max(1, questions.length + 1)).toFixed(2)),
    });

    currentQuestion = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check if line indicates a new question
    const qMatch = line.match(/^(?:pergunta|quest[aã]o)\s*(\d+)[:\.]?/i) || line.match(/^(\d+)[\.\)\-]\s+(.+)/);

    if (qMatch) {
      commitCurrentQuestion();
      const qNum = qMatch[1] ? parseInt(qMatch[1], 10) : questions.length + 1;
      const initialText = qMatch[2] ? [qMatch[2]] : [];
      currentQuestion = {
        number: qNum,
        textLines: initialText,
        options: [],
        correctKeys: [],
        explanation: '',
      };
      continue;
    }

    if (!currentQuestion) {
      // If we haven't started a question yet, skip preface lines
      continue;
    }

    // Check for option line: "* a.", "* a)", "a.", "a)", "A)", "* Verdadeiro", "* Falso"
    const optMatch = line.match(/^[\*\-•]?\s*([a-eA-E])[\.\)]\s*(.+)/);
    const vfMatch = line.match(/^[\*\-•]?\s*(Verdadeiro|Falso)/i);

    if (optMatch) {
      const key = optMatch[1].toLowerCase();
      const text = optMatch[2].trim();
      currentQuestion.options.push({ key, text });
      continue;
    }

    if (vfMatch) {
      const val = vfMatch[1];
      const key = val.toLowerCase().startsWith('v') ? 'a' : 'b';
      currentQuestion.options.push({ key, text: val });
      continue;
    }

    // Check for explicit solution / answer indicator: "Resposta: a, c", "Solução: C e D", "Gabarito: b"
    const ansMatch = line.match(/^(?:resposta|solu[cç][aã]o|gabarito)[:\s]+([a-eA-E,\sye]+)/i);
    if (ansMatch) {
      const rawAns = ansMatch[1];
      const extractedKeys = rawAns.match(/[a-eA-E]/g) || [];
      if (extractedKeys.length > 0) {
        currentQuestion.correctKeys = extractedKeys.map((k) => k.toLowerCase());
      }
      continue;
    }

    // Otherwise it is part of the question text or a code block
    currentQuestion.textLines.push(rawLine);
  }

  commitCurrentQuestion();

  // Recalculate equal distribution of points for 20 scale
  const finalPoint = Number((20 / Math.max(1, questions.length)).toFixed(3));
  questions.forEach((q) => {
    q.points = finalPoint;
  });

  return {
    id: `local-exam-${Date.now()}`,
    title: currentTitle,
    subject: currentSubject,
    year: 'Importação Local (Sem IA)',
    institution: currentInstitution,
    instructions: `Simulação local com ${questions.length} questões replicadas ipsis verbis. Escala 0 a 20 valores.`,
    disciplineConfigId: 'saprog-python',
    sourceType: 'manual',
    questions,
  };
}

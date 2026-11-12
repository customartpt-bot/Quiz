import React, { useState, useRef } from 'react';
import { Exam, DisciplineConfig } from '../types/exam';
import { SAMPLE_EXAMS, getRandomEspacialExam } from '../data/sampleExams';
import { parseExamLocally } from '../utils/localExamParser';
import {
  Upload,
  FileText,
  AlertCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileUp,
  X,
  FileCheck,
  ChevronRight,
  School,
  Zap,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onExamLoaded: (exam: Exam, config?: DisciplineConfig) => void;
  currentConfig: DisciplineConfig;
}

export const ExamUploader: React.FC<Props> = ({
  isOpen,
  onClose,
  onExamLoaded,
  currentConfig,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'samples'>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      setErrorMessage('Por favor submeta um ficheiro em formato PDF.');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage('O ficheiro é demasiado grande (máximo 30MB).');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProcessExam = async () => {
    if (!selectedFile && !pastedText.trim()) {
      setErrorMessage('Por favor selecione um ficheiro PDF ou cole o texto do teste.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      setLoadingStep('A carregar e ler documento...');
      let pdfBase64 = null;
      let mimeType = 'application/pdf';

      if (selectedFile) {
        pdfBase64 = await convertFileToBase64(selectedFile);
        mimeType = selectedFile.type || 'application/pdf';
      }

      setLoadingStep('A replicar questões e opções ipsis verbis com Gemini AI...');

      const response = await fetch('/api/parse-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          mimeType,
          textContent: pastedText.trim() || undefined,
          disciplineConfig: currentConfig,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const detailedMsg = errorData.details
          ? `${errorData.error || 'Falha ao processar o teste.'} (${errorData.details})`
          : errorData.error || 'Falha ao processar o teste.';
        throw new Error(detailedMsg);
      }

      setLoadingStep('A validar critérios de correção e gabarito oficial...');
      const data = await response.json();

      if (!data.exam || !data.exam.questions || data.exam.questions.length === 0) {
        throw new Error('Não foram encontradas perguntas de escolha múltipla neste documento. Se o PDF for uma digitalização de baixa qualidade, experimente copiar o texto para a aba "Colar Enunciado".');
      }

      const parsedExam: Exam = {
        id: `exam-${Date.now()}`,
        title: data.exam.title || selectedFile?.name.replace('.pdf', '') || 'Teste de Avaliação',
        subject: data.exam.subject || currentConfig.name,
        year: data.exam.year || 'Exame Universitário',
        institution: data.exam.institution || 'Ensino Superior',
        instructions: data.exam.instructions,
        questions: data.exam.questions,
        sourceType: 'pdf',
        createdAt: new Date().toISOString(),
      };

      onExamLoaded(parsedExam);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message ||
          'Ocorreu um erro ao processar o PDF. Pode também experimentar um dos nossos testes reais de exemplo.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleProcessLocally = () => {
    if (!pastedText.trim()) {
      setErrorMessage('Por favor cole o texto com as perguntas do teste no campo abaixo.');
      return;
    }
    try {
      const exam = parseExamLocally(pastedText, 'Exame Importado (Modo Local)');
      if (exam.questions.length === 0) {
        throw new Error(
          'Não foram detetadas perguntas no texto. Certifique-se de que cada pergunta indica "Pergunta X" ou "1." e as hipóteses iniciam com "* a." ou "a.", "b.", etc.'
        );
      }
      onExamLoaded(exam);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar localmente.');
    }
  };

  const handleSelectSample = (sample: Exam) => {
    let examToLoad = sample;
    if (sample.subject.toLowerCase().includes('estatística')) {
      examToLoad = getRandomEspacialExam();
    }
    onExamLoaded(examToLoad);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Submeter Teste de Faculdade</h2>
              <p className="text-xs text-slate-400">Replica questões e respostas ipsis verbis a partir de PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Submeter PDF
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'samples'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <School className="w-4 h-4" />
            Testes de Exemplo Prontos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'text'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Colar Enunciado
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col gap-2.5 text-rose-900 text-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block mb-0.5">Aviso no processamento do teste</span>
                  <div className="leading-relaxed">{errorMessage}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-200/60 ml-8">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setActiveTab('samples');
                  }}
                  className="px-3 py-1 bg-white hover:bg-rose-100/50 border border-rose-300 text-rose-800 rounded-lg font-semibold transition"
                >
                  Experimentar Testes de Exemplo Prontos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setActiveTab('text');
                  }}
                  className="px-3 py-1 bg-white hover:bg-rose-100/50 border border-rose-300 text-rose-800 rounded-lg font-semibold transition"
                >
                  Colar Texto do Enunciado
                </button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileInput}
                className="hidden"
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                      <FileCheck className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500 mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Pronto para analisar
                    </span>
                    <span className="mt-3 text-xs text-indigo-600 hover:underline">
                      Clique para escolher outro ficheiro
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                      <FileUp className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">
                      Arraste e largue o PDF do teste aqui
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      ou clique para procurar no seu computador (máx. 30MB)
                    </span>
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      Gemini AI replica alíneas A, B, C, D ipsis verbis e identifica a resposta certa
                    </div>
                  </div>
                )}
              </div>

              {/* Informative Tip */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Dica:</strong> Pode submeter testes com ou sem gabarito. Se o documento contiver as soluções oficiais, o sistema adota-as integralmente; caso contrário, a IA resolve as questões e apresenta a fundamentação correspondente.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Teste de imediato o simulador com exames universitários autênticos pré-carregados:
              </p>
              <div className="space-y-2.5">
                {SAMPLE_EXAMS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 transition cursor-pointer flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {sample.subject}
                        </span>
                        <span className="text-xs text-slate-500">{sample.year}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900 mt-1 group-hover:text-indigo-600 transition">
                        {sample.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {sample.questions.length} questões de escolha múltipla • {sample.institution}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-800">
                  Cole aqui as perguntas e opções do teste (ou enunciado completo):
                </label>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  Funciona 100% Local / Sem Gemini
                </span>
              </div>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Exemplo:&#10;Pergunta 1&#10;A função Describe do ArcPy:&#10;* a. Devolve um objeto contendo diversa informação...&#10;* b. Devolve um objeto que descreve a estrutura...&#10;&#10;Pergunta 2&#10;Ao implementar um fluxo..."
                rows={10}
                className="w-full p-3.5 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">
                  Processa diretamente no navegador sem depender de serviços externos.
                </span>
                <button
                  type="button"
                  onClick={handleProcessLocally}
                  disabled={!pastedText.trim()}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Processar Imediatamente (100% Local)
                </button>
              </div>
            </div>
          )}

          {/* Loading state bar */}
          {isLoading && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-indigo-900 block">A processar exame</span>
                <span className="text-indigo-700">{loadingStep || 'A analisar com Gemini AI...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition"
          >
            Cancelar
          </button>

          {activeTab !== 'samples' && (
            <button
              type="button"
              onClick={handleProcessExam}
              disabled={isLoading || (!selectedFile && !pastedText.trim())}
              className={`px-6 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition flex items-center gap-2 ${
                isLoading || (!selectedFile && !pastedText.trim())
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'A processar...' : 'Iniciar Simulação Ipsis Verbis'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

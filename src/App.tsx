import React, { useState, useEffect } from 'react';
import { Exam, DisciplineConfig, QuestionAnswerState } from './types/exam';
import { SAMPLE_EXAMS } from './data/sampleExams';
import { DEFAULT_DISCIPLINE_CONFIGS } from './data/defaultDisciplines';
import { calculateSimulationScore } from './utils/gradeCalculator';
import { Header } from './components/Header';
import { DisciplineConfigModal } from './components/DisciplineConfigModal';
import { ExamUploader } from './components/ExamUploader';
import { QuestionCard } from './components/QuestionCard';
import { ExamSidebar } from './components/ExamSidebar';
import { ExamResultsView } from './components/ExamResultsView';
import {
  Upload,
  BookOpen,
  Sparkles,
  Award,
  Zap,
  Info,
  ChevronRight,
  School,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  // Active exam (starts with SAPROG 39 questions)
  const [currentExam, setCurrentExam] = useState<Exam | null>(SAMPLE_EXAMS[0]);

  // Load saved discipline configuration or default to SAPROG
  const [currentConfig, setCurrentConfig] = useState<DisciplineConfig>(() => {
    try {
      const saved = localStorage.getItem('simulador_discipline_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'saprog-python') return parsed;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_DISCIPLINE_CONFIGS[0];
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswerState>>({});
  const [studyMode, setStudyMode] = useState<'instant' | 'exam'>('instant');
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);

  // Modals
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Calculate live score and summary whenever answers, exam, or config changes
  const summary = currentExam
    ? calculateSimulationScore(currentExam, answers, currentConfig)
    : {
        totalQuestions: 0,
        answeredCount: 0,
        correctCount: 0,
        partialCount: 0,
        wrongCount: 0,
        blankCount: 0,
        pointsEarned: 0,
        pointsPenalized: 0,
        finalGrade: 0,
        totalScale: currentConfig.totalScale,
        passingGrade: currentConfig.passingGrade,
        passed: false,
        percentage: 0,
        disciplineConfig: currentConfig,
      };

  const handleToggleOption = (optionKey: string) => {
    if (!currentExam) return;
    const currentQ = currentExam.questions[currentQuestionIndex];
    if (!currentQ) return;

    const optKeyNorm = optionKey.trim().toLowerCase();
    const isMultiOption = (currentQ.multiSelect ?? false) || (currentQ.correctOptionKeys && currentQ.correctOptionKeys.length > 1);

    setAnswers((prev) => {
      const existing = prev[currentQ.id];
      const prevKeys = existing?.selectedOptionKeys || (existing?.selectedOptionKey ? [existing.selectedOptionKey] : []);

      let newKeys: string[];
      if (isMultiOption) {
        if (prevKeys.map((k) => k.toLowerCase()).includes(optKeyNorm)) {
          newKeys = prevKeys.filter((k) => k.toLowerCase() !== optKeyNorm);
        } else {
          newKeys = [...prevKeys, optKeyNorm];
        }
      } else {
        newKeys = [optKeyNorm];
      }

      const isAnswered = newKeys.length > 0;

      return {
        ...prev,
        [currentQ.id]: {
          questionId: currentQ.id,
          selectedOptionKeys: newKeys,
          selectedOptionKey: newKeys[0] || null,
          isAnswered,
          isConfirmed: false,
          isCorrect: null,
          earnedPoints: 0,
        },
      };
    });
  };

  const handleConfirmAnswer = () => {
    if (!currentExam) return;
    const currentQ = currentExam.questions[currentQuestionIndex];
    if (!currentQ) return;

    setAnswers((prev) => {
      const existing = prev[currentQ.id];
      if (!existing || !existing.isAnswered) return prev;

      return {
        ...prev,
        [currentQ.id]: {
          ...existing,
          isConfirmed: true,
        },
      };
    });
  };

  const handleClearAnswer = () => {
    if (!currentExam) return;
    const currentQ = currentExam.questions[currentQuestionIndex];
    if (!currentQ) return;

    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleResetExam = () => {
    setAnswers({});
    setIsExamSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const handleRetryMistakesOnly = (wrongIds: string[]) => {
    if (!currentExam) return;
    const filteredQuestions = currentExam.questions.filter((q) => wrongIds.includes(q.id));
    if (filteredQuestions.length === 0) return;

    const newMistakesExam: Exam = {
      ...currentExam,
      id: `${currentExam.id}-mistakes-${Date.now()}`,
      title: `Caderno de Erros • ${currentExam.title}`,
      questions: filteredQuestions,
    };

    setCurrentExam(newMistakesExam);
    setAnswers({});
    setIsExamSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const handleExamLoaded = (newExam: Exam) => {
    setCurrentExam(newExam);
    setAnswers({});
    setIsExamSubmitted(false);
    setCurrentQuestionIndex(0);

    // Auto-match discipline preset if available
    if (newExam.disciplineConfigId) {
      const matched = DEFAULT_DISCIPLINE_CONFIGS.find((c) => c.id === newExam.disciplineConfigId);
      if (matched) {
        setCurrentConfig(matched);
      }
    }
  };

  const handleSaveConfig = (newConfig: DisciplineConfig) => {
    setCurrentConfig(newConfig);
    try {
      localStorage.setItem('simulador_discipline_config', JSON.stringify(newConfig));
    } catch (e) {
      // ignore
    }
  };

  const currentQuestion = currentExam?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        currentExam={currentExam}
        currentConfig={currentConfig}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onResetExam={handleResetExam}
        studyMode={studyMode}
        setStudyMode={setStudyMode}
        currentGrade={summary.finalGrade}
        isCompleted={isExamSubmitted}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner with Active Subject & Exam Info */}
        {currentExam && (
          <div className="mb-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                    {currentExam.subject}
                  </span>
                  {currentExam.year && (
                    <span className="text-xs text-slate-500 font-medium">
                      {currentExam.year}
                    </span>
                  )}
                  {currentExam.institution && (
                    <span className="text-xs text-slate-400 hidden md:inline">
                      • {currentExam.institution}
                    </span>
                  )}
                </div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {currentExam.title}
                </h1>
              </div>
            </div>

            {/* Switch Test Dropdown / Quick Picker */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 transition flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Mudar Teste
              </button>
            </div>
          </div>
        )}

        {/* View Routing: Results View OR Active Simulation View */}
        {isExamSubmitted && currentExam ? (
          <ExamResultsView
            exam={currentExam}
            answers={answers}
            summary={summary}
            disciplineConfig={currentConfig}
            onResetExam={handleResetExam}
            onRetryMistakesOnly={handleRetryMistakesOnly}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onSelectQuestion={(idx) => {
              setCurrentQuestionIndex(idx);
              setIsExamSubmitted(false);
            }}
          />
        ) : currentExam && currentQuestion ? (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Column: Verbatim Question Card */}
            <div className="flex-1 w-full space-y-4">
              <QuestionCard
                question={currentQuestion}
                currentIndex={currentQuestionIndex}
                totalQuestions={currentExam.questions.length}
                answerState={answers[currentQuestion.id]}
                onToggleOption={handleToggleOption}
                onConfirmAnswer={handleConfirmAnswer}
                onClearAnswer={handleClearAnswer}
                disciplineConfig={currentConfig}
                examTotalScale={currentConfig.totalScale}
                studyMode={studyMode}
                isExamSubmitted={isExamSubmitted}
                onNextQuestion={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(prev + 1, currentExam.questions.length - 1)
                  )
                }
                onPrevQuestion={() =>
                  setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                }
                subjectName={currentExam.subject}
              />
            </div>

            {/* Right Column: Score, Navigation Matrix and Discipline Rules */}
            <ExamSidebar
              exam={currentExam}
              currentIndex={currentQuestionIndex}
              onSelectIndex={(idx) => setCurrentQuestionIndex(idx)}
              answers={answers}
              disciplineConfig={currentConfig}
              studyMode={studyMode}
              isExamSubmitted={isExamSubmitted}
              onSubmitExam={() => setIsExamSubmitted(true)}
              onResetExam={handleResetExam}
              summary={summary}
              onOpenConfigModal={() => setIsConfigModalOpen(true)}
            />
          </div>
        ) : (
          /* Empty state when no exam is loaded */
          <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Nenhum teste selecionado
            </h2>
            <p className="text-sm text-slate-500">
              Submeta o PDF de um teste antigo da faculdade ou escolha um teste de exemplo.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition"
            >
              Submeter PDF de Teste
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Simulador de Testes Universitários • Replicação Ipsis Verbis & Avaliação Automática
          </span>
          <span className="text-slate-400">
            Regra ativa: {currentConfig.name} ({currentConfig.penaltyMode === 'none' ? 'Sem desconto' : `-${currentConfig.penaltyFraction * 100}%/errada`})
          </span>
        </div>
      </footer>

      {/* Config Modal */}
      <DisciplineConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentConfig={currentConfig}
        onSaveConfig={handleSaveConfig}
      />

      {/* Upload Modal */}
      <ExamUploader
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onExamLoaded={handleExamLoaded}
        currentConfig={currentConfig}
      />
    </div>
  );
}

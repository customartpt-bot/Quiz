import React, { useState } from 'react';
import { Question, ExamOption, DisciplineConfig, QuestionAnswerState } from '../types/exam';
import {
  getQuestionValue,
  getPenaltyValue,
  getQuestionCorrectKeys,
  calculateQuestionScore,
} from '../utils/gradeCalculator';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  X,
  Send,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';

interface Props {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  answerState?: QuestionAnswerState;
  onToggleOption: (optionKey: string) => void;
  onConfirmAnswer: () => void;
  onClearAnswer: () => void;
  disciplineConfig: DisciplineConfig;
  examTotalScale: number;
  studyMode: 'instant' | 'exam';
  isExamSubmitted: boolean;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  subjectName?: string;
}

export const QuestionCard: React.FC<Props> = ({
  question,
  currentIndex,
  totalQuestions,
  answerState,
  onToggleOption,
  onConfirmAnswer,
  onClearAnswer,
  disciplineConfig,
  studyMode,
  isExamSubmitted,
  onNextQuestion,
  onPrevQuestion,
  subjectName,
}) => {
  const [deepExplanation, setDeepExplanation] = useState<string | null>(null);
  const [loadingDeepExp, setLoadingDeepExp] = useState(false);

  const correctKeys = getQuestionCorrectKeys(question);
  const isMultiOption = (question.multiSelect ?? false) || correctKeys.length > 1;

  // Selected options by user
  const selectedKeys =
    answerState?.selectedOptionKeys ||
    (answerState?.selectedOptionKey ? [answerState.selectedOptionKey] : []);

  const isConfirmed = Boolean(answerState?.isConfirmed);
  const isAnswered = selectedKeys.length > 0;

  // Feedback is displayed if user confirmed in instant mode OR if the entire exam was submitted
  const showFeedback = (studyMode === 'instant' && isConfirmed) || isExamSubmitted;

  // Detailed score calculation for this question
  const scoreBreakdown = calculateQuestionScore(
    question,
    selectedKeys,
    { questions: new Array(totalQuestions) } as any,
    disciplineConfig
  );

  const qValue = getQuestionValue(question, { questions: new Array(totalQuestions) } as any, disciplineConfig);
  const penaltyPerUnit = getPenaltyValue(scoreBreakdown.valuePerCorrectOption, disciplineConfig);

  const handleRequestDeepExplanation = async () => {
    if (deepExplanation) return;
    setLoadingDeepExp(true);
    try {
      const res = await fetch('/api/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.text,
          options: question.options,
          selectedOption: selectedKeys.join(', '),
          correctOption: correctKeys.join(', '),
          subject: subjectName,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setDeepExplanation(data.explanation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeepExp(false);
    }
  };

  const handleNextWithAutoConfirm = () => {
    if (!isConfirmed && isAnswered) {
      onConfirmAnswer();
    }
    onNextQuestion();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
            {question.number || currentIndex + 1}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Questão {currentIndex + 1} de {totalQuestions}
              </span>
              {isMultiOption && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  {correctKeys.length} Respostas Corretas (Seleção Múltipla)
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400">
              {isMultiOption
                ? `Selecione as opções e confirme com Submeter / Next • Cada correta: +${scoreBreakdown.valuePerCorrectOption.toFixed(2)} val`
                : 'Selecione uma opção e confirme'}
            </div>
          </div>
        </div>

        {/* Scoring Indicators */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
            Cotação: <strong className="text-indigo-600">+{qValue.toFixed(2)} val</strong>
            {isMultiOption && (
              <span className="text-slate-400 font-normal">
                {' '}
                ({scoreBreakdown.valuePerCorrectOption.toFixed(2)} val cada)
              </span>
            )}
          </span>

          {penaltyPerUnit > 0 ? (
            <span className="text-xs font-medium px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
              Errada: <strong>-{penaltyPerUnit.toFixed(2)} val</strong>
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-500">
              Sem penalização
            </span>
          )}

          {/* Feedback status badge */}
          {showFeedback && isAnswered && (
            <span
              className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs ${
                scoreBreakdown.isFullyCorrect
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : scoreBreakdown.isPartiallyCorrect
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {scoreBreakdown.isFullyCorrect ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  TOTALMENTE CERTO (+{scoreBreakdown.netScore.toFixed(2)})
                </>
              ) : scoreBreakdown.isPartiallyCorrect ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  PARCIALMENTE CERTO (+{scoreBreakdown.netScore.toFixed(2)})
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" />
                  ERRADO ({penaltyPerUnit > 0 ? `-${scoreBreakdown.penalties.toFixed(2)}` : '0 pts'})
                </>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="p-6 sm:p-7">
        <div className="space-y-3 select-text">
          {question.text.split('\n\n').map((paragraph, pIdx) => {
            const isCodeBlock =
              paragraph.includes('def ') ||
              paragraph.includes('print(') ||
              paragraph.includes('print ') ||
              paragraph.includes('del ') ||
              paragraph.includes('len(') ||
              paragraph.includes('set(') ||
              paragraph.includes("test = '") ||
              paragraph.includes("a = 1");

            if (isCodeBlock) {
              return (
                <div
                  key={pIdx}
                  className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm rounded-xl overflow-x-auto border border-slate-800 shadow-inner"
                >
                  <pre className="leading-relaxed">{paragraph}</pre>
                </div>
              );
            }

            return (
              <p
                key={pIdx}
                className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed"
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Options List */}
        <div className="mt-6 space-y-3">
          {question.options.map((option: ExamOption) => {
            const optionKeyNorm = option.key.trim().toLowerCase();
            const isSelected = selectedKeys.map((k) => k.toLowerCase()).includes(optionKeyNorm);
            const isCorrectOption = correctKeys.includes(optionKeyNorm);

            let containerClass =
              'border-slate-200 bg-white hover:bg-slate-50/80 text-slate-800 cursor-pointer';
            let badgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
            let statusIcon = null;

            if (showFeedback) {
              if (isSelected && isCorrectOption) {
                // User selected correct -> Vivid Emerald Green
                containerClass =
                  'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-medium ring-2 ring-emerald-500/30';
                badgeClass = 'bg-emerald-600 text-white border-emerald-600';
                statusIcon = (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Correto (+{scoreBreakdown.valuePerCorrectOption.toFixed(2)} val)
                  </span>
                );
              } else if (isSelected && !isCorrectOption) {
                // User selected wrong -> Vivid Rose Red
                containerClass =
                  'border-rose-500 bg-rose-50/90 text-rose-950 font-medium ring-2 ring-rose-500/30';
                badgeClass = 'bg-rose-600 text-white border-rose-600';
                statusIcon = (
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    Incorreto ({penaltyPerUnit > 0 ? `-${penaltyPerUnit.toFixed(2)} val` : '0 val'})
                  </span>
                );
              } else if (!isSelected && isCorrectOption) {
                // User missed this correct option -> Highlight in dashed green
                containerClass =
                  'border-emerald-400 bg-emerald-50/40 text-emerald-950 border-dashed border-2';
                badgeClass = 'bg-emerald-500 text-white border-emerald-500';
                statusIcon = (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Resposta Correta (Faltou assinalar)
                  </span>
                );
              } else {
                // Other options muted
                containerClass = 'border-slate-200 bg-slate-50/40 text-slate-400 opacity-60';
                badgeClass = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            } else if (isSelected) {
              // Selected before confirmation
              containerClass =
                'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium ring-2 ring-indigo-500/20';
              badgeClass = 'bg-indigo-600 text-white border-indigo-600';
              statusIcon = (
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                  Selecionada
                </span>
              );
            }

            return (
              <div
                key={option.key}
                onClick={() => {
                  if (showFeedback && studyMode === 'instant') {
                    // Allow toggling even after feedback if student wants to experiment in study mode
                    onToggleOption(option.key);
                  } else if (!isExamSubmitted) {
                    onToggleOption(option.key);
                  }
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 relative group shadow-2xs select-none ${containerClass}`}
              >
                {/* Checkbox / Radio Icon */}
                <div className="pt-0.5 flex-shrink-0">
                  {isMultiOption ? (
                    isSelected ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                    )
                  ) : null}
                </div>

                {/* Option Letter Badge (A, B, C...) */}
                <div
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 border transition ${badgeClass}`}
                >
                  {option.key.toUpperCase()}
                </div>

                {/* Option Text */}
                <div className="flex-1 text-sm sm:text-base leading-snug whitespace-pre-wrap select-text pt-0.5">
                  {option.text}
                </div>

                {/* Status Indicator */}
                {statusIcon && <div className="ml-2 flex-shrink-0">{statusIcon}</div>}
              </div>
            );
          })}
        </div>

        {/* Selection Confirmation Action Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {isAnswered && !isExamSubmitted && (
              <button
                type="button"
                onClick={onClearAnswer}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar Seleção (Deixar em branco)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {!isConfirmed && isAnswered && !isExamSubmitted && (
              <button
                type="button"
                onClick={onConfirmAnswer}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs flex items-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                Confirmar Resposta & Ver Correção
              </button>
            )}
          </div>
        </div>

        {/* Immediate Academic Feedback & Explanation Panel */}
        {showFeedback && (
          <div
            className={`mt-6 p-5 rounded-xl border transition-all ${
              scoreBreakdown.isFullyCorrect
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                : scoreBreakdown.isPartiallyCorrect
                ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                : 'bg-rose-50/60 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  scoreBreakdown.isFullyCorrect
                    ? 'bg-emerald-100 text-emerald-700'
                    : scoreBreakdown.isPartiallyCorrect
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {scoreBreakdown.isFullyCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : scoreBreakdown.isPartiallyCorrect ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-sm">
                    {scoreBreakdown.isFullyCorrect
                      ? 'Correto! Todas as opções corretas foram assinaladas.'
                      : scoreBreakdown.isPartiallyCorrect
                      ? `Acerto parcial (+${scoreBreakdown.netScore.toFixed(2)} val). Opções corretas: (${correctKeys.join(', ').toUpperCase()}).`
                      : `Incorreto! A(s) resposta(s) correta(s) do exame: (${correctKeys.join(', ').toUpperCase()}).`}
                  </h4>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200">
                    Critério Oficial
                  </span>
                </div>

                {/* Resolution Text */}
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 bg-white/70 p-3 rounded-lg border border-slate-200/60">
                  {question.explanation ||
                    `A(s) alínea(s) (${correctKeys.join(', ').toUpperCase()}) satisfaz(em) rigorosamente os critérios científicos do enunciado.`}
                </p>

                {/* Deep Explanation Toggle */}
                <div className="pt-2">
                  {!deepExplanation ? (
                    <button
                      type="button"
                      onClick={handleRequestDeepExplanation}
                      disabled={loadingDeepExp}
                      className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg border border-indigo-200 flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      {loadingDeepExp
                        ? 'Professor a preparar explicação detalhada...'
                        : 'Ver Explicação Aprofundada / Dica do Professor'}
                    </button>
                  ) : (
                    <div className="mt-2 p-3.5 bg-indigo-50/80 rounded-lg border border-indigo-200 text-xs text-indigo-950 space-y-1.5 whitespace-pre-wrap">
                      <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Tutoria Aprofundada do Professor Universitário:
                      </div>
                      <div className="text-slate-800 leading-relaxed">{deepExplanation}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between mt-auto">
        <button
          type="button"
          onClick={onPrevQuestion}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
            currentIndex === 0
              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
              : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="text-xs text-slate-500 font-medium">
          {currentIndex + 1} de {totalQuestions}
        </div>

        <button
          type="button"
          onClick={handleNextWithAutoConfirm}
          disabled={currentIndex === totalQuestions - 1}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border shadow-xs transition ${
            currentIndex === totalQuestions - 1
              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
              : 'border-indigo-600 text-white bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Seguinte (Next)
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

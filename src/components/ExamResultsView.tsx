import React, { useState, useEffect } from 'react';
import { Exam, DisciplineConfig, QuestionAnswerState, SimulationSummary } from '../types/exam';
import {
  getQuestionValue,
  getPenaltyValue,
  calculateQuestionScore,
  getQuestionCorrectKeys,
} from '../utils/gradeCalculator';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Upload,
  Printer,
  Sparkles,
  BookOpen,
  Filter,
  ArrowRight,
  Check,
  X,
  Target,
  AlertCircle,
} from 'lucide-react';

interface Props {
  exam: Exam;
  answers: Record<string, QuestionAnswerState>;
  summary: SimulationSummary;
  disciplineConfig: DisciplineConfig;
  onResetExam: () => void;
  onRetryMistakesOnly: (wrongQuestionsIds: string[]) => void;
  onOpenUploadModal: () => void;
  onSelectQuestion: (index: number) => void;
}

export const ExamResultsView: React.FC<Props> = ({
  exam,
  answers,
  summary,
  disciplineConfig,
  onResetExam,
  onRetryMistakesOnly,
  onOpenUploadModal,
  onSelectQuestion,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct' | 'blank'>('all');

  useEffect(() => {
    if (summary.passed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if not supported
      }
    }
  }, [summary.passed]);

  const wrongQuestions = exam.questions.filter((q) => {
    const ans = answers[q.id];
    const selected = ans?.selectedOptionKeys || (ans?.selectedOptionKey ? [ans.selectedOptionKey] : []);
    if (!ans || !ans.isAnswered || selected.length === 0) return false;
    const score = calculateQuestionScore(q, selected, exam, disciplineConfig);
    return !score.isFullyCorrect;
  });

  const correctQuestions = exam.questions.filter((q) => {
    const ans = answers[q.id];
    const selected = ans?.selectedOptionKeys || (ans?.selectedOptionKey ? [ans.selectedOptionKey] : []);
    if (!ans || !ans.isAnswered || selected.length === 0) return false;
    const score = calculateQuestionScore(q, selected, exam, disciplineConfig);
    return score.isFullyCorrect;
  });

  const blankQuestions = exam.questions.filter((q) => {
    const ans = answers[q.id];
    const selected = ans?.selectedOptionKeys || (ans?.selectedOptionKey ? [ans.selectedOptionKey] : []);
    return !ans || !ans.isAnswered || selected.length === 0;
  });

  const filteredQuestions = exam.questions.filter((q) => {
    if (filterMode === 'wrong') return wrongQuestions.some((wq) => wq.id === q.id);
    if (filterMode === 'correct') return correctQuestions.some((cq) => cq.id === q.id);
    if (filterMode === 'blank') return blankQuestions.some((bq) => bq.id === q.id);
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Hero Banner with Final Grade */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-all ${
          summary.passed
            ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-300'
            : 'bg-gradient-to-br from-amber-50 via-rose-50 to-white border-rose-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center lg:text-left">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                summary.passed
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-amber-600 text-white shadow-amber-200'
              }`}
            >
              {summary.passed ? <Trophy className="w-10 h-10" /> : <Target className="w-10 h-10" />}
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    summary.passed
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-rose-200 text-rose-900'
                  }`}
                >
                  {summary.passed ? 'Aprovado na Disciplina' : 'Não Atingiu a Nota de Corte'}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Critério: {disciplineConfig.passingGrade} valores
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {exam.title}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {exam.subject} • {disciplineConfig.name}
              </p>
            </div>
          </div>

          {/* Big Score Display */}
          <div className="flex flex-col items-center bg-white/90 backdrop-blur-xs px-8 py-5 rounded-2xl border border-slate-200 shadow-xs min-w-[220px]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nota Final Obtida
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span
                className={`text-4xl sm:text-5xl font-black tracking-tight ${
                  summary.passed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {summary.finalGrade.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-slate-400">/{summary.totalScale}</span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Taxa líquida de aproveitamento: {summary.percentage}%
            </span>
          </div>
        </div>

        {/* Detailed Scoring Formula Breakdown */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
            <div className="text-slate-500">Acertos ({summary.correctCount} questões)</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">
              +{summary.pointsEarned.toFixed(2)} val
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
            <div className="text-slate-500">
              Penalização de Erros ({summary.wrongCount} erradas)
            </div>
            <div className="text-lg font-bold text-rose-700 mt-0.5">
              -{summary.pointsPenalized.toFixed(2)} val
            </div>
            <div className="text-[10px] text-slate-400">
              Regra: {disciplineConfig.penaltyMode === 'fraction' ? `-${disciplineConfig.penaltyFraction * 100}%/errada` : 'sem desconto'}
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
            <div className="text-slate-500">Em Branco ({summary.blankCount} questões)</div>
            <div className="text-lg font-bold text-slate-700 mt-0.5">0.00 val</div>
            <div className="text-[10px] text-slate-400">Não pontua nem desconta</div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
            <div className="text-slate-500">Cálculo Rigoroso da Nota</div>
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {summary.pointsEarned.toFixed(2)} - {summary.pointsPenalized.toFixed(2)} ={' '}
              <span className="font-bold text-indigo-700">{summary.finalGrade.toFixed(2)} val</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {wrongQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => onRetryMistakesOnly(wrongQuestions.map((q) => q.id))}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <RotateCcw className="w-4 h-4" />
              Treinar Apenas as {wrongQuestions.length} Questões Erradas
            </button>
          )}

          <button
            type="button"
            onClick={onResetExam}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Refazer Teste Completo
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Imprimir / Guardar Relatório
          </button>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 ml-auto transition"
          >
            <Upload className="w-4 h-4" />
            Simular Outro Teste (PDF)
          </button>
        </div>
      </div>

      {/* Question Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Revisão Detalhada de Respostas & Critérios
          </h3>
          <p className="text-xs text-slate-500">
            Enunciados e opções ipsis verbis com indicação cromática da resposta certa e do erro
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({exam.questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('wrong')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              filterMode === 'wrong'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:text-rose-900'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            Erradas ({wrongQuestions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('correct')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              filterMode === 'correct'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            Certas ({correctQuestions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('blank')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              filterMode === 'blank'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Em Branco ({blankQuestions.length})
          </button>
        </div>
      </div>

      {/* Question List Review Cards */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const originalIndex = exam.questions.findIndex((item) => item.id === q.id);
          const ans = answers[q.id];
          const selectedKeys =
            ans?.selectedOptionKeys || (ans?.selectedOptionKey ? [ans.selectedOptionKey] : []);
          const isAnswered = selectedKeys.length > 0;
          const correctKeys = getQuestionCorrectKeys(q);
          const scoreBreakdown = calculateQuestionScore(q, selectedKeys, exam, disciplineConfig);

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border p-6 shadow-2xs transition ${
                !isAnswered
                  ? 'border-slate-200'
                  : scoreBreakdown.isFullyCorrect
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : scoreBreakdown.isPartiallyCorrect
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-rose-300 bg-rose-50/20'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center text-white ${
                      !isAnswered
                        ? 'bg-slate-400'
                        : scoreBreakdown.isFullyCorrect
                        ? 'bg-emerald-600'
                        : scoreBreakdown.isPartiallyCorrect
                        ? 'bg-amber-600'
                        : 'bg-rose-600'
                    }`}
                  >
                    {q.number || originalIndex + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-700">
                      Questão {originalIndex + 1}
                    </span>
                    {correctKeys.length > 1 && (
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full ml-2 border border-purple-200">
                        {correctKeys.length} Respostas Corretas
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                      !isAnswered
                        ? 'bg-slate-100 text-slate-600'
                        : scoreBreakdown.isFullyCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : scoreBreakdown.isPartiallyCorrect
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {!isAnswered ? (
                      'Em branco (0 pts)'
                    ) : scoreBreakdown.isFullyCorrect ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Totalmente Certo (+{scoreBreakdown.netScore.toFixed(2)} val)
                      </>
                    ) : scoreBreakdown.isPartiallyCorrect ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Parcial (+{scoreBreakdown.netScore.toFixed(2)} val)
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        Errado ({scoreBreakdown.penalties > 0 ? `-${scoreBreakdown.penalties.toFixed(2)} val` : '0 pts'})
                      </>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectQuestion(originalIndex)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold ml-2 hover:underline flex items-center gap-1"
                  >
                    Abrir no simulador
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2 select-text">
                {q.text.split('\n\n').map((paragraph, pIdx) => {
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
                        className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800"
                      >
                        <pre className="leading-relaxed">{paragraph}</pre>
                      </div>
                    );
                  }

                  return (
                    <p key={pIdx} className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Options Breakdown */}
              <div className="mt-4 space-y-2">
                {q.options.map((opt) => {
                  const optKeyNorm = opt.key.trim().toLowerCase();
                  const isUserSelection = selectedKeys.map((k) => k.toLowerCase()).includes(optKeyNorm);
                  const isTheCorrectOption = correctKeys.includes(optKeyNorm);

                  let optClass = 'border-slate-200 bg-white text-slate-700';
                  let badgeClass = 'bg-slate-100 text-slate-600 border-slate-300';
                  let statusLabel = null;

                  if (isUserSelection && isTheCorrectOption) {
                    optClass = 'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    badgeClass = 'bg-emerald-600 text-white border-emerald-600';
                    statusLabel = (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Correto (+{scoreBreakdown.valuePerCorrectOption.toFixed(2)} val)
                      </span>
                    );
                  } else if (isUserSelection && !isTheCorrectOption) {
                    optClass = 'border-rose-500 bg-rose-50/90 text-rose-950 font-semibold ring-1 ring-rose-500';
                    badgeClass = 'bg-rose-600 text-white border-rose-600';
                    statusLabel = (
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        A sua escolha (Incorreta)
                      </span>
                    );
                  } else if (!isUserSelection && isTheCorrectOption) {
                    optClass = 'border-emerald-400 bg-emerald-50/50 text-emerald-950 font-medium border-dashed border-2';
                    badgeClass = 'bg-emerald-500 text-white border-emerald-500';
                    statusLabel = (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Resposta Correta (Não assinalada)
                      </span>
                    );
                  }

                  return (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition ${optClass}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center flex-shrink-0 border ${badgeClass}`}
                      >
                        {opt.key}
                      </span>
                      <div className="flex-1 leading-snug whitespace-pre-wrap pt-0.5">
                        {opt.text}
                      </div>
                      {statusLabel && <div className="flex-shrink-0 ml-2">{statusLabel}</div>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation note */}
              {q.explanation && (
                <div className="mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">
                    Critério de Correção / Resolução:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

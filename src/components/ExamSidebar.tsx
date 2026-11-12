import React from 'react';
import { Exam, DisciplineConfig, QuestionAnswerState, SimulationSummary } from '../types/exam';
import { calculateQuestionScore } from '../utils/gradeCalculator';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  Sliders,
  AlertTriangle,
  Send,
  RotateCcw,
} from 'lucide-react';

interface Props {
  exam: Exam;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  answers: Record<string, QuestionAnswerState>;
  disciplineConfig: DisciplineConfig;
  studyMode: 'instant' | 'exam';
  isExamSubmitted: boolean;
  onSubmitExam: () => void;
  onResetExam: () => void;
  summary: SimulationSummary;
  onOpenConfigModal: () => void;
}

export const ExamSidebar: React.FC<Props> = ({
  exam,
  currentIndex,
  onSelectIndex,
  answers,
  disciplineConfig,
  studyMode,
  isExamSubmitted,
  onSubmitExam,
  onResetExam,
  summary,
  onOpenConfigModal,
}) => {
  const showResults = studyMode === 'instant' || isExamSubmitted;

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-4">
      {/* Live Score & Progress Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isExamSubmitted ? 'Resultado Final' : 'Progresso da Simulação'}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
            {summary.answeredCount}/{summary.totalQuestions} resp.
          </span>
        </div>

        {/* Big Grade Box */}
        <div
          className={`p-4 rounded-xl border text-center transition-all ${
            showResults
              ? summary.passed
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/70 border-amber-300 text-amber-950'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <div className="text-xs font-medium text-slate-500 mb-0.5">
            {showResults ? 'Nota com Penalizações' : 'Respostas Registadas'}
          </div>

          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold tracking-tight">
              {showResults ? summary.finalGrade.toFixed(2) : summary.answeredCount}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              {showResults ? `/${summary.totalScale}` : `/${summary.totalQuestions}`}
            </span>
          </div>

          {showResults && (
            <div className="mt-1.5 flex items-center justify-center gap-1.5">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  summary.passed
                    ? 'bg-emerald-200/80 text-emerald-900'
                    : 'bg-rose-200/80 text-rose-900'
                }`}
              >
                {summary.passed
                  ? `APROVADO (>= ${summary.passingGrade})`
                  : `REPROVADO (< ${summary.passingGrade})`}
              </span>
            </div>
          )}
        </div>

        {/* Mini stats breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
          <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <div className="text-[11px] text-slate-500 font-medium">Certas</div>
            <div className="text-sm font-bold text-emerald-700">
              {showResults ? summary.correctCount : '-'}
            </div>
            {showResults && (
              <div className="text-[10px] text-emerald-600 font-semibold">
                +{summary.pointsEarned.toFixed(1)} val
              </div>
            )}
          </div>

          <div className="p-2 bg-rose-50/50 rounded-lg border border-rose-100">
            <div className="text-[11px] text-slate-500 font-medium">Erradas</div>
            <div className="text-sm font-bold text-rose-700">
              {showResults ? summary.wrongCount : '-'}
            </div>
            {showResults && (
              <div className="text-[10px] text-rose-600 font-semibold">
                -{summary.pointsPenalized.toFixed(1)} val
              </div>
            )}
          </div>

          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">Em Branco</div>
            <div className="text-sm font-bold text-slate-700">{summary.blankCount}</div>
            <div className="text-[10px] text-slate-400">0 val</div>
          </div>
        </div>
      </div>

      {/* Question Quick Jump Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Navegador de Questões
          </span>
          <span className="text-[11px] text-slate-400">Clique para saltar</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {exam.questions.map((q, idx) => {
            const ans = answers[q.id];
            const isCurrent = idx === currentIndex;
            const selectedKeys =
              ans?.selectedOptionKeys || (ans?.selectedOptionKey ? [ans.selectedOptionKey] : []);
            const isAnswered = selectedKeys.length > 0;
            const isConfirmed = Boolean(ans?.isConfirmed);

            const scoreBreakdown = calculateQuestionScore(q, selectedKeys, exam, disciplineConfig);

            let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100';

            if (showResults && (isConfirmed || isExamSubmitted)) {
              if (isAnswered) {
                if (scoreBreakdown.isFullyCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-500 text-white font-bold shadow-xs';
                } else if (scoreBreakdown.isPartiallyCorrect) {
                  btnStyle = 'border-amber-500 bg-amber-500 text-white font-bold shadow-xs';
                } else {
                  btnStyle = 'border-rose-500 bg-rose-500 text-white font-bold shadow-xs';
                }
              } else {
                btnStyle = 'border-slate-300 bg-slate-100 text-slate-400';
              }
            } else if (isAnswered) {
              btnStyle = 'border-indigo-600 bg-indigo-600 text-white font-bold';
            }

            if (isCurrent) {
              btnStyle += ' ring-2 ring-offset-2 ring-indigo-500';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`h-11 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${btnStyle}`}
                title={`Questão ${idx + 1}: ${showResults && isAnswered ? `${scoreBreakdown.netScore.toFixed(1)} val` : 'Pendente'}`}
              >
                <span>{idx + 1}</span>
                {showResults && isAnswered ? (
                  <span className="text-[9px] font-bold opacity-95 leading-tight">
                    {scoreBreakdown.netScore.toFixed(1)}v
                  </span>
                ) : (
                  <span className="text-[9px] opacity-70 leading-tight">2.5v</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-[11px] text-slate-500">
          {showResults ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Certa
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                Errada
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                Em branco
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                Respondida
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                Pendente
              </div>
            </>
          )}
        </div>
      </div>

      {/* Discipline Scoring Rule Info Box */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            Regras de Cotação
          </span>
          <button
            type="button"
            onClick={onOpenConfigModal}
            className="text-[11px] text-indigo-600 font-semibold hover:underline"
          >
            Alterar
          </button>
        </div>

        <div className="text-slate-600 space-y-1">
          <div>
            Disciplina: <strong className="text-slate-900">{disciplineConfig.name}</strong>
          </div>
          <div>
            Escala: <strong className="text-slate-900">0 a {disciplineConfig.totalScale} val</strong>
          </div>
          <div>
            Penalização por errada:{' '}
            <strong className="text-rose-700">
              {disciplineConfig.penaltyMode === 'none'
                ? 'Sem penalização'
                : disciplineConfig.penaltyMode === 'fraction'
                ? `-${(disciplineConfig.penaltyFraction * 100).toFixed(0)}% da questão`
                : `-${disciplineConfig.penaltyFixedValue} val fixo`}
            </strong>
          </div>
          <div>
            Nota mínima de corte:{' '}
            <strong className="text-slate-900">{disciplineConfig.passingGrade} valores</strong>
          </div>
        </div>
      </div>

      {/* Submit / Finish Button */}
      {!isExamSubmitted ? (
        <button
          type="button"
          onClick={onSubmitExam}
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition"
        >
          <Send className="w-4 h-4" />
          Concluir Teste & Ver Nota Final
        </button>
      ) : (
        <button
          type="button"
          onClick={onResetExam}
          className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Recomeçar Simulação
        </button>
      )}
    </aside>
  );
};

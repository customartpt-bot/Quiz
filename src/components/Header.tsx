import React from 'react';
import { DisciplineConfig, Exam } from '../types/exam';
import {
  GraduationCap,
  Sliders,
  Upload,
  BookOpen,
  Sparkles,
  Zap,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface Props {
  currentExam: Exam | null;
  currentConfig: DisciplineConfig;
  onOpenConfigModal: () => void;
  onOpenUploadModal: () => void;
  onResetExam: () => void;
  studyMode: 'instant' | 'exam';
  setStudyMode: (mode: 'instant' | 'exam') => void;
  currentGrade?: number;
  isCompleted?: boolean;
  onSelectExamPreset: (presetKey: string) => void;
}

export const Header: React.FC<Props> = ({
  currentExam,
  currentConfig,
  onOpenConfigModal,
  onOpenUploadModal,
  onResetExam,
  studyMode,
  setStudyMode,
  currentGrade,
  isCompleted,
  onSelectExamPreset,
}) => {
  const isEspacial = currentExam?.subject.toLowerCase().includes('estatística');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate">
                  Simulador de Testes
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Ipsis Verbis
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                {currentExam ? `${currentExam.subject} • ${currentExam.title}` : 'Replicação exata de testes de faculdade'}
              </p>
            </div>
          </div>

          {/* Center Mode Switcher */}
          {currentExam && !isCompleted && (
            <div className="hidden lg:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setStudyMode('instant')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  studyMode === 'instant'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Feedback de cor imediato ao responder a cada questão"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Treino Imediato
              </button>
              <button
                type="button"
                onClick={() => setStudyMode('exam')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  studyMode === 'exam'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Simulação estilo exame: responde tudo e vê a nota final no fim"
              >
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Modo Exame Real
              </button>
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Chair Selector Dropdown */}
            <select
              value={isEspacial ? 'estatistica' : 'saprog'}
              onChange={(e) => onSelectExamPreset(e.target.value)}
              className="px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              title="Mudar de Cadeira / Teste"
            >
              <option value="saprog">💻 Programação Geoespacial (SAPROG)</option>
              <option value="estatistica">📊 Estatística Espacial (30 Qs Aleatórias)</option>
            </select>

            {/* Live Grade Preview badge */}
            {typeof currentGrade === 'number' && currentExam && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-medium text-slate-500">Nota:</span>
                <span
                  className={`text-sm font-bold ${
                    currentGrade >= currentConfig.passingGrade
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                >
                  {currentGrade.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400">/{currentConfig.totalScale}</span>
              </div>
            )}

            {/* Config Button */}
            <button
              onClick={onOpenConfigModal}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition"
              title="Configurar escala e penalizações desta disciplina"
            >
              <Sliders className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Cotações</span>
            </button>

            {/* Reset Exam Button */}
            {currentExam && (
              <button
                onClick={onResetExam}
                type="button"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
                title="Recomeçar teste"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Upload PDF Button */}
            <button
              onClick={onOpenUploadModal}
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition"
              title="Submeter PDF ou carregar outro teste"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden md:inline">PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

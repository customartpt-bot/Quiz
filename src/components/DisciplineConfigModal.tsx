import React, { useState } from 'react';
import { DisciplineConfig } from '../types/exam';
import { DEFAULT_DISCIPLINE_CONFIGS } from '../data/defaultDisciplines';
import { Settings, Check, Sliders, ShieldAlert, BookOpen, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: DisciplineConfig;
  onSaveConfig: (newConfig: DisciplineConfig) => void;
}

export const DisciplineConfigModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentConfig.id);
  const [name, setName] = useState(currentConfig.name);
  const [totalScale, setTotalScale] = useState(currentConfig.totalScale);
  const [penaltyMode, setPenaltyMode] = useState<DisciplineConfig['penaltyMode']>(currentConfig.penaltyMode);
  const [penaltyFraction, setPenaltyFraction] = useState(currentConfig.penaltyFraction);
  const [penaltyFixedValue, setPenaltyFixedValue] = useState(currentConfig.penaltyFixedValue);
  const [passingGrade, setPassingGrade] = useState(currentConfig.passingGrade);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: DisciplineConfig) => {
    setSelectedPresetId(preset.id);
    setName(preset.name);
    setTotalScale(preset.totalScale);
    setPenaltyMode(preset.penaltyMode);
    setPenaltyFraction(preset.penaltyFraction);
    setPenaltyFixedValue(preset.penaltyFixedValue);
    setPassingGrade(preset.passingGrade);
  };

  const handleSave = () => {
    const updated: DisciplineConfig = {
      id: selectedPresetId === 'custom' ? `custom-${Date.now()}` : selectedPresetId,
      name,
      totalScale: Number(totalScale) || 20,
      penaltyMode,
      penaltyFraction: Number(penaltyFraction) || 0.25,
      penaltyFixedValue: Number(penaltyFixedValue) || 0.25,
      blankPenalty: 0,
      passingGrade: Number(passingGrade) || 9.5,
    };
    onSaveConfig(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Estrutura de Pontuação da Disciplina</h2>
              <p className="text-xs text-slate-400">Personalize o cálculo da nota final e o desconto por resposta errada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Perfis de Disciplinas Universitárias
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEFAULT_DISCIPLINE_CONFIGS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-sm">{preset.name}</div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                    </div>
                    {preset.facultyName && (
                      <div className="text-xs text-slate-500 mt-0.5">{preset.facultyName}</div>
                    )}
                    <div className="text-xs text-slate-600 mt-2 font-medium">
                      {preset.penaltyMode === 'none'
                        ? 'Sem desconto de erradas'
                        : `Desconto: ${preset.penaltyFraction * 100}% por errada`}
                      {' • '}Escala 0-{preset.totalScale}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form customization */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              Parâmetros Detalhados
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nome da Disciplina / Cadeira
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSelectedPresetId('custom');
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ex: Microeconomia I"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Escala de Avaliação Máxima
                </label>
                <select
                  value={totalScale}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTotalScale(val);
                    if (val === 100 && passingGrade < 20) setPassingGrade(50);
                    if (val === 20 && passingGrade > 20) setPassingGrade(9.5);
                    setSelectedPresetId('custom');
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value={20}>0 a 20 Valores (Padrão em Portugal)</option>
                  <option value={100}>0 a 100 Pontos (%)</option>
                  <option value={10}>0 a 10 Valores</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nota Mínima de Aprovação
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={totalScale}
                  value={passingGrade}
                  onChange={(e) => {
                    setPassingGrade(Number(e.target.value));
                    setSelectedPresetId('custom');
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500">Geralmente 9.5 ou 10 valores</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Regra de Penalização por Resposta Errada
                </label>
                <select
                  value={penaltyMode}
                  onChange={(e) => {
                    setPenaltyMode(e.target.value as any);
                    setSelectedPresetId('custom');
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="fraction">Desconto Proporcional (-1/4, -1/3, -1/2 da questão)</option>
                  <option value="fixed">Desconto Fixo (valores constantes)</option>
                  <option value="none">Sem penalização (0 pontos se errar)</option>
                </select>
              </div>
            </div>

            {/* Dynamic penalty configuration */}
            {penaltyMode === 'fraction' && (
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <div className="text-xs font-semibold text-amber-900">
                      Fração descontada por cada resposta errada:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: '1/4 (25%)', val: 0.25, desc: 'Padrão com 4 hipóteses' },
                        { label: '1/3 (33.3%)', val: 0.333, desc: 'Padrão com 3 hipóteses ou ISEP/IST' },
                        { label: '1/2 (50%)', val: 0.5, desc: 'Rigor alto ou V/F com desconto' },
                        { label: '1/5 (20%)', val: 0.2, desc: 'Testes com 5 hipóteses' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setPenaltyFraction(item.val);
                            setSelectedPresetId('custom');
                          }}
                          className={`px-2.5 py-1 text-xs rounded-md font-medium border transition ${
                            Math.abs(penaltyFraction - item.val) < 0.02
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Exemplo: Numa questão cotada para 2,0 valores, errar subtrai{' '}
                      <strong>{(2.0 * penaltyFraction).toFixed(2)} valores</strong> à nota final.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {penaltyMode === 'fixed' && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Valor fixo a descontar por cada resposta errada (em valores):
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="5"
                  value={penaltyFixedValue}
                  onChange={(e) => {
                    setPenaltyFixedValue(Number(e.target.value));
                    setSelectedPresetId('custom');
                  }}
                  className="w-32 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            Configuração guardada no navegador
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              Aplicar Estrutura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

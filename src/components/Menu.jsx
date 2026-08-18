import React, { useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  X as MultiplyIcon, 
  Divide, 
  Grid, 
  Shuffle, 
  Keyboard, 
  ListChecks, 
  Play, 
  BarChart3,
  Check
} from 'lucide-react';
import { saveSettings } from '../utils/storage';

const OPERATIONS = [
  { id: 'addition', label: 'Soma', symbol: '+', icon: Plus, desc: 'Adição' },
  { id: 'subtraction', label: 'Subtração', symbol: '−', icon: Minus, desc: 'Diferença' },
  { id: 'multiplication', label: 'Multiplicação', symbol: '×', icon: MultiplyIcon, desc: 'Produto' },
  { id: 'division', label: 'Divisão', symbol: '÷', icon: Divide, desc: 'Quociente' },
  { id: 'times_tables', label: 'Tabuada', symbol: '2..12', icon: Grid, desc: 'Tabelas 2 a 12' },
  { id: 'mixed', label: 'Misto', symbol: '±×÷', icon: Shuffle, desc: 'Todas as operações' },
];

const DIFFICULTIES = [
  { 
    id: 'easy', 
    label: 'Fácil', 
    badge: 'Iniciante',
    desc: 'Números redondos e pequenos (múltiplos de 10, até 5×5)' 
  },
  { 
    id: 'medium', 
    label: 'Médio', 
    badge: 'Padrão',
    desc: 'Números de 2 dígitos, cálculos diretos sem arredondamento' 
  },
  { 
    id: 'hard', 
    label: 'Difícil', 
    badge: 'Avançado',
    desc: 'Até 3 dígitos, operações compostas com 3 termos' 
  },
];

const RESPONSE_TYPES = [
  { 
    id: 'input', 
    label: 'Caixa de Texto', 
    desc: 'Digita o número e pressiona Enter',
    icon: Keyboard 
  },
  { 
    id: 'multiple_choice', 
    label: 'Escolha Múltipla', 
    desc: '4 opções plausíveis (teclas 1, 2, 3, 4)',
    icon: ListChecks 
  },
];

const QUESTION_LIMITS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 0, label: 'Livre', desc: 'Sem limite' },
];

export default function Menu({ config, setConfig, onStart, onOpenStats }) {
  // Save settings whenever changed
  useEffect(() => {
    saveSettings(config);
  }, [config]);

  // Global key listener for Enter to start
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  const toggleTable = (num) => {
    const current = config.selectedTables || [];
    let updated;
    if (current.includes(num)) {
      if (current.length === 1) return; // Keep at least one
      updated = current.filter(n => n !== num);
    } else {
      updated = [...current, num].sort((a, b) => a - b);
    }
    setConfig({ ...config, selectedTables: updated });
  };

  const selectAllTables = () => {
    setConfig({ ...config, selectedTables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] });
  };

  const selectEvenTables = () => {
    setConfig({ ...config, selectedTables: [2, 4, 6, 8, 10, 12] });
  };

  const selectOddTables = () => {
    setConfig({ ...config, selectedTables: [3, 5, 7, 9, 11] });
  };

  const selectBasicTables = () => {
    setConfig({ ...config, selectedTables: [2, 3, 4, 5] });
  };

  const selectAdvancedTables = () => {
    setConfig({ ...config, selectedTables: [6, 7, 8, 9] });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
      
      {/* Intro Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Configura o teu Treino
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Escolhe as tuas preferências de cálculo mental e testa a tua agilidade.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* 1. Operação */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Operação
            </label>
            <span className="text-xs text-brand-600 font-medium">
              {OPERATIONS.find(o => o.id === config.operation)?.desc}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {OPERATIONS.map((op) => {
              const isSelected = config.operation === op.id;
              const Icon = op.icon;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setConfig({ ...config, operation: op.id })}
                  className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 focus:outline-none ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 text-brand-950 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 font-medium'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {op.symbol.length <= 2 ? op.symbol : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm leading-snug">{op.label}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub-selector for Tabuada */}
          {config.operation === 'times_tables' && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 animate-pop-in space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  Seleciona as tabuadas a treinar:
                </span>
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={selectAllTables}
                    className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    onClick={selectBasicTables}
                    className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    2 a 5
                  </button>
                  <button
                    type="button"
                    onClick={selectAdvancedTables}
                    className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    6 a 9
                  </button>
                  <button
                    type="button"
                    onClick={selectEvenTables}
                    className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Pares
                  </button>
                  <button
                    type="button"
                    onClick={selectOddTables}
                    className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Ímpares
                  </button>
                </div>
              </div>

              {/* Number buttons (2 to 12) */}
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                  const isChecked = (config.selectedTables || []).includes(num);
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => toggleTable(num)}
                      className={`h-10 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                        isChecked
                          ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-500/20'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* 2. Dificuldade */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Dificuldade
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DIFFICULTIES.map((diff) => {
              const isSelected = config.difficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setConfig({ ...config, difficulty: diff.id })}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${isSelected ? 'text-brand-950' : 'text-slate-800'}`}>
                      {diff.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      diff.id === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                      diff.id === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {diff.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug mt-1">
                    {diff.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Tipo de Resposta & 4. Duração */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          
          {/* Tipo de Resposta */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              3. Tipo de Resposta
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {RESPONSE_TYPES.map((type) => {
                const isSelected = config.responseType === type.id;
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setConfig({ ...config, responseType: type.id })}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isSelected ? 'text-brand-950' : 'text-slate-800'}`}>
                        {type.label}
                      </div>
                      <div className="text-xs text-slate-500">{type.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duração / Quantidade de Perguntas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              4. Duração da Sessão
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {QUESTION_LIMITS.map((lim) => {
                const isSelected = config.questionCount === lim.value;
                return (
                  <button
                    key={lim.value}
                    type="button"
                    onClick={() => setConfig({ ...config, questionCount: lim.value })}
                    className={`h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 text-brand-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-base leading-none">{lim.label}</span>
                    <span className="text-[11px] text-slate-400 mt-1 font-normal">
                      {lim.value === 0 ? 'Sem limite' : 'perguntas'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Start Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <button
            type="button"
            onClick={onOpenStats}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm transition-colors focus:outline-none"
          >
            <BarChart3 className="w-4 h-4 text-brand-600" />
            <span>Ver Estatísticas Globais</span>
          </button>

          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/30 active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Começar Treino</span>
            <span className="hidden md:inline text-xs font-normal opacity-80 bg-brand-700/60 px-2 py-0.5 rounded ml-1">
              [Enter]
            </span>
          </button>
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { 
  BarChart3, 
  Trash2, 
  ArrowLeft, 
  TrendingUp, 
  Flame, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Calendar,
  Layers
} from 'lucide-react';
import { clearAllSessions, computeGlobalStats } from '../utils/storage';
import { EvolutionChart } from './Charts';

export default function Stats({ sessions, setSessions, onBackToMenu, onStartCustomSession }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const stats = computeGlobalStats(sessions);

  const handleClear = () => {
    clearAllSessions();
    setSessions([]);
    setShowClearConfirm(false);
  };

  // Quick action to start practice session with weakest tables
  const handlePracticeWeakest = () => {
    if (stats.weakestTables.length > 0) {
      const topWeak = stats.weakestTables.slice(0, 3).map(t => t.table);
      onStartCustomSession({
        operation: 'times_tables',
        difficulty: 'medium',
        selectedTables: topWeak,
        questionCount: 20,
        responseType: 'input'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 animate-pop-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Menu</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-brand-600" />
            <span>Estatísticas & Evolução</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Histórico persistente do teu desempenho de cálculo mental.
          </p>
        </div>

        {/* Clear Data Button */}
        {sessions.length > 0 && (
          <div>
            {!showClearConfirm ? (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Histórico</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-xl border border-rose-200">
                <span className="text-xs text-rose-700 font-semibold">Confirmar?</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Sim, apagar
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-brand-100">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Ainda sem histórico registado</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Conclui a tua primeira sessão de cálculo mental para começares a ver gráficos de evolução e análise de tabuadas!
          </p>
          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Fazer Primeiro Treino</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Lifetime Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sessões</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2">
                {stats.totalSessions}
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Concluídas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Perguntas</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2">
                {stats.totalQuestions}
              </div>
              <span className="text-[11px] text-slate-400 mt-1">{stats.totalCorrect} certas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Precisão Global</span>
              <div className={`text-2xl sm:text-3xl font-extrabold font-mono mt-2 ${
                stats.globalAccuracy >= 80 ? 'text-emerald-600' : 'text-brand-600'
              }`}>
                {stats.globalAccuracy}%
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Geral</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Velocidade Média</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2">
                {stats.avgResponseTime}s
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Por resposta</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Melhor Streak</span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 mt-2 flex items-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500 inline" />
                {stats.bestStreak}
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Recorde pessoal</span>
            </div>

          </div>

          {/* Evolution Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 1: Accuracy */}
            <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <EvolutionChart
                data={stats.historyPoints}
                valueKey="accuracy"
                title="Evolução da Precisão (%)"
                unit="%"
                color="#0270c7"
                minY={0}
                maxY={100}
              />
            </div>

            {/* Chart 2: Speed */}
            <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <EvolutionChart
                data={stats.historyPoints}
                valueKey="avgTime"
                title="Evolução da Velocidade (Segundos/Resposta)"
                unit="s"
                color="#10b981"
                minY={0}
                maxY={Math.max(...stats.historyPoints.map(p => p.avgTime), 6)}
              />
            </div>

          </div>

          {/* Times Table Heatmap / Matrix (2 to 12) */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Desempenho por Tabuada (2 a 12)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mapa de acertos e erros acumulados em treinos de tabuada.
                </p>
              </div>

              {stats.weakestTables.length > 0 && stats.weakestTables[0].wrong > 0 && (
                <button
                  type="button"
                  onClick={handlePracticeWeakest}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Treinar Tabuadas Fracas ({stats.weakestTables.slice(0, 3).map(t => t.table).join(', ')})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                const item = stats.timesTableStats[num] || { table: num, total: 0, correct: 0, wrong: 0, accuracy: 100 };
                const hasData = item.total > 0;
                
                let cardColor = 'bg-slate-50 border-slate-200 text-slate-400';
                if (hasData) {
                  if (item.accuracy >= 90) {
                    cardColor = 'bg-emerald-50/70 border-emerald-200 text-emerald-900';
                  } else if (item.accuracy >= 70) {
                    cardColor = 'bg-brand-50/70 border-brand-200 text-brand-900';
                  } else {
                    cardColor = 'bg-rose-50/70 border-rose-200 text-rose-900';
                  }
                }

                return (
                  <div 
                    key={num} 
                    className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${cardColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold font-mono">Tab. {num}</span>
                      {hasData && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.accuracy >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.accuracy}%
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-xs">
                      {hasData ? (
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-emerald-700">✓ {item.correct}</span>
                          <span className="text-rose-600">✗ {item.wrong}</span>
                          <span className="text-slate-400 font-sans">({item.total})</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Sem dados</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Session History Log */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
              Histórico de Sessões ({sessions.length})
            </h3>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {sessions.map((s, idx) => {
                const qCount = s.totalQuestions || (s.correctCount + s.wrongCount) || 0;
                const acc = qCount > 0 ? Math.round((s.correctCount / qCount) * 100) : 0;
                const dateStr = s.timestamp ? new Date(s.timestamp).toLocaleString('pt-PT', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : 'N/A';

                return (
                  <div key={s.id || idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 capitalize">
                          {s.operation} • <span className="font-normal text-slate-500">{s.difficulty}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span>{qCount} perguntas</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className={`font-mono font-bold ${acc >= 80 ? 'text-emerald-600' : 'text-brand-600'}`}>
                          {acc}% ({s.correctCount}/{qCount})
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {s.avgTimePerQuestion || 0}s / resposta
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

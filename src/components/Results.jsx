import React from 'react';
import { 
  Trophy, 
  RotateCcw, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  BarChart2, 
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function Results({ sessionData, onRepeat, onNewTraining, onOpenStats }) {
  if (!sessionData) return null;

  const {
    totalQuestions = 0,
    correctCount = 0,
    wrongCount = 0,
    bestStreak = 0,
    avgTimePerQuestion = 0,
    totalDurationSec = 0,
    operation,
    difficulty,
    questionLog = [],
    selectedTables = []
  } = sessionData;

  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Compute table error breakdown if tabuada mode or contains table numbers
  const tableErrors = {};
  questionLog.forEach(q => {
    if (q.tableNumber && !q.isCorrect) {
      tableErrors[q.tableNumber] = (tableErrors[q.tableNumber] || 0) + 1;
    }
  });

  const sortedWeakestTables = Object.entries(tableErrors)
    .map(([tbl, count]) => ({ table: Number(tbl), count }))
    .sort((a, b) => b.count - a.count);

  const formatSec = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10 animate-pop-in">
      
      {/* Top Banner / Celebration */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6 text-center relative overflow-hidden">
        
        {/* Decorative subtle background gradient */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
          accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-brand-500' : 'bg-amber-500'
        }`} />

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mb-3 border border-brand-100 shadow-sm">
          <Trophy className="w-7 h-7" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sessão Concluída!
        </h2>
        <p className="text-sm text-slate-500 mt-1 capitalize">
          Modo {operation} • Dificuldade {difficulty}
        </p>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          
          {/* Accuracy */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Precisão</span>
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono mt-1 ${
              accuracy >= 80 ? 'text-emerald-600' : accuracy >= 50 ? 'text-brand-600' : 'text-rose-500'
            }`}>
              {accuracy}%
            </span>
            <span className="text-xs text-slate-500 mt-0.5">{correctCount} de {totalQuestions}</span>
          </div>

          {/* Average Speed */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tempo / Resposta</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800 mt-1">
              {avgTimePerQuestion}s
            </span>
            <span className="text-xs text-slate-500 mt-0.5">Total: {formatSec(totalDurationSec)}</span>
          </div>

          {/* Best Streak */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Melhor Streak</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 mt-1 flex items-center gap-1">
              <Flame className="w-5 h-5 fill-amber-500 inline" />
              {bestStreak}
            </span>
            <span className="text-xs text-slate-500 mt-0.5">Acertos seguidos</span>
          </div>

          {/* Erros */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Erros</span>
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono mt-1 ${wrongCount === 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {wrongCount}
            </span>
            <span className="text-xs text-slate-500 mt-0.5">{wrongCount === 0 ? 'Perfeito!' : 'Rever abaixo'}</span>
          </div>

        </div>

        {/* Times Table Specific Weaknesses Alert */}
        {sortedWeakestTables.length > 0 && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Tabuadas a reforçar
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Registaste mais dificuldades nas seguintes tabuadas:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {sortedWeakestTables.map(item => (
                  <span key={item.table} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold">
                    Tabuada do {item.table} ({item.count} {item.count === 1 ? 'erro' : 'erros'})
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-slate-100">
          
          <button
            type="button"
            onClick={onRepeat}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repetir Treino</span>
          </button>

          <button
            type="button"
            onClick={onNewTraining}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all focus:outline-none"
          >
            <PlusCircle className="w-4 h-4 text-slate-600" />
            <span>Novo Treino (Menu)</span>
          </button>

          <button
            type="button"
            onClick={onOpenStats}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm transition-all focus:outline-none"
          >
            <BarChart2 className="w-4 h-4 text-brand-600" />
            <span>Ver Histórico Global</span>
          </button>

        </div>

      </div>

      {/* Detailed Question Review List */}
      {questionLog.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Revisão das Perguntas ({questionLog.length})
            </h3>
            <span className="text-xs text-slate-400">
              {correctCount} corretas • {wrongCount} incorretas
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
            {questionLog.map((q, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-sm">
                
                {/* Status icon + Expression */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono w-5">#{idx + 1}</span>
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span className="font-mono font-bold text-slate-900">
                    {q.expression} = {q.correctAnswer}
                  </span>
                </div>

                {/* User Answer & Time */}
                <div className="flex items-center gap-4 font-mono text-xs">
                  {!q.isCorrect && (
                    <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Respondeste: {q.userAnswer}
                    </span>
                  )}
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {q.timeSpentSec}s
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

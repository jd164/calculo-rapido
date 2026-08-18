import React from 'react';
import { Volume2, VolumeX, BarChart2, Home, Zap } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function Header({ screen, setScreen, soundEnabled, setSoundEnabled }) {
  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <button
          onClick={() => setScreen('MENU')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
          title="Voltar ao Início"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-200 group-hover:bg-brand-700 transition-all duration-200">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none tracking-tight">Cálculo Rápido</h1>
            <p className="text-[11px] text-slate-500 font-medium">Treino de Cálculo Mental</p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            title={soundEnabled ? 'Som ativado (clique para silenciar)' : 'Som desativado (clique para ativar)'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Navigation link based on active screen */}
          {screen === 'STATS' ? (
            <button
              onClick={() => setScreen('MENU')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors focus:outline-none"
            >
              <Home className="w-4 h-4" />
              <span>Menu</span>
            </button>
          ) : screen === 'MENU' ? (
            <button
              onClick={() => setScreen('STATS')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none"
            >
              <BarChart2 className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">Estatísticas</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (window.confirm('Deseja realmente sair da sessão atual? O progresso não finalizado será perdido.')) {
                  setScreen('MENU');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <Home className="w-4 h-4" />
              <span>Sair</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Game from './components/Game';
import Results from './components/Results';
import Stats from './components/Stats';
import { loadSessions, saveSession, loadSettings } from './utils/storage';

const DEFAULT_CONFIG = {
  operation: 'addition', // 'addition' | 'subtraction' | 'multiplication' | 'division' | 'times_tables' | 'mixed'
  difficulty: 'medium',   // 'easy' | 'medium' | 'hard'
  responseType: 'input', // 'input' | 'multiple_choice'
  questionCount: 20,     // 10 | 20 | 50 | 0 (free/unlimited)
  selectedTables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
};

export default function App() {
  const [screen, setScreen] = useState('MENU'); // 'MENU' | 'GAME' | 'RESULTS' | 'STATS'
  const [config, setConfig] = useState(() => {
    const saved = loadSettings();
    return saved ? { ...DEFAULT_CONFIG, ...saved } : DEFAULT_CONFIG;
  });
  
  const [sessions, setSessions] = useState(() => loadSessions());
  const [latestSessionData, setLatestSessionData] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Refresh session list from storage on mount
  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  // Handlers
  const handleStartGame = () => {
    setScreen('GAME');
  };

  const handleStartCustomSession = (customConfig) => {
    setConfig(prev => ({ ...prev, ...customConfig }));
    setScreen('GAME');
  };

  const handleFinishSession = (sessionData) => {
    // Save to local storage
    const saved = saveSession(sessionData);
    setLatestSessionData(saved || sessionData);
    setSessions(loadSessions());
    setScreen('RESULTS');
  };

  const handleCancelGame = () => {
    setScreen('MENU');
  };

  const handleRepeatTraining = () => {
    setScreen('GAME');
  };

  const handleNewTraining = () => {
    setScreen('MENU');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Header */}
      <Header
        screen={screen}
        setScreen={setScreen}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Screen Views */}
      <main className="flex-1 w-full">
        {screen === 'MENU' && (
          <Menu
            config={config}
            setConfig={setConfig}
            onStart={handleStartGame}
            onOpenStats={() => setScreen('STATS')}
          />
        )}

        {screen === 'GAME' && (
          <Game
            config={config}
            onFinishSession={handleFinishSession}
            onCancel={handleCancelGame}
          />
        )}

        {screen === 'RESULTS' && (
          <Results
            sessionData={latestSessionData}
            onRepeat={handleRepeatTraining}
            onNewTraining={handleNewTraining}
            onOpenStats={() => setScreen('STATS')}
          />
        )}

        {screen === 'STATS' && (
          <Stats
            sessions={sessions}
            setSessions={setSessions}
            onBackToMenu={() => setScreen('MENU')}
            onStartCustomSession={handleStartCustomSession}
          />
        )}
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/40">
        <p>Cálculo Rápido • Treino e Agilidade de Cálculo Mental</p>
      </footer>
    </div>
  );
}

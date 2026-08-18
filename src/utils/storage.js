// LocalStorage persistence and statistical data processing

const STORAGE_KEY = 'calculo_rapido_sessions_v1';
const SETTINGS_KEY = 'calculo_rapido_settings_v1';

export function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading sessions from storage', e);
    return [];
  }
}

export function saveSession(sessionData) {
  try {
    const sessions = loadSessions();
    const newSession = {
      id: 'ses_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      timestamp: Date.now(),
      dateISO: new Date().toISOString(),
      ...sessionData
    };
    sessions.unshift(newSession); // Newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return newSession;
  } catch (e) {
    console.error('Error saving session', e);
    return null;
  }
}

export function clearAllSessions() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing sessions', e);
    return false;
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

/**
 * Computes aggregated statistics across all historical sessions
 */
export function computeGlobalStats(sessions = []) {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalWrong: 0,
      globalAccuracy: 0,
      avgResponseTime: 0,
      bestStreak: 0,
      timesTableBreakdown: {},
      weakestTables: [],
      historyPoints: []
    };
  }

  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalTime = 0;
  let bestStreak = 0;
  
  // Tabuadas tracking (2 to 12)
  const timesTableStats = {};
  for (let i = 2; i <= 12; i++) {
    timesTableStats[i] = { table: i, correct: 0, wrong: 0, total: 0, accuracy: 0 };
  }

  // History timeline (oldest to newest for charts)
  const chronological = [...sessions].reverse();
  const historyPoints = [];

  chronological.forEach((s, idx) => {
    const qCount = s.totalQuestions || (s.correctCount + s.wrongCount) || 0;
    const cCount = s.correctCount || 0;
    const wCount = s.wrongCount || 0;
    const avgTime = s.avgTimePerQuestion || 0;
    const acc = qCount > 0 ? Math.round((cCount / qCount) * 100) : 0;

    totalQuestions += qCount;
    totalCorrect += cCount;
    totalWrong += wCount;
    totalTime += (s.totalDurationSec || (avgTime * qCount));
    if (s.bestStreak && s.bestStreak > bestStreak) {
      bestStreak = s.bestStreak;
    }

    // Process detailed question log if available
    if (Array.isArray(s.questionLog)) {
      s.questionLog.forEach(q => {
        if (q.tableNumber && timesTableStats[q.tableNumber]) {
          timesTableStats[q.tableNumber].total += 1;
          if (q.isCorrect) {
            timesTableStats[q.tableNumber].correct += 1;
          } else {
            timesTableStats[q.tableNumber].wrong += 1;
          }
        }
      });
    }

    historyPoints.push({
      sessionIndex: idx + 1,
      date: new Date(s.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
      accuracy: acc,
      avgTime: Number(avgTime.toFixed(1)),
      operation: s.operation,
      difficulty: s.difficulty,
      questions: qCount
    });
  });

  // Calculate percentages for tables
  Object.keys(timesTableStats).forEach(key => {
    const item = timesTableStats[key];
    item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 100;
  });

  // Weakest tables: sorted by most errors, then lowest accuracy
  const weakestTables = Object.values(timesTableStats)
    .filter(t => t.total > 0)
    .sort((a, b) => b.wrong - a.wrong || a.accuracy - b.accuracy);

  const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const avgResponseTime = totalQuestions > 0 ? Number((totalTime / totalQuestions).toFixed(1)) : 0;

  return {
    totalSessions: sessions.length,
    totalQuestions,
    totalCorrect,
    totalWrong,
    globalAccuracy,
    avgResponseTime,
    bestStreak,
    timesTableStats,
    weakestTables,
    historyPoints
  };
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Flame, 
  Clock, 
  Timer, 
  X, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  HelpCircle,
  SkipForward
} from 'lucide-react';
import { generateQuestion } from '../utils/generator';
import { sounds } from '../utils/sound';

export default function Game({ config, onFinishSession, onCancel }) {
  // Game session states
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, chosenAnswer: any, correctAnswer: any }
  const [isLocked, setIsLocked] = useState(false); // Locking input while showing feedback

  // Metrics
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // Timers
  const [sessionTime, setSessionTime] = useState(0); // seconds
  const [questionTime, setQuestionTime] = useState(0); // tenths of a second
  const questionStartTimeRef = useRef(Date.now());
  const sessionTimerRef = useRef(null);
  const questionTimerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // History log for detailed breakdown
  const [questionLog, setQuestionLog] = useState([]);

  const inputRef = useRef(null);

  // Load new question
  const nextQuestion = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    const nextQ = generateQuestion(config);
    setQuestion(nextQ);
    setInputValue('');
    setFeedback(null);
    setIsLocked(false);
    setQuestionTime(0);
    questionStartTimeRef.current = Date.now();

    // Auto-focus input on next question
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  }, [config]);

  // Initialize first question & session timer
  useEffect(() => {
    nextQuestion();

    sessionTimerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    questionTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - questionStartTimeRef.current) / 1000;
      setQuestionTime(elapsed);
    }, 100);

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, [nextQuestion]);

  // Finish session helper
  const completeGame = useCallback((finalLog, finalCorrect, finalWrong, finalBestStreak) => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);

    const totalQuestions = finalLog.length;
    const totalTimeSec = sessionTime;
    const avgTimePerQuestion = totalQuestions > 0 
      ? Number((finalLog.reduce((acc, q) => acc + q.timeSpentSec, 0) / totalQuestions).toFixed(2))
      : 0;

    sounds.playComplete();

    onFinishSession({
      operation: config.operation,
      difficulty: config.difficulty,
      responseType: config.responseType,
      selectedTables: config.selectedTables,
      totalQuestions,
      correctCount: finalCorrect,
      wrongCount: finalWrong,
      bestStreak: finalBestStreak,
      totalDurationSec: totalTimeSec,
      avgTimePerQuestion,
      questionLog: finalLog,
      completedFullLimit: config.questionCount > 0 && totalQuestions >= config.questionCount
    });
  }, [config, sessionTime, onFinishSession]);

  // Answer verification handler
  const handleAnswer = useCallback((submittedValue) => {
    if (isLocked || !question) return;

    const parsedSubmitted = typeof submittedValue === 'string' ? parseFloat(submittedValue.trim().replace(',', '.')) : submittedValue;
    if (isNaN(parsedSubmitted)) return;

    setIsLocked(true);
    const elapsedSec = Number(((Date.now() - questionStartTimeRef.current) / 1000).toFixed(2));
    const isCorrect = parsedSubmitted === question.answer;

    // Feedback state
    const newFeedback = {
      isCorrect,
      chosenAnswer: parsedSubmitted,
      correctAnswer: question.answer
    };
    setFeedback(newFeedback);

    // Update streak & counters
    let newStreak = currentStreak;
    let newBest = bestStreak;
    let newCorrect = correctCount;
    let newWrong = wrongCount;

    if (isCorrect) {
      newCorrect += 1;
      newStreak += 1;
      if (newStreak > newBest) newBest = newStreak;
      setCorrectCount(newCorrect);
      setCurrentStreak(newStreak);
      setBestStreak(newBest);

      if (newStreak > 1 && newStreak % 5 === 0) {
        sounds.playStreak(newStreak);
      } else {
        sounds.playCorrect();
      }
    } else {
      newWrong += 1;
      newStreak = 0;
      setWrongCount(newWrong);
      setCurrentStreak(0);
      sounds.playWrong();
    }

    const logEntry = {
      index: questionIndex + 1,
      expression: question.expression,
      correctAnswer: question.answer,
      userAnswer: parsedSubmitted,
      isCorrect,
      timeSpentSec: elapsedSec,
      tableNumber: question.tableNumber || null,
      operationCategory: question.operationCategory
    };

    const updatedLog = [...questionLog, logEntry];
    setQuestionLog(updatedLog);

    const nextIndex = questionIndex + 1;
    const isFinished = config.questionCount > 0 && nextIndex >= config.questionCount;

    // Timeout duration before advancing: shorter for correct (600ms), longer for wrong so user can read (1400ms)
    const delay = isCorrect ? 550 : 1400;

    feedbackTimeoutRef.current = setTimeout(() => {
      if (isFinished) {
        completeGame(updatedLog, newCorrect, newWrong, newBest);
      } else {
        setQuestionIndex(nextIndex);
        nextQuestion();
      }
    }, delay);
  }, [
    isLocked, 
    question, 
    currentStreak, 
    bestStreak, 
    correctCount, 
    wrongCount, 
    questionIndex, 
    questionLog, 
    config.questionCount, 
    completeGame, 
    nextQuestion
  ]);

  // Form submit for text input
  const handleSubmitInput = (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim() !== '') {
      handleAnswer(inputValue);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Allow ending with Esc
      if (e.key === 'Escape') {
        if (window.confirm('Terminar a sessão e ver os resultados agora?')) {
          completeGame(questionLog, correctCount, wrongCount, bestStreak);
        }
        return;
      }

      // If user pressed Enter during wrong feedback, skip waiting and proceed immediately
      if (e.key === 'Enter' && isLocked && feedback && !feedback.isCorrect) {
        if (feedbackTimeoutRef.current) {
          clearTimeout(feedbackTimeoutRef.current);
        }
        const isFinished = config.questionCount > 0 && (questionIndex + 1) >= config.questionCount;
        if (isFinished) {
          completeGame(questionLog, correctCount, wrongCount, bestStreak);
        } else {
          setQuestionIndex(prev => prev + 1);
          nextQuestion();
        }
        return;
      }

      // Multiple choice keyboard shortcuts (1, 2, 3, 4 or numpad 1, 2, 3, 4)
      if (config.responseType === 'multiple_choice' && !isLocked && question?.options) {
        const keyMap = {
          '1': 0, '2': 1, '3': 2, '4': 3,
          'Numpad1': 0, 'Numpad2': 1, 'Numpad3': 2, 'Numpad4': 3
        };
        const optIndex = keyMap[e.key] !== undefined ? keyMap[e.key] : keyMap[e.code];
        if (optIndex !== undefined && question.options[optIndex] !== undefined) {
          e.preventDefault();
          handleAnswer(question.options[optIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isLocked, 
    feedback, 
    question, 
    questionIndex, 
    config.responseType, 
    config.questionCount, 
    questionLog, 
    correctCount, 
    wrongCount, 
    bestStreak, 
    completeGame, 
    nextQuestion, 
    handleAnswer
  ]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = config.questionCount > 0 
    ? Math.min(100, Math.round((questionIndex / config.questionCount) * 100))
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 flex flex-col min-h-[calc(100vh-5rem)] justify-between">
      
      {/* Top Session Status Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        
        {/* Progress Bar (if limited questions) */}
        {progressPercent !== null && (
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3.5">
            <div 
              className="bg-brand-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          
          {/* Question Counter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold text-sm">
              {config.questionCount > 0 ? (
                <>
                  <span className="text-brand-600">{questionIndex + 1}</span>
                  <span className="text-slate-400 font-normal"> / {config.questionCount}</span>
                </>
              ) : (
                <>Pergunta <span className="text-brand-600">#{questionIndex + 1}</span></>
              )}
            </span>
          </div>

          {/* Current Streak */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            currentStreak >= 3 
              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse-subtle'
              : 'bg-slate-100 text-slate-600'
          }`}>
            <Flame className={`w-3.5 h-3.5 ${currentStreak >= 3 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>Streak: {currentStreak}</span>
          </div>

          {/* Timers & Early Exit */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-slate-700" title="Tempo Total">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatTime(sessionTime)}</span>
            </div>

            <button
              onClick={() => {
                if (questionLog.length === 0) {
                  onCancel();
                } else if (window.confirm('Concluir treino e ver resultados das contas respondidas?')) {
                  completeGame(questionLog, correctCount, wrongCount, bestStreak);
                }
              }}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium border border-transparent hover:border-rose-200"
              title="Terminar treino antecipadamente"
            >
              Terminar
            </button>
          </div>

        </div>
      </div>

      {/* Main Equation Box (The core focused mental arena) */}
      <div className={`flex-1 flex flex-col justify-center items-center py-8 px-4 sm:px-8 bg-white rounded-3xl border transition-all duration-200 shadow-sm relative overflow-hidden ${
        feedback === null
          ? 'border-slate-200 bg-white'
          : feedback.isCorrect
            ? 'border-emerald-300 bg-emerald-50/50 ring-4 ring-emerald-500/10'
            : 'border-rose-300 bg-rose-50/50 ring-4 ring-rose-500/10'
      }`}>
        
        {/* Dynamic Question Indicator / Live Per-Question Timer */}
        <div className="absolute top-4 right-5 flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <Timer className="w-3 h-3 text-slate-400" />
          <span>{questionTime.toFixed(1)}s</span>
        </div>

        {/* Big Math Expression */}
        {question && (
          <div className="text-center mb-8 select-none">
            <div className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight font-mono">
              {question.expression}
              <span className="text-brand-500 ml-2">=</span>
              {feedback !== null && (
                <span className={`ml-3 sm:ml-4 font-extrabold ${feedback.isCorrect ? 'text-emerald-600 animate-pop-in' : 'text-rose-600 line-through'}`}>
                  {feedback.chosenAnswer}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Feedback details (shows answer if wrong) */}
        {feedback && !feedback.isCorrect && (
          <div className="mb-6 p-3 px-5 rounded-2xl bg-rose-100/80 border border-rose-300 text-rose-900 flex items-center gap-3 animate-pop-in">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="text-sm font-semibold">
              Resposta certa: <strong className="font-extrabold font-mono text-base ml-1">{feedback.correctAnswer}</strong>
            </div>
            <span className="text-xs text-rose-700/80 ml-2 hidden sm:inline">[Pressiona Enter para avançar]</span>
          </div>
        )}

        {feedback && feedback.isCorrect && (
          <div className="mb-6 p-2.5 px-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center gap-2 animate-pop-in text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Correto!</span>
          </div>
        )}

        {/* Input Mode: Clean numeric text field */}
        {config.responseType === 'input' && (
          <form onSubmit={handleSubmitInput} className="w-full max-w-sm flex flex-col items-center">
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                autoComplete="off"
                autoFocus
                disabled={isLocked}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="?"
                className={`w-full text-center text-3xl sm:text-4xl font-bold font-mono py-3.5 px-4 rounded-2xl border-2 transition-all outline-none shadow-inner ${
                  feedback === null
                    ? 'border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 bg-slate-50/50'
                    : feedback.isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-rose-400 bg-rose-50 text-rose-900'
                }`}
              />
            </div>

            <div className="flex items-center justify-between w-full mt-3 px-1 text-xs text-slate-400">
              <span>Digita o resultado</span>
              <span className="font-medium text-slate-500 flex items-center gap-1">
                Enter para enviar ↵
              </span>
            </div>
          </form>
        )}

        {/* Multiple Choice Mode: 4 Plausible Distractor Cards */}
        {config.responseType === 'multiple_choice' && question && (
          <div className="w-full max-w-md">
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt, idx) => {
                const optionLabel = ['1', '2', '3', '4'][idx];
                let btnStyle = 'border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/50 text-slate-800';

                if (feedback !== null) {
                  if (opt === feedback.correctAnswer) {
                    btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-extrabold ring-2 ring-emerald-500';
                  } else if (opt === feedback.chosenAnswer && !feedback.isCorrect) {
                    btnStyle = 'border-rose-400 bg-rose-100 text-rose-900 line-through';
                  } else {
                    btnStyle = 'border-slate-200 bg-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isLocked}
                    onClick={() => handleAnswer(opt)}
                    className={`relative p-4 sm:p-5 rounded-2xl border-2 text-center text-xl sm:text-2xl font-bold font-mono transition-all duration-150 flex items-center justify-center group focus:outline-none ${btnStyle}`}
                  >
                    {/* Keyboard shortcut hint badge */}
                    <span className="absolute top-2 left-2.5 text-[10px] font-sans font-semibold text-slate-400 group-hover:text-brand-600 bg-slate-100 group-hover:bg-brand-100 px-1.5 py-0.5 rounded transition-colors">
                      {optionLabel}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            
            <p className="text-center text-xs text-slate-400 mt-3 font-medium">
              Usa as teclas <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-slate-600">1</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-slate-600">2</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-slate-600">3</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-slate-600">4</kbd> para responder rápido
            </p>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
        <div>
          Modo: <strong className="text-slate-600 font-semibold">{config.difficulty.toUpperCase()}</strong> • {config.operation}
        </div>
        <div className="flex items-center gap-3">
          <span>Acertos: <strong className="text-emerald-600 font-bold">{correctCount}</strong></span>
          <span>Erros: <strong className="text-rose-500 font-bold">{wrongCount}</strong></span>
        </div>
      </div>

    </div>
  );
}

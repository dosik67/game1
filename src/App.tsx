/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Trophy, RefreshCcw, Globe, Play, Medal, ArrowLeft, Users, Clock, Crown } from "lucide-react";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "./utils/supabase";

// --- Types ---
type Language = 'ru' | 'kz';
type LocalState = 'login' | 'joined';

interface RoomState {
  status: 'lobby' | 'playing' | 'leaderboard';
  ends_at: number | null;
}

interface Player {
  uid: string;
  name: string;
  is_ready: boolean;
  score: number;
  solved_count: number;
}

interface Problem {
  id: number;
  type: 'add3' | 'add_sub' | 'sub_add';
  d: number;
  nums: number[];
  ansNum: number;
  ansDen: number;
}

// --- Translations ---
const t = {
  ru: {
    title: "Математическая Ромашка",
    subtitle: "Сложи и вычти дроби с одинаковыми знаменателями!",
    enterName: "Введи свое имя",
    join: "Войти в игру",
    teacherLogin: "Я Учитель (Создать игру)",
    createRoom: "Создать комнату",
    scanToJoin: "Отсканируй, чтобы присоединиться!",
    lobby: "Зал ожидания",
    waitingForAdmin: "Ждем, пока учитель начнет игру...",
    ready: "Я готов!",
    notReady: "Не готов",
    startGame: "Начать игру",
    playersReady: "готовы",
    timeRemaining: "Осталось",
    resetGame: "Новая игра",
    task: "Задание №",
    check: "Проверить",
    close: "Закрыть",
    tryAgain: "Попробуй еще раз!",
    leaderboard: "Таблица лидеров",
    score: "Очки",
    solved: "Решено",
    points: "очков",
    loading: "Загрузка...",
    emptyLeaderboard: "Пока нет результатов.",
    adminPanel: "Панель учителя",
    allReady: "Ждем других игроков...",
    cancelGame: "Отменить игру",
    clearPlayers: "Очистить список"
  },
  kz: {
    title: "Математикалық Түймедақ",
    subtitle: "Бөлімдері бірдей бөлшектерді қос және азайт!",
    enterName: "Атыңды жаз",
    join: "Ойынға кіру",
    teacherLogin: "Мен Мұғаліммін (Ойын құру)",
    createRoom: "Бөлме құру",
    scanToJoin: "Қосылу үшін сканерле!",
    lobby: "Күту залы",
    waitingForAdmin: "Мұғалім ойынды бастағанша күтеміз...",
    ready: "Мен дайынмын!",
    notReady: "Дайын емес",
    startGame: "Ойынды бастау",
    playersReady: "дайын",
    timeRemaining: "Қалды",
    resetGame: "Жаңа ойын",
    task: "Тапсырма №",
    check: "Тексеру",
    close: "Жабу",
    tryAgain: "Қайтадан байқап көр!",
    leaderboard: "Көшбасшылар тақтасы",
    score: "Ұпай",
    solved: "Шешілді",
    points: "ұпай",
    loading: "Жүктелуде...",
    emptyLeaderboard: "Әзірге нәтижелер жоқ.",
    adminPanel: "Мұғалім панелі",
    allReady: "Басқа ойыншыларды күтуде...",
    cancelGame: "Ойынды тоқтату",
    clearPlayers: "Тізімді тазалау"
  }
};

// --- Helpers ---
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateProblems(): Problem[] {
  const problems: Problem[] = [];
  
  // 1. a/d + b/d + c/d
  let d1 = rand(50, 100);
  let a1 = rand(10, 40);
  let b1 = rand(10, 40);
  let c1 = rand(5, 20);
  problems.push({ id: 1, type: 'add3', d: d1, nums: [a1, b1, c1], ansNum: a1 + b1 + c1, ansDen: d1 });

  // 2. a/d + (b/d - c/d)
  let d2 = rand(10, 50);
  let b2 = rand(5, 20);
  let c2 = rand(1, b2 - 1);
  let a2 = rand(5, 20);
  problems.push({ id: 2, type: 'add_sub', d: d2, nums: [a2, b2, c2], ansNum: a2 + (b2 - c2), ansDen: d2 });

  // 3. a/d - (b/d + c/d)
  let d3 = rand(40, 90);
  let b3 = rand(5, 20);
  let c3 = rand(5, 20);
  let a3 = rand(b3 + c3 + 1, b3 + c3 + 20);
  problems.push({ id: 3, type: 'sub_add', d: d3, nums: [a3, b3, c3], ansNum: a3 - (b3 + c3), ansDen: d3 });

  // 4. a/d - (b/d + c/d)
  let d4 = rand(100, 300);
  let b4 = rand(10, 90);
  let c4 = rand(10, 90);
  let a4 = rand(b4 + c4 + 1, b4 + c4 + 50);
  problems.push({ id: 4, type: 'sub_add', d: d4, nums: [a4, b4, c4], ansNum: a4 - (b4 + c4), ansDen: d4 });

  // 5. a/d - (b/d + c/d)
  let d5 = rand(100, 200);
  let b5 = rand(10, 50);
  let c5 = rand(10, 50);
  let a5 = rand(b5 + c5 + 1, b5 + c5 + 40);
  problems.push({ id: 5, type: 'sub_add', d: d5, nums: [a5, b5, c5], ansNum: a5 - (b5 + c5), ansDen: d5 });

  // 6. a/d - (b/d + c/d)
  let d6 = rand(50, 150);
  let b6 = rand(10, 40);
  let c6 = rand(10, 40);
  let a6 = rand(b6 + c6 + 1, b6 + c6 + 30);
  problems.push({ id: 6, type: 'sub_add', d: d6, nums: [a6, b6, c6], ansNum: a6 - (b6 + c6), ansDen: d6 });

  return problems.sort(() => Math.random() - 0.5).map((p, i) => ({ ...p, id: i + 1 }));
}

function Fraction({ n, d }: { n: number | string; d: number | string }) {
  return (
    <div className="flex flex-col items-center inline-flex mx-1">
      <span className="border-b-2 border-current px-1 leading-tight">{n}</span>
      <span className="px-1 leading-tight">{d}</span>
    </div>
  );
}

function ProblemDisplay({ problem }: { problem: Problem }) {
  const { type, d, nums } = problem;
  if (type === 'add3') {
    return (
      <div className="flex items-center gap-1">
        <Fraction n={nums[0]} d={d} /> + <Fraction n={nums[1]} d={d} /> + <Fraction n={nums[2]} d={d} />
      </div>
    );
  }
  if (type === 'add_sub') {
    return (
      <div className="flex items-center gap-1">
        <Fraction n={nums[0]} d={d} /> + (<Fraction n={nums[1]} d={d} /> - <Fraction n={nums[2]} d={d} />)
      </div>
    );
  }
  if (type === 'sub_add') {
    return (
      <div className="flex items-center gap-1">
        <Fraction n={nums[0]} d={d} /> - (<Fraction n={nums[1]} d={d} /> + <Fraction n={nums[2]} d={d} />)
      </div>
    );
  }
  return null;
}

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [localState, setLocalState] = useState<LocalState>('login');
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  
  const [playerName, setPlayerName] = useState("");
  const [uid, setUid] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [userNum, setUserNum] = useState("");
  const [userDen, setUserDen] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  
  const [problemStartTime, setProblemStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes in seconds
  
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appUrl, setAppUrl] = useState("");


  const currentPlayer = players.find(p => p.uid === uid);

  useEffect(() => {
    setAppUrl(window.location.origin);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // --- Auth & Supabase Setup ---
  useEffect(() => {
    // Try anonymous sign in
    const initAuth = async () => {
      try {
        // Check if already signed in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUid(session.user.id);
          setIsAuthReady(true);
        } else {
          // Sign in anonymously
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Auth Error:", error);

            setUid(`local-${Date.now()}`);
          } else if (data.user) {
            setUid(data.user.id);
          }
          setIsAuthReady(true);
        }
      } catch (error: any) {
        console.error("Auth Error:", error);

        setUid(`local-${Date.now()}`);
        setIsAuthReady(true);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUid(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Sync Room State ---
  useEffect(() => {
    if (!isAuthReady) return;

    // Initial fetch
    const fetchRoom = async () => {
      const { data, error } = await supabase.from('room').select('*').eq('id', 'main').single();
      if (data) {
        setRoomState({ status: data.status, ends_at: data.ends_at });
      } else if (isAdmin && error?.code === 'PGRST116') {
        // Room doesn't exist, create it
        await supabase.from('room').insert({ id: 'main', status: 'lobby', ends_at: null });
        setRoomState({ status: 'lobby', ends_at: null });
      }
    };
    fetchRoom();

    // Realtime subscription
    const channel = supabase
      .channel('room-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'room', filter: 'id=eq.main' },
        (payload) => {
          const data = payload.new as any;
          if (data) {
            setRoomState({ status: data.status, ends_at: data.ends_at });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthReady, isAdmin]);

  // --- Sync Players ---
  useEffect(() => {
    if (!isAuthReady) return;

    // Initial fetch
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('players')
        .select('*')
        .order('score', { ascending: false })
        .limit(100);
      if (data) {
        setPlayers(data as Player[]);
      }
    };
    fetchPlayers();

    // Realtime subscription
    const channel = supabase
      .channel('players-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        async () => {
          // Re-fetch all players on any change to maintain correct ordering
          const { data } = await supabase
            .from('players')
            .select('*')
            .order('score', { ascending: false })
            .limit(100);
          if (data) {
            setPlayers(data as Player[]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthReady]);

  // --- Global Timer Logic ---
  useEffect(() => {
    if (roomState?.status === 'playing' && roomState.ends_at) {
      const interval = setInterval(async () => {
        const remaining = Math.max(0, Math.floor((roomState.ends_at! - Date.now()) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0 && isAdmin) {
          await supabase.from('room').update({ status: 'leaderboard' }).eq('id', 'main');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [roomState, isAdmin]);

  // --- Infinite Problems Logic ---
  useEffect(() => {
    if (solved.length === 6) {
      setTimeout(() => {
        setProblems(generateProblems());
        setSolved([]);
      }, 600);
    }
  }, [solved]);

  // --- Actions ---
  const joinLobby = async () => {
    if (!playerName.trim() && !isAdmin) return;
    if (!uid) return;
    
    if (!isAdmin) {
      await supabase.from('players').upsert({
        uid,
        name: playerName,
        is_ready: false,
        score: 0,
        solved_count: 0
      });
    }
    setLocalState('joined');
  };

  const toggleReady = async () => {
    if (!uid || !currentPlayer) return;
    await supabase.from('players').update({ is_ready: !currentPlayer.is_ready }).eq('uid', uid);
  };

  const startGame = async () => {
    if (!isAdmin) return;
    const endsAt = Date.now() + 180 * 1000; // 3 minutes
    
    // Reset all players scores
    await supabase.from('players').update({ score: 0, solved_count: 0, is_ready: false }).neq('uid', '');

    await supabase.from('room').update({ status: 'playing', ends_at: endsAt }).eq('id', 'main');
  };

  const resetRoom = async () => {
    if (!isAdmin) return;
    await supabase.from('room').update({ status: 'lobby', ends_at: null }).eq('id', 'main');
    setLocalState('login');
  };

  const clearPlayers = async () => {
    if (!isAdmin) return;
    if (window.confirm("Точно удалить всех игроков из комнаты?")) {
      await supabase.from('players').delete().neq('uid', '');
    }
  };

  // Initialize problems when game starts
  useEffect(() => {
    if (roomState?.status === 'playing' && problems.length === 0) {
      setProblems(generateProblems());
      setSolved([]);
    }
  }, [roomState?.status]);

  // --- Confetti on leaderboard ---
  useEffect(() => {
    if (roomState?.status === 'leaderboard' && players.length > 0) {
      const timer = setTimeout(() => {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.3 } });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [roomState?.status, players.length]);

  const handlePetalClick = (problem: Problem) => {
    if (solved.includes(problem.id)) return;
    setActiveProblem(problem);
    setUserNum("");
    setUserDen("");
    setFeedback(null);
    setProblemStartTime(Date.now());
  };

  const checkAnswer = async () => {
    if (!activeProblem || !uid) return;
    const isCorrect =
      parseInt(userNum) === activeProblem.ansNum &&
      parseInt(userDen) === activeProblem.ansDen;

    if (isCorrect) {
      setFeedback("correct");
      
      const timeTaken = (Date.now() - problemStartTime) / 1000;
      const speedBonus = Math.max(0, Math.floor(100 - timeTaken * 2));
      const pointsEarned = 100 + speedBonus;
      
      if (!isAdmin) {
        await supabase.rpc('increment_score', { 
          player_uid: uid, 
          points: pointsEarned, 
          solved: 1 
        });
      }
      
      setTimeout(() => {
        setSolved([...solved, activeProblem.id]);
        setActiveProblem(null);
      }, 500);
    } else {
      setFeedback("wrong");
      if (!isAdmin) {
        await supabase.rpc('increment_score', { 
          player_uid: uid, 
          points: -20, 
          solved: 0 
        });
      }
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  // --- Renderers ---
  const renderLogin = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[32px] shadow-xl border-2 border-[#ffd54f] max-w-md w-full text-center relative overflow-hidden"
    >
      <h1 className="text-4xl font-bold text-[#5a5a40] mb-2 serif">{t[lang].title}</h1>
      <p className="text-[#8a8a60] italic mb-8">{t[lang].subtitle}</p>
      


      {isAdmin ? (
        <div className="mb-8">
          <div className="bg-[#fffde7] p-4 rounded-xl border border-[#ffd54f] mb-6">
            <Crown className="mx-auto text-[#ffb300] mb-2" size={32} />
            <p className="font-bold text-[#5a5a40]">{t[lang].adminPanel}</p>
          </div>
          <button
            onClick={joinLobby}
            className="w-full bg-[#5a5a40] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#4a4a30] transition-colors flex items-center justify-center gap-2"
          >
            <Play size={20} />
            {t[lang].createRoom}
          </button>
        </div>
      ) : (
        <div className="mb-8">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={t[lang].enterName}
            className="w-full px-6 py-4 rounded-2xl border-2 border-[#d4d4a0] focus:outline-none focus:border-[#ffd54f] text-xl text-center mb-4"
            maxLength={20}
          />
          <button
            onClick={joinLobby}
            disabled={!playerName.trim()}
            className="w-full bg-[#5a5a40] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#4a4a30] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play size={20} />
            {t[lang].join}
          </button>
        </div>
      )}

      {!isAdmin && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            onClick={() => window.location.href = '?admin=true'}
            className="text-sm text-[#8a8a60] underline hover:text-[#5a5a40]"
          >
            {t[lang].teacherLogin}
          </button>
        </div>
      )}
    </motion.div>
  );

  const renderLobby = () => {
    const readyCount = players.filter(p => p.is_ready).length;
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-[32px] shadow-xl border-2 border-[#ffd54f] max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#5a5a40] mb-2">{t[lang].lobby}</h2>
          <p className="text-[#8a8a60]">{players.length} {t[lang].playersReady}: {readyCount}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Players List */}
          <div className="flex-1 bg-[#fafafa] rounded-2xl p-4 border border-[#f0f0e0] min-h-[300px] max-h-[400px] overflow-y-auto">
            {players.length === 0 ? (
              <p className="text-center text-[#8a8a60] mt-10">{t[lang].waitingForAdmin}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {players.map(p => (
                  <div key={p.uid} className={`flex items-center justify-between p-3 rounded-xl border-2 ${p.is_ready ? 'border-[#4db6ac] bg-[#e0f2f1]' : 'border-[#e0e0e0] bg-white'}`}>
                    <span className="font-bold text-[#4a4a4a] truncate pr-2">{p.name}</span>
                    {p.is_ready ? <CheckCircle2 className="text-[#4db6ac]" size={20} /> : <Clock className="text-[#9e9e9e]" size={20} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="w-full md:w-64 flex flex-col gap-6">
            {isAdmin ? (
              <>
                <div className="bg-white p-4 rounded-2xl border-2 border-[#ffd54f] text-center">
                  <p className="text-sm font-bold text-[#5a5a40] mb-3">{t[lang].scanToJoin}</p>
                  <div className="flex justify-center bg-white p-2 rounded-xl inline-block">
                    <QRCodeSVG value={appUrl} size={140} />
                  </div>
                </div>
                <button
                  onClick={startGame}
                  disabled={players.length === 0 || readyCount !== players.length}
                  className="w-full bg-[#ffd54f] text-[#5a5a40] py-4 rounded-2xl font-bold text-lg hover:bg-[#ffca28] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center leading-tight"
                >
                  <span>{t[lang].startGame}</span>
                  {(players.length === 0 || readyCount !== players.length) && (
                    <span className="text-sm text-[#8a8a60] mt-1 font-normal">{t[lang].allReady}</span>
                  )}
                </button>
                <button
                  onClick={clearPlayers}
                  disabled={players.length === 0}
                  className="w-full bg-[#ffebee] text-[#e53935] py-2 rounded-xl font-bold text-sm hover:bg-[#ffcdd2] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t[lang].clearPlayers}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-center text-[#8a8a60] font-medium">{t[lang].waitingForAdmin}</p>
                <button
                  onClick={toggleReady}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors shadow-md flex items-center justify-center gap-2 ${
                    currentPlayer?.is_ready 
                      ? 'bg-[#4db6ac] text-white hover:bg-[#26a69a]' 
                      : 'bg-[#e0e0e0] text-[#5a5a40] hover:bg-[#d5d5d5]'
                  }`}
                >
                  {currentPlayer?.is_ready ? <CheckCircle2 size={24} /> : null}
                  {currentPlayer?.is_ready ? t[lang].ready : t[lang].notReady}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPlaying = () => {
    const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (isAdmin) {
      return (
        <div className="bg-white p-8 rounded-[32px] shadow-xl border-4 border-[#ffd54f] text-center max-w-md w-full">
          <Crown className="mx-auto text-[#ffb300] mb-4" size={48} />
          <h2 className="text-3xl font-bold text-[#5a5a40] mb-6">{t[lang].timeRemaining}</h2>
          <div className="text-6xl font-mono font-bold text-[#4db6ac] mb-8">{formatTime(timeLeft)}</div>
          <button onClick={resetRoom} className="text-[#e53935] bg-[#ffebee] px-6 py-3 rounded-xl font-bold hover:bg-[#ffcdd2] transition-colors mt-4">{t[lang].cancelGame}</button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center mb-8 px-4">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border-2 border-[#ffd54f]">
            <Clock className="text-[#ffb300]" size={24} />
            <span className="font-mono font-bold text-2xl text-[#5a5a40]">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="flex gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-[#f0f0e0]">
            <div className="flex items-center gap-2">
              <Medal className="text-[#ffd54f]" size={24} />
              <span className="font-bold text-xl text-[#5a5a40]">{currentPlayer?.score || 0}</span>
            </div>
            <div className="w-px bg-[#f0f0e0]" />
            <div className="flex items-center gap-2">
              <span className="text-[#8a8a60] font-medium">{playerName}</span>
            </div>
          </div>
        </div>

        {/* Daisy Container */}
        <div className="relative w-80 h-80 flex items-center justify-center mt-12">
          {problems.map((problem, index) => {
            const angle = (index * 360) / problems.length;
            const isSolved = solved.includes(problem.id);
            return (
              <motion.button
                key={problem.id}
                initial={{ scale: 0, rotate: angle }}
                animate={{ scale: 1, rotate: angle }}
                whileHover={!isSolved ? { scale: 1.1, zIndex: 10 } : {}}
                whileTap={!isSolved ? { scale: 0.9 } : {}}
                onClick={() => handlePetalClick(problem)}
                className={`absolute w-32 h-44 origin-bottom rounded-full border-2 transition-colors duration-500 flex flex-col items-center pt-8
                  ${isSolved 
                    ? "bg-[#e0f2f1] border-[#80cbc4] opacity-60" 
                    : "bg-white border-[#f0f0e0] shadow-lg cursor-pointer hover:border-[#d4d4a0]"
                  }`}
                style={{ bottom: "50%", transform: `rotate(${angle}deg)` }}
              >
                <div style={{ transform: `rotate(${-angle}deg)` }} className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-[#d4d4a0]">{index + 1}</span>
                  {isSolved && <CheckCircle2 className="text-[#4db6ac] mt-2" size={24} />}
                </div>
              </motion.button>
            );
          })}

          {/* Center */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="z-20 w-32 h-32 bg-[#ffd54f] rounded-full border-4 border-[#ffb300] shadow-inner flex items-center justify-center text-center p-4"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-[#795548]">{solved.length}/6</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#795548]/60">{t[lang].solved}</span>
            </div>
          </motion.div>
        </div>

        {/* Modal for Problem */}
        <AnimatePresence>
          {activeProblem && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-[32px] p-8 shadow-2xl max-w-md w-full border-4 border-[#ffd54f]"
              >
                <div className="text-center mb-8">
                  <h2 className="text-sm uppercase tracking-widest font-bold text-[#8a8a60] mb-4">{t[lang].task}{activeProblem.id}</h2>
                  <div className="text-3xl font-medium text-[#4a4a4a] flex justify-center items-center gap-2">
                    <ProblemDisplay problem={activeProblem} />
                    <span className="mx-2">=</span>
                    <div className="flex flex-col items-center gap-1">
                      <input
                        type="number"
                        value={userNum}
                        onChange={(e) => setUserNum(e.target.value)}
                        className="w-16 h-12 text-center border-2 border-[#d4d4a0] rounded-lg focus:outline-none focus:border-[#ffd54f] text-xl"
                        placeholder="?"
                      />
                      <div className="w-16 h-0.5 bg-[#4a4a4a]" />
                      <input
                        type="number"
                        value={userDen}
                        onChange={(e) => setUserDen(e.target.value)}
                        className="w-16 h-12 text-center border-2 border-[#d4d4a0] rounded-lg focus:outline-none focus:border-[#ffd54f] text-xl"
                        placeholder="?"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={checkAnswer}
                    className="w-full bg-[#5a5a40] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#4a4a30] transition-colors flex items-center justify-center gap-2"
                  >
                    {t[lang].check}
                    {feedback === "correct" && <CheckCircle2 size={20} />}
                    {feedback === "wrong" && <XCircle size={20} />}
                  </button>
                  <button
                    onClick={() => setActiveProblem(null)}
                    className="w-full text-[#8a8a60] font-medium py-2 hover:text-[#5a5a40] transition-colors"
                  >
                    {t[lang].close}
                  </button>
                </div>

                {feedback === "wrong" && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-4 text-red-500 font-medium">
                    {t[lang].tryAgain}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderLeaderboard = () => {
    const top3 = players.slice(0, 3);

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-white p-8 rounded-[32px] shadow-xl border-2 border-[#ffd54f] max-w-4xl w-full"
      >
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-[#5a5a40] flex items-center gap-3">
            <Trophy className="text-[#ffd54f]" size={32} /> {t[lang].leaderboard}
          </h2>
          {isAdmin && (
            <button onClick={resetRoom} className="bg-[#f0f0e0] text-[#5a5a40] px-4 py-2 rounded-xl font-bold hover:bg-[#e0e0d0] transition-colors">
              {t[lang].resetGame}
            </button>
          )}
        </div>

        {/* Podium for Top 3 */}
        <div className="flex items-end justify-center gap-4 h-64 mb-12 border-b-2 border-[#f0f0e0] pb-4">
          {top3[1] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="flex flex-col items-center w-28">
              <span className="font-bold text-[#4a4a4a] truncate w-full text-center mb-2">{top3[1].name}</span>
              <span className="text-sm font-bold text-[#4db6ac] mb-2">{top3[1].score}</span>
              <div className="w-full h-32 bg-gradient-to-t from-[#e0e0e0] to-[#f5f5f5] rounded-t-xl flex items-start justify-center pt-4 border-t-4 border-[#9e9e9e]">
                <span className="text-4xl font-bold text-[#9e9e9e]">2</span>
              </div>
            </motion.div>
          )}
          
          {top3[0] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} className="flex flex-col items-center w-32 z-10">
              <Crown className="text-[#ffb300] mb-1" size={32} />
              <span className="font-bold text-[#5a5a40] text-lg truncate w-full text-center mb-2">{top3[0].name}</span>
              <span className="text-sm font-bold text-[#4db6ac] mb-2">{top3[0].score}</span>
              <div className="w-full h-44 bg-gradient-to-t from-[#ffd54f] to-[#fff59d] rounded-t-xl flex items-start justify-center pt-4 border-t-4 border-[#ffb300] shadow-lg">
                <span className="text-5xl font-bold text-[#ffb300]">1</span>
              </div>
            </motion.div>
          )}

          {top3[2] && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col items-center w-28">
              <span className="font-bold text-[#4a4a4a] truncate w-full text-center mb-2">{top3[2].name}</span>
              <span className="text-sm font-bold text-[#4db6ac] mb-2">{top3[2].score}</span>
              <div className="w-full h-24 bg-gradient-to-t from-[#d7ccc8] to-[#efebe9] rounded-t-xl flex items-start justify-center pt-4 border-t-4 border-[#8d6e63]">
                <span className="text-4xl font-bold text-[#8d6e63]">3</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Full Leaderboard List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }} className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
          {players.map((player, idx) => (
            <div key={player.uid} className={`flex items-center justify-between p-5 md:p-6 rounded-3xl border-2 shadow-sm transition-transform hover:scale-[1.01] ${player.uid === uid ? 'border-[#ffd54f] bg-[#fffde7]' : 'border-[#f0f0e0] bg-[#fafafa]'}`}>
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-xl ${idx < 3 ? 'bg-[#ffd54f] text-[#5a5a40]' : 'bg-[#e0e0e0] text-[#8a8a60]'}`}>
                  {idx + 1}
                </div>
                <span className="font-bold text-xl text-[#4a4a4a] truncate max-w-[200px]">{player.name}</span>
              </div>
              <div className="flex items-center gap-8 text-lg">
                <div className="flex flex-col items-end">
                  <span className="text-[#4db6ac] font-bold text-2xl">{player.score}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8a8a60]">{t[lang].score}</span>
                </div>
                <div className="w-px h-10 bg-[#e0e0e0]"></div>
                <div className="flex flex-col items-end w-24">
                  <span className="text-[#5a5a40] font-bold text-xl">{player.solved_count}/6</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8a8a60]">{t[lang].solved}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] flex flex-col items-center justify-center p-4 font-sans text-[#4a4a4a]">
      {/* Back to Menu */}
      <div className="absolute top-4 left-4 z-50">
        <a href="/" className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-[#f0f0e0] text-[#8a8a60] hover:text-[#5a5a40] hover:bg-[#fafafa] font-bold transition-colors">
          <ArrowLeft size={18} /> Меню
        </a>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 flex bg-white rounded-full shadow-sm border border-[#f0f0e0] overflow-hidden z-50">
        <button
          onClick={() => setLang('ru')}
          className={`px-4 py-2 text-sm font-bold transition-colors ${lang === 'ru' ? 'bg-[#ffd54f] text-[#5a5a40]' : 'text-[#8a8a60] hover:bg-[#fafafa]'}`}
        >
          RU
        </button>
        <button
          onClick={() => setLang('kz')}
          className={`px-4 py-2 text-sm font-bold transition-colors ${lang === 'kz' ? 'bg-[#ffd54f] text-[#5a5a40]' : 'text-[#8a8a60] hover:bg-[#fafafa]'}`}
        >
          KZ
        </button>
      </div>

      {!isAuthReady ? (
        <div className="text-[#8a8a60] animate-pulse">{t[lang].loading}</div>
      ) : (
        <>
          {localState === 'login' && renderLogin()}
          {localState === 'joined' && roomState?.status === 'lobby' && renderLobby()}
          {localState === 'joined' && roomState?.status === 'playing' && renderPlaying()}
          {roomState?.status === 'leaderboard' && renderLeaderboard()}
        </>
      )}

      <style>{`
        .serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>
    </div>
  );
}

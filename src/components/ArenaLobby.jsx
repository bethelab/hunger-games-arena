import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import AvatarRenderer from './AvatarRenderer';
import { DISTRICTS } from '../data/hungerGamesData';
import { sound } from './SoundEffects';
import { syncService } from '../services/syncService';
import ArenaIntro from './phase1/ArenaIntro';
import CornucopiaChoice from './phase1/CornucopiaChoice';
import VoteResults from './phase1/VoteResults';
import ConsequenceReveal from './phase1/ConsequenceReveal';
import LessonReveal from './phase1/LessonReveal';
import Phase2Intro from './phase2/Phase2Intro';
import Phase2Choice from './phase2/Phase2Choice';
import AllianceReveal from './phase2/AllianceReveal';
import Phase2Lesson from './phase2/Phase2Lesson';
import Phase3Intro from './phase3/Phase3Intro';
import Phase3Location from './phase3/Phase3Location';
import Phase3Purify from './phase3/Phase3Purify';
import Phase3Outcome from './phase3/Phase3Outcome';
import Phase3Lesson from './phase3/Phase3Lesson';
import Phase4Intro from './phase4/Phase4Intro';
import Phase4Event from './phase4/Phase4Event';
import Phase4Twist from './phase4/Phase4Twist';
import Phase4Outcome from './phase4/Phase4Outcome';
import Phase4Lesson from './phase4/Phase4Lesson';
import Phase5Intro from './phase5/Phase5Intro';
import Phase5Pitch from './phase5/Phase5Pitch';
import Phase5Vote from './phase5/Phase5Vote';
import Phase5Winner from './phase5/Phase5Winner';
import Phase5Lesson from './phase5/Phase5Lesson';
import GrandFinale from './phase5/GrandFinale';
import {
  Timer, Users, Award, Shield, Play, Pause, RotateCcw,
  RefreshCw, QrCode, Download, Copy, Check, X, Flame, Eye, EyeOff, Trees, Droplets, Zap, Sparkles, Trophy, BookOpen
} from 'lucide-react';

const MAX_STATIONS = 15;

const STRATEGY_BADGE = {
  cornucopia: { label: 'Cornucopia', icon: '⚔️', cls: 'bg-orange-100 text-orange-800 border-orange-300' },
  outskirts: { label: 'Outskirts', icon: '🎒', cls: 'bg-purple-100 text-purple-800 border-purple-300' },
  woods: { label: 'Woods', icon: '🌲', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
};

const P2_BADGE = {
  alliance: { label: 'Form Alliance', icon: '🤝', cls: 'bg-orange-100 text-orange-800 border-orange-300' },
  solo: { label: 'Go Solo', icon: '🌲', cls: 'bg-purple-100 text-purple-800 border-purple-300' }
};

const P3_LOC_BADGE = {
  puddle: '💧 Puddle',
  pond: '🌿 Pond',
  stream: '⛰️ Stream'
};

export default function ArenaLobby({ currentTribute, onNavigate }) {
  const [tributes, setTributes] = useState([]);
  const [timer, setTimer] = useState({ running: false, countdown: 30, duration: 30, visible: false });
  const [game, setGame] = useState(syncService.getGame());
  const [durationInput, setDurationInput] = useState(30);
  const [showRoster, setShowRoster] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasCelebratedEntry, setHasCelebratedEntry] = useState(false);
  const [viewAsPlayer, setViewAsPlayer] = useState(false);
  const initialResetTokenRef = useRef(null);

  const isGamemaker = currentTribute?.role === 'gamemaker';
  // Gamemaker keeps all header controls, but can toggle screen content between Gamemaker view and Player view
  const effectiveIsGamemaker = isGamemaker && !viewAsPlayer;
  const completedPhase = game?.completedPhase || 0;
  const inTheWoods = completedPhase >= 1;
  const myTributeRecord = !isGamemaker ? tributes.find(t => t.id === currentTribute?.id) : null;
  const isInAlliance = myTributeRecord?.allianceMode === 'alliance';

  // Subscribe to live multi-device synchronization
  useEffect(() => {
    const locationTitle = inTheWoods ? 'The Woods' : 'The Arena';
    document.title = isGamemaker
      ? `Gamemaker Console — ${locationTitle} | The Hunger Games`
      : `${locationTitle} | The Hunger Games`;

    const unsubscribe = syncService.subscribe(
      (updatedList) => setTributes(updatedList),
      (updatedTimer) => {
        setTimer(updatedTimer);
        if (updatedTimer?.duration) {
          setDurationInput(updatedTimer.duration);
        }
      },
      (updatedGame) => setGame(updatedGame)
    );
    return () => unsubscribe();
  }, [isGamemaker, inTheWoods]);

  // When Gamemaker resets the arena, force all players (not Gamemaker) back to the beginning
  useEffect(() => {
    const token = game?.resetToken || 0;
    if (initialResetTokenRef.current === null) {
      initialResetTokenRef.current = token;
      return;
    }
    if (!isGamemaker && token > initialResetTokenRef.current) {
      initialResetTokenRef.current = token;
      try {
        sessionStorage.removeItem("panem_tribute_session_v4");
      } catch (e) {}
      if (onNavigate) onNavigate('home');
      window.location.hash = '#/home';
      window.location.reload();
    }
  }, [game?.resetToken, isGamemaker, onNavigate]);

  // Register current tribute on pedestal (Tributes only; Gamemaker does not take a pedestal)
  useEffect(() => {
    if (currentTribute && !hasCelebratedEntry) {
      if (!isGamemaker) {
        syncService.registerTribute({
          ...currentTribute,
          status: "ready",
          joinedAt: Date.now()
        }).then(() => {
          setHasCelebratedEntry(true);
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#7C3AED', '#F97316', '#C026D3', '#FB923C']
          });
        });
      } else {
        // Ensure Gamemaker slot is registered on the server
        syncService.registerTribute(currentTribute).then(() => {
          setHasCelebratedEntry(true);
        });
      }
    }
  }, [currentTribute, hasCelebratedEntry, isGamemaker]);

  // Generate QR Code for Gamemaker share (points to Home page)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const joinUrl = window.location.origin + window.location.pathname + '#/home';
      QRCode.toDataURL(joinUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#3B0764', light: '#FFF7ED' }
      }).then(url => setQrDataUrl(url)).catch(() => {});
    }
  }, []);

  // Gamemaker Timer Controls
  const handleToggleTimer = () => {
    sound.playBeep();
    if (timer.running) syncService.controlTimer('pause');
    else syncService.controlTimer('start', durationInput);
  };

  const handleResetTimer = () => {
    sound.playBeep();
    syncService.controlTimer('reset', durationInput);
  };

  const handleChangeDuration = (newSeconds) => {
    const clamped = Math.max(5, Math.min(300, parseInt(newSeconds, 10) || 30));
    setDurationInput(clamped);
    syncService.controlTimer('set_duration', clamped);
  };

  const handleToggleTimerVisibility = () => {
    sound.playBeep();
    syncService.controlTimer('toggle_visibility', durationInput, { visible: !timer.visible });
  };

  const handleResetArena = () => {
    if (confirm("Reset the arena? All players will be removed and sent back to the start, while you remain Gamemaker.")) {
      sound.playCannon();
      syncService.controlTimer('reset_arena');
    }
  };

  // Gamemaker: select which 1 of the 3 papers is featured on takeaway slides
  const handleSelectLessonTopic = (index) => {
    sound.playBeep();
    syncService.controlGame('select_lesson_topic', undefined, { index });
  };

  // Phase 1 Controls
  const handleStartIntro = () => { sound.playBeep(); syncService.controlGame('start_intro', durationInput); };
  const handleStartChoice = (secs) => { sound.playCannon(); syncService.controlGame('start_choice', secs || durationInput); };
  const handleShowResults = () => { sound.playBeep(); syncService.controlGame('show_results'); };
  const handleRevealConsequences = () => { sound.playCannon(); syncService.controlGame('reveal_consequences'); };
  const handleShowLesson = () => { sound.playBeep(); syncService.controlGame('show_lesson'); };
  const handleBackToLobby = () => { sound.playBeep(); syncService.controlGame('back_to_lobby'); };

  // Phase 2 Controls
  const handleStartPhase2Intro = () => { sound.playBeep(); syncService.controlGame('start_p2_intro', 60); };
  const handleStartPhase2Choice = (secs) => { sound.playCannon(); syncService.controlGame('start_p2_choice', secs || 60); };
  const handleAssignAlliances = () => { sound.playCannon(); syncService.controlGame('assign_alliances'); };
  const handleShowPhase2Lesson = () => { sound.playBeep(); syncService.controlGame('show_p2_lesson'); };

  // Phase 3 Controls
  const handleStartPhase3Intro = () => { sound.playBeep(); syncService.controlGame('start_p3_intro', 30); };
  const handleStartPhase3Location = (secs) => { sound.playCannon(); syncService.controlGame('start_p3_location', secs || 30); };
  const handleMoveToPhase3Purify = () => { sound.playBeep(); syncService.controlGame('start_p3_purify'); };
  const handleRevealPhase3Outcomes = () => { sound.playCannon(); syncService.controlGame('reveal_p3_outcome'); };
  const handleShowPhase3Lesson = () => { sound.playBeep(); syncService.controlGame('show_p3_lesson'); };

  // Phase 4 Controls (Fire + The Feast)
  const handleStartPhase4Intro = () => { sound.playBeep(); syncService.controlGame('start_p4_intro', 30); };
  const handleStartPhase4Event = (secs) => { sound.playCannon(); syncService.controlGame('start_p4_event', secs || 30); };
  const handleTriggerPhase4Feast = (secs) => { sound.playCannon(); syncService.controlGame('trigger_p4_twist', secs || 25); };
  const handleRevealPhase4Outcomes = () => { sound.playCannon(); syncService.controlGame('reveal_p4_outcome'); };
  const handleShowPhase4Lesson = () => { sound.playBeep(); syncService.controlGame('show_p4_lesson'); };

  // Phase 5 & Finale Controls
  const handleStartPhase5Intro = () => { sound.playBeep(); syncService.controlGame('start_p5_intro', 60); };
  const handleStartPhase5Pitch = (secs) => { sound.playCannon(); syncService.controlGame('start_p5_pitch', secs || 60); };
  const handleStartPhase5Vote = (secs) => { sound.playBeep(); syncService.controlGame('start_p5_vote', secs || 45); };
  const handleRevealPhase5Winner = () => { sound.playCannon(); syncService.controlGame('reveal_p5_winner'); };
  const handleShowPhase5Lesson = () => { sound.playBeep(); syncService.controlGame('show_p5_lesson'); };
  const handleShowFinale = () => { sound.playCannon(); syncService.controlGame('show_finale'); };

  // Tribute private votes
  const handleSelectStrategy = (strategy) => {
    if (!currentTribute?.id) return;
    sound.playBeep();
    syncService.submitVote(currentTribute.id, strategy, 'phase1');
  };

  const handleSelectPhase2Choice = (choice) => {
    if (!currentTribute?.id) return;
    sound.playBeep();
    syncService.submitVote(currentTribute.id, choice, 'phase2');
  };

  const handleSelectPhase3Location = (loc) => {
    if (!currentTribute?.id) return;
    sound.playBeep();
    syncService.submitVote(currentTribute.id, loc, 'phase3_location');
  };

  const handleSelectPhase3Action = (act) => {
    if (!currentTribute?.id) return;
    sound.playBeep();
    syncService.submitVote(currentTribute.id, act, 'phase3_purify');
  };

  const handleSubmitPhase4Fire = (move) => {
    if (!currentTribute?.id) return;
    sound.playBeep();
    syncService.submitVote(currentTribute.id, move, 'phase4_fire');
  };

  const handleSubmitPhase4Feast = (move) => {
    if (!currentTribute?.id) return;
    sound.playBeep();
    syncService.submitVote(currentTribute.id, move, 'phase4_feast');
  };

  const handleSubmitPhase5Pitch = (pitch) => {
    if (!currentTribute?.id) return;
    sound.playBeep();
    syncService.submitVote(currentTribute.id, 'pitch', 'phase5_pitch', { pitch });
  };

  const handleCastPhase5Vote = (targetTributeId) => {
    if (!currentTribute?.id) return;
    sound.playBeep();
    syncService.submitVote(currentTribute.id, targetTributeId, 'phase5_vote');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      const joinUrl = window.location.origin + window.location.pathname + '#/home';
      navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pedestals = Array.from({ length: MAX_STATIONS }, (_, i) => {
    const num = i + 1;
    const tribute = tributes.find(t => t.pedestalNumber === num);
    return { number: num, tribute };
  });

  const phase = game?.phase || 'lobby';
  const isLessonPhase = ['lesson', 'p2_lesson', 'p3_lesson', 'p4_lesson', 'p5_lesson'].includes(phase);
  const hideTakeawayToArena = isLessonPhase && Boolean(game?.takeawayHidden) && !effectiveIsGamemaker;
  const myChoice = currentTribute?.id ? game?.choices?.[currentTribute.id] : null;
  const myP2Choice = currentTribute?.id ? game?.p2Choices?.[currentTribute.id] : null;
  const myP3Location = currentTribute?.id ? game?.p3Locations?.[currentTribute.id] : null;
  const myP3Action = currentTribute?.id ? game?.p3Actions?.[currentTribute.id] : null;
  const myP4Fire = currentTribute?.id ? game?.p4Fire?.[currentTribute.id] : null;
  const myP4Feast = currentTribute?.id ? game?.p4Feast?.[currentTribute.id] : null;
  const selectedLessonIndex = game?.selectedLessonIndex ?? 0;
  const myP5Pitch = currentTribute?.id ? game?.p5Pitches?.[currentTribute.id] : null;
  const myP5Vote = currentTribute?.id ? game?.p5Votes?.[currentTribute.id] : null;
  const formattedTime = `${Math.floor(timer.countdown / 60).toString().padStart(2, '0')}:${(timer.countdown % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#FAF5FF] text-purple-950 flex flex-col justify-between relative overflow-x-hidden reaping-sun-glow">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-800 via-orange-500 to-purple-800" />

      {/* ================= HEADER BAR ================= */}
      <header className="relative z-20 border-b border-purple-200 bg-white/95 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Top Left: User Avatar, Role Badge & Private Score (for Tribute only) */}
        <div className="flex items-center gap-2.5">
          <div className={`relative rounded-full p-0.5 border-2 ${isGamemaker ? 'border-amber-500 bg-amber-50' : 'border-purple-300 bg-purple-50'}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <AvatarRenderer avatar={currentTribute?.avatar} districtId={currentTribute?.districtId || 1} size="sm" />
            </div>
            {isGamemaker && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow">
                👑
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-purple-950 font-cinzel truncate max-w-[140px] sm:max-w-none">
                {currentTribute?.realName || "Tribute"}
              </span>
              <span className={`text-[9px] font-mono-capitol font-bold px-1.5 py-0.5 rounded-full uppercase ${
                isGamemaker ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-purple-100 text-purple-800'
              }`}>
                {isGamemaker ? 'Gamemaker' : 'Tribute'}
              </span>
              {!isGamemaker && myTributeRecord && (
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200" title="Only you can see your score">
                  {myTributeRecord.totalScore ?? 0} pts
                </span>
              )}
            </div>
            <p className="text-[10px] text-purple-600 font-mono-capitol hidden sm:block">
              {isGamemaker
                ? (inTheWoods ? 'Gamemaker Console • The Woods' : 'Gamemaker Console Active')
                : (inTheWoods ? 'Hiding in The Woods' : 'Pedestal Assigned')}
            </p>
          </div>
        </div>

        {/* Center: Countdown Clock (Only visible to players when Gamemaker enables it) */}
        {timer.visible ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl border border-purple-200 bg-purple-50 shadow-inner">
            <Timer className={`w-4 h-4 ${timer.countdown <= 10 && timer.countdown > 0 ? 'text-orange-600 animate-bounce' : 'text-purple-600'}`} />
            <span className={`text-lg sm:text-xl font-black font-mono tracking-widest ${
              timer.countdown <= 10 && timer.countdown > 0 ? 'text-orange-600' : 'text-purple-900'
            }`}>
              {formattedTime}
            </span>

            {isGamemaker && (
              <div className="flex items-center gap-1 ml-1 pl-2 border-l border-purple-200">
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={durationInput}
                  disabled={timer.running}
                  onChange={(e) => handleChangeDuration(e.target.value)}
                  title="Set countdown seconds"
                  className="w-12 px-1 py-0.5 text-center text-xs font-mono font-bold rounded-md border border-purple-300 bg-white text-purple-950 disabled:opacity-50"
                />
                <span className="text-[10px] font-mono text-purple-500 mr-0.5">s</span>

                <button
                  onClick={handleToggleTimer}
                  className="p-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors"
                  title={timer.running ? "Pause Countdown" : "Start Countdown"}
                >
                  {timer.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="p-1 rounded-lg bg-purple-200 hover:bg-purple-300 text-purple-900 transition-colors"
                  title={`Reset to ${durationInput}s`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleToggleTimerVisibility}
                  className="p-1 rounded-lg bg-white hover:bg-purple-100 border border-purple-200 text-purple-600 transition-colors"
                  title="Disable & hide header timer from players"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : isGamemaker ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleTimerVisibility}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all"
              title="Enable header timer for everyone"
            >
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              <span>Enable Timer</span>
            </button>
            {(timer.running || ['choice', 'p2_choice', 'p3_location', 'p3_purify', 'p4_event', 'p4_twist', 'p5_pitch', 'p5_vote'].includes(phase)) && (
              <button
                onClick={handleToggleTimer}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
                  timer.running
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                title={timer.running ? 'Pause active game countdown' : 'Resume active game countdown'}
              >
                {timer.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{timer.running ? 'Pause' : 'Resume'}</span>
              </button>
            )}
          </div>
        ) : null}

        {/* Top Right: Gamemaker Phase Launch Button, View Toggle, QR, Reset & Roster */}
        <div className="flex items-center gap-2">
          {isGamemaker && (
            <button
              onClick={() => setViewAsPlayer(!viewAsPlayer)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                viewAsPlayer
                  ? 'bg-purple-800 text-white border-purple-900'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
              }`}
              title="Switch main display between Gamemaker view and Player view"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{viewAsPlayer ? 'Player View' : 'Gamemaker View'}</span>
            </button>
          )}

          {isGamemaker && (
            <button
              onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/notes`, 'panem_presenter_notes', 'width=980,height=720')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold transition-all shadow-sm"
              title="Open private Presenter Notes in a second window (keep off your shared screen)"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-300" />
              <span className="hidden md:inline">Notes Window</span>
            </button>
          )}
          {isGamemaker && phase === 'lobby' && completedPhase === 0 && (
            <button
              onClick={handleStartIntro}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Start Phase 1</span>
            </button>
          )}

          {isGamemaker && phase === 'lobby' && completedPhase === 1 && (
            <button
              onClick={handleStartPhase2Intro}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Start Phase 2</span>
            </button>
          )}

          {isGamemaker && phase === 'lobby' && completedPhase === 2 && (
            <button
              onClick={handleStartPhase3Intro}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Start Phase 3</span>
            </button>
          )}

          {isGamemaker && phase === 'lobby' && completedPhase === 3 && (
            <button
              onClick={handleStartPhase4Intro}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Start Phase 4</span>
            </button>
          )}

          {isGamemaker && phase === 'lobby' && completedPhase === 4 && (
            <button
              onClick={handleStartPhase5Intro}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Phase 5</span>
            </button>
          )}

          {isGamemaker && phase === 'lobby' && completedPhase >= 5 && (
            <button
              onClick={handleShowFinale}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Final Leaderboard</span>
            </button>
          )}

          {isGamemaker && (
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-700 text-xs font-bold transition-all shadow-sm"
              title="View & Save Slide QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">QR Code</span>
            </button>
          )}

          {isGamemaker && (
            <button
              onClick={handleResetArena}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all"
              title="Reset all tributes"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">Reset Arena</span>
            </button>
          )}

          <button
            onClick={() => setShowRoster(!showRoster)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-purple-200 bg-white text-purple-800 text-xs font-bold shadow-sm hover:border-purple-300 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Tributes ({tributes.length}/15)</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT BY GAME PHASE ================= */}
      {/* Phase 1 */}
      {phase === 'intro' && (
        <ArenaIntro
          isGamemaker={effectiveIsGamemaker}
          durationSeconds={durationInput}
          tributeCount={tributes.length}
          onChangeDuration={handleChangeDuration}
          onStartChoice={handleStartChoice}
        />
      )}
      {phase === 'choice' && (
        <CornucopiaChoice
          isGamemaker={effectiveIsGamemaker}
          countdown={timer.countdown}
          duration={timer.duration || durationInput}
          myChoice={myChoice}
          poll={game?.poll}
          onSelectStrategy={handleSelectStrategy}
          onCloseVoting={handleShowResults}
        />
      )}
      {phase === 'results' && (
        <VoteResults
          isGamemaker={effectiveIsGamemaker}
          poll={game?.poll}
          onRevealConsequences={handleRevealConsequences}
        />
      )}
      {phase === 'consequences' && (
        <ConsequenceReveal
          isGamemaker={effectiveIsGamemaker}
          currentTribute={currentTribute}
          tributes={tributes}
          poll={game?.poll}
          scaledRisks={game?.scaledRisks}
          onShowLesson={handleBackToLobby}
        />
      )}
      {phase === 'lesson' && !hideTakeawayToArena && (
        <LessonReveal
          isGamemaker={effectiveIsGamemaker}
          selectedTopicIndex={selectedLessonIndex}
          takeawaySlideIndex={game?.takeawaySlideIndex ?? 0}
          takeawayHidden={Boolean(game?.takeawayHidden)}
          onSelectTopic={handleSelectLessonTopic}
          onChangeTakeawaySlide={(idx) => syncService.controlGame('set_takeaway_slide', undefined, { index: idx })}
          onToggleHidden={() => syncService.controlGame('toggle_takeaway_hidden')}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {/* Phase 2 */}
      {phase === 'p2_intro' && (
        <Phase2Intro
          isGamemaker={effectiveIsGamemaker}
          durationSeconds={game?.durationSeconds || 60}
          tributeCount={tributes.length}
          onStartChoice={handleStartPhase2Choice}
        />
      )}
      {phase === 'p2_choice' && (
        <Phase2Choice
          isGamemaker={effectiveIsGamemaker}
          countdown={timer.countdown}
          duration={timer.duration || 60}
          myChoice={myP2Choice}
          poll={game?.p2Poll}
          onSelectChoice={handleSelectPhase2Choice}
          onAssignAlliances={handleAssignAlliances}
        />
      )}
      {phase === 'p2_alliances' && (
        <AllianceReveal
          isGamemaker={effectiveIsGamemaker}
          currentTribute={currentTribute}
          tributes={tributes}
          alliances={game?.alliances}
          soloIds={game?.soloIds}
          onShowLesson={handleBackToLobby}
        />
      )}
      {phase === 'p2_lesson' && !hideTakeawayToArena && (
        <Phase2Lesson
          isGamemaker={effectiveIsGamemaker}
          selectedTopicIndex={selectedLessonIndex}
          takeawayHidden={Boolean(game?.takeawayHidden)}
          onSelectTopic={handleSelectLessonTopic}
          onToggleHidden={() => syncService.controlGame('toggle_takeaway_hidden')}
          onBackToWoods={handleBackToLobby}
        />
      )}

      {/* Phase 3 */}
      {phase === 'p3_intro' && (
        <Phase3Intro
          isGamemaker={effectiveIsGamemaker}
          durationSeconds={game?.durationSeconds || 30}
          tributeCount={tributes.length}
          onStartLocation={handleStartPhase3Location}
        />
      )}
      {phase === 'p3_location' && (
        <Phase3Location
          isGamemaker={effectiveIsGamemaker}
          isInAlliance={isInAlliance}
          countdown={timer.countdown}
          duration={timer.duration || 30}
          myLocation={myP3Location}
          poll={game?.p3LocationPoll}
          onSelectLocation={handleSelectPhase3Location}
          onMoveToPurify={handleMoveToPhase3Purify}
        />
      )}
      {phase === 'p3_purify' && (
        <Phase3Purify
          isGamemaker={effectiveIsGamemaker}
          isInAlliance={isInAlliance}
          countdown={timer.countdown}
          duration={timer.duration || 30}
          myLocation={myP3Location}
          myAction={myP3Action}
          poll={game?.p3ActionPoll}
          onSelectAction={handleSelectPhase3Action}
          onRevealOutcomes={handleRevealPhase3Outcomes}
        />
      )}
      {phase === 'p3_outcome' && (
        <Phase3Outcome
          isGamemaker={effectiveIsGamemaker}
          currentTribute={currentTribute}
          tributes={tributes}
          locationPoll={game?.p3LocationPoll}
          actionPoll={game?.p3ActionPoll}
          onShowLesson={handleBackToLobby}
        />
      )}
      {phase === 'p3_lesson' && !hideTakeawayToArena && (
        <Phase3Lesson
          isGamemaker={effectiveIsGamemaker}
          selectedTopicIndex={selectedLessonIndex}
          takeawaySlideIndex={game?.takeawaySlideIndex ?? 0}
          takeawayHidden={Boolean(game?.takeawayHidden)}
          onSelectTopic={handleSelectLessonTopic}
          onChangeTakeawaySlide={(idx) => syncService.controlGame('set_takeaway_slide', undefined, { index: idx })}
          onToggleHidden={() => syncService.controlGame('toggle_takeaway_hidden')}
          onBackToWoods={handleBackToLobby}
        />
      )}

      {/* Phase 4 (Fire Disaster + The Feast) */}
      {phase === 'p4_intro' && (
        <Phase4Intro
          isGamemaker={effectiveIsGamemaker}
          durationSeconds={game?.durationSeconds || 30}
          tributeCount={tributes.length}
          onStartEvent={handleStartPhase4Event}
        />
      )}
      {phase === 'p4_event' && (
        <Phase4Event
          isGamemaker={effectiveIsGamemaker}
          countdown={timer.countdown}
          duration={timer.duration || 30}
          myFireChoice={myP4Fire}
          poll={game?.p4FirePoll}
          onSubmitFire={handleSubmitPhase4Fire}
          onTriggerFeast={handleTriggerPhase4Feast}
        />
      )}
      {phase === 'p4_twist' && (
        <Phase4Twist
          isGamemaker={effectiveIsGamemaker}
          countdown={timer.countdown}
          duration={timer.duration || 25}
          myFeastChoice={myP4Feast}
          poll={game?.p4FeastPoll}
          onSubmitFeast={handleSubmitPhase4Feast}
          onRevealOutcomes={handleRevealPhase4Outcomes}
        />
      )}
      {phase === 'p4_outcome' && (
        <Phase4Outcome
          isGamemaker={effectiveIsGamemaker}
          currentTribute={currentTribute}
          tributes={tributes}
          firePoll={game?.p4FirePoll}
          feastPoll={game?.p4FeastPoll}
          onShowLesson={handleShowPhase4Lesson}
        />
      )}
      {phase === 'p4_lesson' && !hideTakeawayToArena && (
        <Phase4Lesson
          isGamemaker={effectiveIsGamemaker}
          selectedTopicIndex={selectedLessonIndex}
          takeawaySlideIndex={game?.takeawaySlideIndex ?? 0}
          takeawayHidden={Boolean(game?.takeawayHidden)}
          onSelectTopic={handleSelectLessonTopic}
          onChangeTakeawaySlide={(idx) => syncService.controlGame('set_takeaway_slide', undefined, { index: idx })}
          onToggleHidden={() => syncService.controlGame('toggle_takeaway_hidden')}
          onBackToWoods={handleBackToLobby}
        />
      )}

      {/* Phase 5 & Grand Finale */}
      {phase === 'p5_intro' && (
        <Phase5Intro
          isGamemaker={effectiveIsGamemaker}
          durationSeconds={game?.durationSeconds || 60}
          tributeCount={tributes.length}
          onStartPitch={handleStartPhase5Pitch}
        />
      )}
      {phase === 'p5_pitch' && (
        <Phase5Pitch
          isGamemaker={effectiveIsGamemaker}
          countdown={timer.countdown}
          duration={timer.duration || 60}
          tributes={tributes}
          pitches={game?.p5Pitches}
          myPitch={myP5Pitch}
          onSubmitPitch={handleSubmitPhase5Pitch}
          onStartVote={handleStartPhase5Vote}
        />
      )}
      {phase === 'p5_vote' && (
        <Phase5Vote
          isGamemaker={effectiveIsGamemaker}
          currentTribute={currentTribute}
          countdown={timer.countdown}
          duration={timer.duration || 45}
          tributes={tributes}
          pitches={game?.p5Pitches}
          votes={game?.p5Votes}
          myVote={myP5Vote}
          onCastVote={handleCastPhase5Vote}
          onRevealWinner={handleRevealPhase5Winner}
        />
      )}
      {phase === 'p5_winner' && (
        <Phase5Winner
          isGamemaker={effectiveIsGamemaker}
          currentTribute={currentTribute}
          tributes={tributes}
          podium={game?.p5Podium}
          onShowLesson={handleShowFinale}
        />
      )}
      {phase === 'p5_lesson' && !hideTakeawayToArena && (
        <Phase5Lesson
          isGamemaker={effectiveIsGamemaker}
          selectedTopicIndex={selectedLessonIndex}
          takeawayHidden={Boolean(game?.takeawayHidden)}
          onSelectTopic={handleSelectLessonTopic}
          onToggleHidden={() => syncService.controlGame('toggle_takeaway_hidden')}
          onShowFinale={handleShowFinale}
        />
      )}
      {phase === 'finale' && (
        <GrandFinale
          isGamemaker={effectiveIsGamemaker}
          currentTribute={currentTribute}
          tributes={tributes}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {/* Lobby View: Arena (before Phase 1) -> The Woods (after Phase 1); also shown to players when takeaway is hidden */}
      {(phase === 'lobby' || hideTakeawayToArena) && (
        <main className="relative z-10 flex-1 flex flex-col px-4 sm:px-6 py-6">
          <div className="flex flex-col items-center justify-center mb-5 gap-1">
            {inTheWoods ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold font-mono-capitol">
                  <Trees className="w-3.5 h-3.5 text-emerald-700" />
                  The Woods • {tributes.length} / 15 Tributes Hiding
                </span>
                <p className="text-[11px] text-purple-600 font-mono-capitol">
                  {completedPhase >= 5
                    ? 'All 5 phases complete — May the odds be ever in your favor!'
                    : completedPhase >= 4
                    ? 'Phase 4 complete — ready for the Phase 5 Grand Finale'
                    : completedPhase >= 3
                    ? 'Phase 3 complete — ready for Phase 4'
                    : completedPhase >= 2
                    ? 'Alliances are set — ready for Phase 3'
                    : 'Phase 1 complete — tributes have scattered into the woods'}
                </p>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold font-mono-capitol">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                {tributes.length} / 15 Tributes Ready
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 w-full max-w-5xl mx-auto">
            {pedestals.map(({ number, tribute }) => {
              const isMe = tribute && tribute.id === currentTribute?.id;
              const district = tribute ? (DISTRICTS.find(d => d.id === tribute.districtId) || DISTRICTS[0]) : null;

              return (
                <div
                  key={number}
                  className={`relative flex flex-col items-center justify-between p-2.5 rounded-2xl min-h-[180px] transition-all duration-300 ${
                    isMe
                      ? 'bg-orange-50 border-2 border-orange-500 shadow-xl ring-4 ring-orange-400/30'
                      : tribute
                      ? 'bg-white border-2 border-purple-200 shadow-md animate-tribute-rise'
                      : 'bg-purple-50/60 border-2 border-dashed border-purple-200'
                  }`}
                >
                  <div className="w-full flex items-center justify-between text-[9px] font-mono-capitol font-bold">
                    <span className={`px-1.5 py-0.5 rounded ${
                      isMe ? 'bg-orange-500 text-white' : tribute ? 'bg-purple-100 text-purple-900' : 'text-purple-400'
                    }`}>
                      #{number}
                    </span>
                    {isMe ? (
                      <span className="text-[8px] font-black text-orange-700 bg-orange-200 px-1 rounded">YOU</span>
                    ) : tribute ? (
                      <span className="text-sm">{district?.icon}</span>
                    ) : null}
                  </div>

                  {tribute ? (
                    <div className="flex flex-col items-center flex-1 justify-center w-full mt-1">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                        <AvatarRenderer avatar={tribute.avatar} districtId={tribute.districtId} size="md" showPedestal={false} />
                      </div>
                      <div className="text-center w-full mt-2 space-y-0.5">
                        <div className="text-xs font-black text-purple-950 font-cinzel truncate w-full" title={tribute.realName}>
                          {tribute.realName}
                        </div>
                        <div className="text-[9px] text-purple-600 font-mono-capitol truncate w-full" title={district?.name}>
                          {district?.name}
                        </div>
                        {tribute.allianceName && (
                          <div className={`inline-block mt-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold font-mono-capitol ${
                            tribute.allianceMode === 'alliance'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {tribute.allianceMode === 'alliance' ? `🤝 ${tribute.allianceName}` : '🌲 Solo'}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-center py-2">
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center mb-1">
                        <Shield className="w-4 h-4 text-purple-300 opacity-50" />
                      </div>
                      <span className="text-[9px] text-purple-400 font-mono-capitol">Open</span>
                    </div>
                  )}

                  {/* Bottom: ONLY show score on YOUR OWN card; other tributes show READY / HIDING */}
                  <div className="w-full pt-1.5 border-t border-purple-100 flex items-center justify-center text-[8px] font-mono-capitol font-bold mt-1">
                    {tribute ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {isMe && typeof tribute.totalScore === 'number' && tribute.totalScore !== 0
                          ? `YOUR SCORE: ${tribute.totalScore} PTS`
                          : inTheWoods ? 'HIDING' : 'READY'}
                      </span>
                    ) : (
                      <span className="text-purple-300">{inTheWoods ? `SPOT ${number}` : `PEDESTAL ${number}`}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Minimal Footer */}
      <footer className="relative z-20 border-t border-purple-200 bg-white py-2 px-4 text-center">
        <p className="text-xs font-black text-purple-900 font-cinzel tracking-widest uppercase">
          MAY THE ODDS BE IN YOUR FAVOR
        </p>
      </footer>

      {/* ================= MODERATOR QR CODE MODAL ================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white rounded-3xl border-2 border-purple-200 p-6 text-purple-950 shadow-2xl text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 text-purple-700 hover:text-purple-950 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2 font-mono-capitol">
              <QrCode className="w-3.5 h-3.5" />
              Tribute Join Code
            </div>

            <h3 className="text-xl font-bold font-cinzel text-purple-950 mb-1">
              Scan to Join Arena
            </h3>
            <p className="text-xs text-purple-700 mb-4">
              Project this QR code on your slide or screen for tributes to join on their phones!
            </p>

            {qrDataUrl && (
              <div className="p-3 bg-white rounded-2xl border-2 border-orange-300 shadow-md inline-block mb-4">
                <img src={qrDataUrl} alt="Presentation Join QR Code" className="w-44 h-44 rounded-xl" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 text-xs bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download="hunger-games-join-qr.png"
                  className="py-2 px-3 text-xs bg-gradient-to-r from-orange-500 to-purple-800 text-white font-bold rounded-xl shadow-sm hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save QR</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ROSTER DRAWER (SCORES & CHOICES PRIVATE) ================= */}
      {showRoster && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white border-l border-purple-200 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  <h3 className="text-base font-bold font-cinzel text-purple-950">
                    Tribute Roster ({tributes.length}/15)
                  </h3>
                </div>
                <button
                  onClick={() => setShowRoster(false)}
                  className="text-gray-400 hover:text-purple-950 text-sm px-2 py-1 font-bold"
                >
                  ✕
                </button>
              </div>

              {isGamemaker && (
                <p className="text-[11px] text-orange-700 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 mt-3 font-mono-capitol">
                  Gamemaker Private View: Tribute choices &amp; scores appear below.
                </p>
              )}

              <div className="space-y-2 mt-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                {tributes.map((t, idx) => {
                  const dist = DISTRICTS.find(d => d.id === t.districtId) || DISTRICTS[0];
                  const isCurrent = t.id === currentTribute?.id;
                  const p1Choice = isGamemaker ? game?.choices?.[t.id] : null;
                  const p1Info = p1Choice ? STRATEGY_BADGE[p1Choice.strategy] : null;
                  const p2Choice = isGamemaker ? game?.p2Choices?.[t.id] : null;
                  const p2Info = p2Choice ? P2_BADGE[p2Choice.choice] : null;
                  const p3Loc = isGamemaker ? game?.p3Locations?.[t.id] : null;
                  const p3Act = isGamemaker ? game?.p3Actions?.[t.id] : null;

                  return (
                    <div
                      key={t.id || idx}
                      className={`p-2.5 rounded-xl border flex flex-col gap-1.5 ${
                        isCurrent
                          ? 'bg-orange-50 border-orange-400 text-purple-950'
                          : 'bg-purple-50/50 border-purple-100 text-purple-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="scale-75 -mx-2">
                          <AvatarRenderer avatar={t.avatar} districtId={t.districtId} size="sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-purple-950 truncate flex items-center justify-between gap-1.5">
                            <span className="truncate flex items-center gap-1">
                              <span>{t.realName}</span>
                              {isCurrent && <span className="text-[9px] px-1 bg-orange-200 text-orange-800 rounded font-bold">YOU</span>}
                            </span>
                            {/* Score ONLY visible to the tribute themselves or the Gamemaker */}
                            {(isCurrent || isGamemaker) && (
                              <span className="text-[11px] font-mono font-black text-purple-800 shrink-0">
                                {t.totalScore ?? 0} pts
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-purple-700 truncate">
                            {dist.icon} {dist.name} • {t.allianceName ? t.allianceName : `Pedestal #${t.pedestalNumber}`}
                          </div>
                        </div>
                      </div>

                      {isGamemaker && (
                        <div className="space-y-1 pt-1.5 border-t border-purple-100 text-[10px] font-mono-capitol">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-500">Phase 1:</span>
                            {p1Info ? (
                              <span className={`px-2 py-0.5 rounded-full border font-bold ${p1Info.cls}`}>
                                {p1Info.icon} {p1Info.label} ({p1Choice.responseTime}s)
                              </span>
                            ) : (
                              <span className="text-purple-400 italic">Not voted</span>
                            )}
                          </div>
                          {(inTheWoods || phase.startsWith('p2_')) && (
                            <div className="flex items-center justify-between">
                              <span className="text-purple-500">Phase 2:</span>
                              {p2Info ? (
                                <span className={`px-2 py-0.5 rounded-full border font-bold ${p2Info.cls}`}>
                                  {p2Info.icon} {p2Info.label}
                                </span>
                              ) : (
                                <span className="text-purple-400 italic">Not voted</span>
                              )}
                            </div>
                          )}
                          {(completedPhase >= 2 || phase.startsWith('p3_')) && (
                            <div className="flex items-center justify-between">
                              <span className="text-purple-500">Phase 3:</span>
                              {p3Loc ? (
                                <span className="px-2 py-0.5 rounded-full border font-bold bg-purple-100 text-purple-800 border-purple-300">
                                  {P3_LOC_BADGE[p3Loc]}{p3Act ? ` • ${p3Act === 'purify' ? '🔥 Purify' : '🥤 Drink'}` : ''}
                                </span>
                              ) : (
                                <span className="text-purple-400 italic">Not voted</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowRoster(false)}
              className="w-full py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase transition-all mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

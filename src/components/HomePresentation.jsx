import React, { useState, useEffect } from 'react';
import AvatarRenderer from './AvatarRenderer';
import { syncService } from '../services/syncService';
import { sound } from './SoundEffects';
import {
  ChevronLeft, ChevronRight, Play, KeyRound, X, BookOpen,
  Timer, Shield, Trophy, Sparkles, PauseCircle, Flame, ArrowRight
} from 'lucide-react';

const TOTAL_SLIDES = 7; // 0 = Home Title Page, 1..6 = Instruction Slides

export default function HomePresentation({ tributeData, game, onGamemakerAuth, onBeginGames }) {
  const [showGmModal, setShowGmModal] = useState(false);
  const [gmName, setGmName] = useState(tributeData?.realName || '');
  const [gmKey, setGmKey] = useState('');
  const [gmError, setGmError] = useState('');

  const isGamemaker = tributeData?.role === 'gamemaker' && Boolean(tributeData?.gamemakerAuthed);
  const gamemakerTaken = Boolean(game?.gamemakerId && game.gamemakerId !== tributeData?.id);
  const slideIndex = game?.slideIndex ?? 0;

  useEffect(() => {
    document.title = 'Would Our Team Survive the Hunger Games?';
  }, []);

  // Keyboard arrow navigation for Gamemaker
  useEffect(() => {
    if (!isGamemaker) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' && slideIndex < TOTAL_SLIDES - 1) {
        sound.playBeep();
        syncService.controlGame('set_slide', undefined, { index: slideIndex + 1 });
      } else if (e.key === 'ArrowLeft' && slideIndex > 0) {
        sound.playBeep();
        syncService.controlGame('set_slide', undefined, { index: slideIndex - 1 });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isGamemaker, slideIndex]);

  const handleSlideChange = (nextIdx) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, nextIdx));
    sound.playBeep();
    syncService.controlGame('set_slide', undefined, { index: clamped });
  };

  const handleGmSubmit = async (e) => {
    e.preventDefault();
    setGmError('');
    if (!gmName.trim()) {
      setGmError('Please enter your name.');
      return;
    }
    if (!gmKey.trim()) {
      setGmError('Please enter the Gamemaker access key.');
      return;
    }
    const res = await syncService.registerTribute({
      id: tributeData?.id,
      role: 'gamemaker',
      realName: gmName.trim(),
      gamemakerKey: gmKey.trim()
    });
    if (res?.rejected) {
      setGmError(res.error || 'Invalid Gamemaker access key.');
      return;
    }
    sound.playFanfare();
    setShowGmModal(false);
    onGamemakerAuth(gmName.trim());
  };

  return (
    <div className="min-h-screen bg-[#FAF5FF] text-purple-950 flex flex-col justify-between relative overflow-x-hidden reaping-sun-glow">
      {/* Top accent stripe */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-800 via-orange-500 to-purple-800" />

      {/* ================= TOP HEADER BAR: TRIBUTE / GAMEMAKER ================= */}
      <header className="relative z-20 border-b border-purple-200 bg-white/95 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Left: Role Switcher or Authenticated Gamemaker */}
        {isGamemaker ? (
          <div className="flex items-center gap-2.5">
            <div className="relative rounded-full p-0.5 border-2 border-amber-500 bg-amber-50">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <AvatarRenderer avatar={tributeData?.avatar} districtId={tributeData?.districtId || 1} size="sm" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow">
                👑
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black font-cinzel text-purple-950">{tributeData?.realName}</span>
                <span className="text-[9px] font-mono-capitol font-bold px-1.5 py-0.5 rounded-full uppercase bg-amber-100 text-amber-800 border border-amber-300">
                  Gamemaker
                </span>
              </div>
              <p className="text-[10px] text-purple-600 font-mono-capitol hidden sm:block">
                Use ← / → arrows to present slides
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 p-1 bg-purple-100/70 rounded-xl border border-purple-200">
            <span className="px-3 py-1 rounded-lg text-xs font-black bg-orange-500 text-white shadow-sm flex items-center gap-1.5">
              <span>🏹</span>
              <span>Tribute</span>
            </span>
            <button
              type="button"
              disabled={gamemakerTaken}
              onClick={() => setShowGmModal(true)}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                gamemakerTaken
                  ? 'text-purple-400 opacity-50 cursor-not-allowed'
                  : 'text-purple-800 hover:bg-white'
              }`}
              title={gamemakerTaken ? 'A Gamemaker is already active' : 'Sign in as the Gamemaker'}
            >
              <span>👑</span>
              <span>{gamemakerTaken ? 'Gamemaker (Active)' : 'Gamemaker'}</span>
            </button>
          </div>
        )}

        {/* Center/Right: Slide Progress + Gamemaker Notes */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
              <button
                key={i}
                type="button"
                disabled={!isGamemaker}
                onClick={() => isGamemaker && handleSlideChange(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slideIndex
                    ? 'w-6 bg-orange-500'
                    : 'w-2 bg-purple-200 hover:bg-purple-300'
                } ${isGamemaker ? 'cursor-pointer' : 'cursor-default'}`}
                title={i === 0 ? 'Home' : `Slide ${i}`}
              />
            ))}
          </div>

          <span className="text-[11px] font-mono-capitol font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
            {slideIndex === 0 ? 'Home' : `Slide ${slideIndex} / 6`}
          </span>

          {isGamemaker && (
            <button
              type="button"
              onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/notes`, 'panem_presenter_notes', 'width=980,height=720')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow-sm transition-all"
              title="Open private Presenter Notes in a second window"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-300" />
              <span className="hidden sm:inline">Notes</span>
            </button>
          )}
        </div>
      </header>

      {/* ================= SLIDE STAGE ================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-6">
        <div className="w-full max-w-4xl flex items-center gap-3 sm:gap-5">
          {/* Left Arrow (Gamemaker only) */}
          {isGamemaker && (
            <button
              type="button"
              disabled={slideIndex === 0}
              onClick={() => handleSlideChange(slideIndex - 1)}
              className="p-2.5 sm:p-3 rounded-2xl bg-white border-2 border-purple-200 text-purple-900 hover:border-orange-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all shrink-0"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Active Slide Card */}
          <div className="flex-1">
            {/* SLIDE 0: HOME TITLE PAGE */}
            {slideIndex === 0 && (
              <div className="rounded-3xl bg-gradient-to-br from-purple-950 via-purple-900 to-orange-800 text-white p-8 sm:p-14 shadow-2xl border-2 border-orange-400/60 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-orange-300/40 text-orange-200 text-xs font-bold font-mono-capitol uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                  Interactive Share &amp; Learn
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-black font-cinzel tracking-wide leading-tight">
                    Would Our Team Survive the Hunger Games?
                  </h1>
                  <p className="text-base sm:text-xl text-orange-200 font-medium max-w-2xl mx-auto">
                    The Psychology Behind Our Decisions Under Pressure
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono-capitol font-bold text-purple-100">
                      Phase {n}: ???
                    </span>
                  ))}
                </div>

                {!isGamemaker && (
                  <div className="pt-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/25 border border-white/15 text-xs font-mono-capitol text-purple-100">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                      Waiting for the Gamemaker to start the briefing...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* SLIDE 1: BRIEF OVERVIEW OF THE HUNGER GAMES */}
            {slideIndex === 1 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    Briefing 1 of 6 • Overview
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    Welcome to the Arena
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-7 space-y-3 text-sm sm:text-base text-purple-800 leading-relaxed">
                    <p>
                      In <strong>The Hunger Games</strong>, tributes are placed into an unpredictable arena with limited time, incomplete information, and tough choices.
                    </p>
                    <p>
                      Today, <strong>up to 15 teammates</strong> will step into the arena together — facing high-pressure scenarios designed around <strong>real psychology research</strong> on how humans think, trust, and react.
                    </p>
                  </div>

                  {/* Mini Visual Mockup of the Arena Pedestals */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-2.5">
                    <div className="text-[10px] font-mono-capitol font-bold uppercase text-purple-600 text-center">
                      Preview: The Arena
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['#1', '#2', '#3', '#4', '#5', '#6'].map((num, i) => (
                        <div key={num} className={`p-2 rounded-xl border text-center ${i === 1 ? 'bg-orange-50 border-orange-400' : 'bg-white border-purple-200'}`}>
                          <div className="text-[9px] font-mono font-bold text-purple-500">{num}</div>
                          <div className="text-lg">{['🏹', '🔥', '🛡️', '🌲', '⚡', '🎯'][i]}</div>
                          <div className="text-[8px] font-bold text-emerald-600">READY</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: WHAT "WINNING" MEANS */}
            {slideIndex === 2 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    Briefing 2 of 6 • How You Win
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    What Does &ldquo;Winning&rdquo; Mean?
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <Shield className="w-7 h-7 text-emerald-600" />
                    <h3 className="text-sm font-black font-cinzel text-purple-950">Nobody Gets Kicked Out</h3>
                    <p className="text-xs text-purple-800 leading-relaxed">
                      If you &ldquo;fall&rdquo; in a round, you are <strong>not eliminated</strong> — you simply lose points and keep playing every phase!
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                    <Sparkles className="w-7 h-7 text-purple-700" />
                    <h3 className="text-sm font-black font-cinzel text-purple-950">Your Score Stays Yours</h3>
                    <p className="text-xs text-purple-800 leading-relaxed">
                      Throughout the game, only you see your own score — keeping the suspense alive until the very end.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 space-y-2">
                    <Trophy className="w-7 h-7 text-orange-600" />
                    <h3 className="text-sm font-black font-cinzel text-purple-950">Grand Finale Victor</h3>
                    <p className="text-xs text-purple-800 leading-relaxed">
                      After all 5 phases, the final leaderboard unlocks and the tribute with the highest total score is crowned <strong>Victor</strong>!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 3: HOW THIS PRESENTATION / GAME FLOWS */}
            {slideIndex === 3 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    Briefing 3 of 6 • Session Flow
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    How Each Round Works
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { step: '1', icon: '🏟️', title: 'Arena / The Woods', desc: 'Everyone gathers on their pedestal or in The Woods.' },
                    { step: '2', icon: '👑', title: 'Gamemaker Starts', desc: 'The Gamemaker launches the next surprise phase.' },
                    { step: '3', icon: '⚡', title: 'Play & Decide', desc: 'Make your choice privately before the timer hits 0.' },
                    { step: '4', icon: '📊', title: 'See Results', desc: 'View anonymous room stats and your personal outcome.' },
                    { step: '5', icon: '📚', title: 'Psychology Takeaway', desc: 'Game pauses for a short research insight.' },
                    { step: '6', icon: '🌲', title: 'Back to The Woods', desc: 'Return to The Woods and get ready for the next phase!' }
                  ].map((item) => (
                    <div key={item.step} className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                          {item.step}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-black font-cinzel text-purple-950">{item.title}</div>
                      <p className="text-[11px] text-purple-700 leading-snug">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 4: 5 PHASES & 5 PAPERS + VISUAL PREVIEW OF PLAYING VS LEARNING */}
            {slideIndex === 4 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-5">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    Briefing 4 of 6 • 5 Phases &amp; 5 Papers
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    5 Surprise Phases • 5 Psychology Papers
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-700">
                    Each phase is a surprise until it begins — followed by a short psychology break. Here&apos;s how to tell the two screens apart:
                  </p>
                </div>

                {/* Side-by-Side Visual Page Mockups */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mockup A: Playing Screen */}
                  <div className="rounded-2xl border-2 border-orange-400 bg-[#FAF5FF] p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase font-mono">
                        Playing Screen
                      </span>
                      <span className="text-[11px] font-mono font-black text-orange-600">⏱ 24s</span>
                    </div>
                    <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-purple-700 to-orange-500 rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Option A', 'Option B', 'Option C'].map((opt) => (
                        <div key={opt} className="p-2 rounded-xl bg-white border border-purple-200 text-center text-[10px] font-bold text-purple-900">
                          {opt}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-purple-800 font-medium">
                      <strong>Purple &amp; Orange + Timer:</strong> You are actively playing and making decisions!
                    </p>
                  </div>

                  {/* Mockup B: Learning / Takeaway Screen */}
                  <div className="rounded-2xl border-2 border-teal-500 bg-slate-100 p-4 space-y-3 shadow-sm">
                    <div className="rounded-lg bg-slate-900 text-teal-300 px-2.5 py-1 text-[10px] font-mono font-bold flex items-center gap-1.5">
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>GAME PAUSED • PSYCHOLOGY TAKEAWAY</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-teal-200 space-y-1">
                      <div className="text-[10px] font-bold text-teal-700 uppercase font-mono">Featured Research Paper</div>
                      <div className="h-2 w-3/4 bg-slate-200 rounded" />
                      <div className="h-2 w-1/2 bg-slate-100 rounded" />
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">
                      <strong>Slate &amp; Teal Banner:</strong> Game is paused — sit back and learn the psychology!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 5: EVERY SECOND COUNTS (SPEED VS THINKING TIME) */}
            {slideIndex === 5 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    Briefing 5 of 6 • Time Pressure
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    Every Second Counts
                  </h2>
                </div>

                {/* Visual Countdown Mockup */}
                <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-2.5 max-w-xl mx-auto">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-800">
                    <span className="inline-flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-orange-600" />
                      LIVE COUNTDOWN
                    </span>
                    <span className="text-xl font-black text-orange-600">07s</span>
                  </div>
                  <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-purple-200">
                    <div className="h-full w-1/4 bg-orange-500 rounded-full" />
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px] font-mono font-bold">
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">0–5s: +3 pts</div>
                    <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800">6–10s: +2 pts</div>
                    <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">11–20s: +1 pt</div>
                    <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">Last 5s: Danger!</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-purple-800">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <strong className="text-emerald-900 block mb-1">⚡ Act Fast = Bonus Points</strong>
                    Locking in quickly can earn speed bonus points — but gives you less time to think through the consequences.
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                    <strong className="text-rose-900 block mb-1">⏳ Hesitate Too Long = Higher Risk</strong>
                    Waiting until the final seconds (or letting the timer run out) can dramatically increase your risk or cost you points.
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 6: RISK VS REWARD (SAFEST ISN'T ALWAYS BEST) */}
            {slideIndex === 6 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    Briefing 6 of 6 • Strategy
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    The Safest Option Isn&apos;t Always the Best
                  </h2>
                </div>

                {/* Visual Risk vs Reward Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black font-mono uppercase text-purple-700">
                      <Shield className="w-4 h-4" />
                      Playing It Safe
                    </div>
                    <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
                      Cautious choices protect you from big losses — but usually earn fewer points and fewer advantages for later rounds.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-orange-50 border-2 border-orange-300 space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black font-mono uppercase text-orange-700">
                      <Flame className="w-4 h-4" />
                      Taking Calculated Risks
                    </div>
                    <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
                      Bolder choices carry a higher chance of taking a hit — but come with <strong>higher rewards</strong> and potential advantages later in the Games!
                    </p>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <p className="text-sm font-black font-cinzel text-purple-950">
                    Ready to step onto your pedestal? May the odds be ever in your favor.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Arrow (Gamemaker only) */}
          {isGamemaker && (
            <button
              type="button"
              disabled={slideIndex >= TOTAL_SLIDES - 1}
              onClick={() => handleSlideChange(slideIndex + 1)}
              className="p-2.5 sm:p-3 rounded-2xl bg-white border-2 border-purple-200 text-purple-900 hover:border-orange-400 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all shrink-0"
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </main>

      {/* ================= FOOTER + GAMEMAKER "LET THE GAMES BEGIN" BOTTOM-RIGHT BUTTON ================= */}
      <footer className="relative z-20 border-t border-purple-200 bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <p className="text-xs font-black text-purple-900 font-cinzel tracking-widest uppercase">
          MAY THE ODDS BE IN YOUR FAVOR
        </p>

        {isGamemaker ? (
          <button
            type="button"
            onClick={onBeginGames}
            className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all ${
              slideIndex === TOTAL_SLIDES - 1 ? 'ring-4 ring-orange-300 animate-pulse' : ''
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Let the Games Begin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-[11px] font-mono-capitol text-purple-500">
            Waiting for Gamemaker...
          </span>
        )}
      </footer>

      {/* ================= GAMEMAKER SIGN-IN MODAL ================= */}
      {showGmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-sm">
          <form onSubmit={handleGmSubmit} className="relative w-full max-w-sm bg-white rounded-3xl border-2 border-purple-200 p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setShowGmModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-50 text-purple-700 hover:text-purple-950"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="text-2xl">👑</div>
              <h3 className="text-lg font-black font-cinzel text-purple-950">Gamemaker Sign In</h3>
              <p className="text-xs text-purple-600">Sign in to pick your avatar and control the presentation.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-purple-900 mb-1 font-mono-capitol">
                  Your Name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={gmName}
                  onChange={(e) => setGmName(e.target.value)}
                  placeholder="e.g. Peeta, Katniss..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50 border-2 border-purple-200 focus:border-orange-500 focus:bg-white text-sm font-semibold outline-none"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-wider text-purple-900 mb-1 font-mono-capitol">
                  <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                  Gamemaker Access Key
                </label>
                <input
                  type="password"
                  value={gmKey}
                  onChange={(e) => { setGmKey(e.target.value); setGmError(''); }}
                  placeholder="Enter secret host key..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50 border-2 border-purple-200 focus:border-orange-500 focus:bg-white text-sm font-mono font-semibold outline-none"
                  required
                />
                {gmError && <p className="text-xs text-rose-600 font-bold mt-1">{gmError}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-800 to-orange-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-md"
            >
              Continue to Avatar Selection →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

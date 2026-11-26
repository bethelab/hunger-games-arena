import React, { useState, useEffect } from 'react';
import AvatarRenderer from './AvatarRenderer';
import { AVATAR_PRESETS } from '../data/hungerGamesData';
import { syncService } from '../services/syncService';
import { sound } from './SoundEffects';
import {
  ChevronLeft, ChevronRight, Play, KeyRound, X, BookOpen,
  Timer, Shield, Trophy, Sparkles, PauseCircle, Flame, ArrowRight, XCircle
} from 'lucide-react';

const TOTAL_SLIDES = 8; // 0 = Home Title, 1..6 = Instruction Slides, 7 = Final "May the odds..." + Let the Games Begin

export default function HomePresentation({ tributeData, game, onGamemakerAuth, onBeginGames }) {
  const [showGmModal, setShowGmModal] = useState(false);
  const [gmName, setGmName] = useState(tributeData?.realName || '');
  const [gmKey, setGmKey] = useState('');
  const [gmError, setGmError] = useState('');

  const isGamemaker = tributeData?.role === 'gamemaker' && Boolean(tributeData?.gamemakerAuthed);
  const gamemakerTaken = Boolean(game?.gamemakerId && game.gamemakerId !== tributeData?.id);
  const slideIndex = game?.slideIndex ?? 0;

  useEffect(() => {
    document.title = 'Would You Survive the 15th Hunger Games?';
  }, []);

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

  const slideLabel =
    slideIndex === 0
      ? 'Home'
      : slideIndex === TOTAL_SLIDES - 1
      ? 'Ready'
      : `${slideIndex} / 6`;

  return (
    <div className="min-h-screen bg-[#16062A] text-purple-950 flex flex-col justify-between relative overflow-x-hidden">
      {/* Top accent stripe */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-700 via-orange-500 to-purple-700" />

      {/* ================= TOP HEADER BAR: TRIBUTE / GAMEMAKER ================= */}
      <header className="relative z-20 border-b border-purple-900/70 bg-[#100420]/95 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {isGamemaker ? (
          <div className="flex items-center gap-2.5">
            <div className="relative rounded-full p-0.5 border-2 border-orange-400 bg-purple-900">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <AvatarRenderer avatar={tributeData?.avatar} districtId={tributeData?.districtId || 1} size="sm" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] shadow">
                👑
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black font-cinzel text-white">{tributeData?.realName}</span>
                <span className="text-[9px] font-mono-capitol font-bold px-1.5 py-0.5 rounded-full uppercase bg-orange-500/20 text-orange-200 border border-orange-400/40">
                  Gamemaker
                </span>
              </div>
              <p className="text-[10px] text-purple-300 font-mono-capitol hidden sm:block">
                Use ← / → arrows to present slides
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 p-1 bg-purple-900/80 rounded-xl border border-purple-700">
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
                  : 'text-purple-100 hover:bg-purple-800'
              }`}
              title={gamemakerTaken ? 'A Gamemaker is already active' : 'Sign in as the Gamemaker'}
            >
              <span>👑</span>
              <span>{gamemakerTaken ? 'Gamemaker (Active)' : 'Gamemaker'}</span>
            </button>
          </div>
        )}

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
                    : 'w-2 bg-purple-700 hover:bg-purple-500'
                } ${isGamemaker ? 'cursor-pointer' : 'cursor-default'}`}
              />
            ))}
          </div>

          <span className="text-[11px] font-mono-capitol font-bold text-orange-200 bg-purple-900 border border-purple-700 px-2.5 py-1 rounded-lg">
            {slideLabel}
          </span>

          {isGamemaker && (
            <button
              type="button"
              onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/notes`, 'panem_presenter_notes', 'width=980,height=720')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-800 hover:bg-purple-700 border border-purple-600 text-white text-xs font-bold shadow-sm transition-all"
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
              className="p-2.5 sm:p-3 rounded-2xl bg-purple-900 border-2 border-purple-700 text-white hover:border-orange-400 hover:text-orange-300 disabled:opacity-25 disabled:cursor-not-allowed shadow-sm transition-all shrink-0"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Active Slide Card */}
          <div className="flex-1">
            {/* SLIDE 0: HOME TITLE PAGE (Clean title & subtitle only) */}
            {slideIndex === 0 && (
              <div className="rounded-3xl bg-gradient-to-br from-[#240A42] via-[#1B0733] to-[#120424] text-white p-10 sm:p-16 shadow-2xl border-2 border-orange-500/50 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs font-bold font-mono-capitol uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                  Interactive Share &amp; Learn
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-black font-cinzel tracking-wide leading-tight">
                    Would{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 drop-shadow-[0_0_20px_rgba(249,115,22,0.55)]">
                      YOU
                    </span>{' '}
                    Survive the 15th Hunger Games?
                  </h1>
                  <p className="text-base sm:text-xl text-orange-200 font-medium max-w-2xl mx-auto">
                    The Psychology Behind Our Decisions Under Pressure
                  </p>
                </div>

                {!isGamemaker && (
                  <div className="pt-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/70 border border-purple-700 text-xs font-mono-capitol text-purple-200">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                      Waiting for the Gamemaker to begin...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* SLIDE 1: OVERVIEW */}
            {slideIndex === 1 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    1 / 6 • Overview
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    Welcome to the Arena
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-7 space-y-3 text-sm sm:text-base text-purple-800 leading-relaxed">
                    <p>
                      In <strong>The Hunger Games</strong>, tributes enter an unpredictable arena with limited time, incomplete information, and tough choices.
                    </p>
                    <p>
                      Today, <strong>up to 15 players</strong> will step into the arena facing high-pressure scenarios inspired by the book and movie. Real psychology research on how humans think, trust, and react related to each scenario will then be presented.
                    </p>
                  </div>

                  {/* Mini Visual Preview of the Arena Pedestal Grid */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-2.5">
                    <div className="text-[10px] font-mono-capitol font-bold uppercase text-purple-600 text-center">
                      Preview: Player Pedestals
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {AVATAR_PRESETS.slice(0, 6).map((preset, i) => (
                        <div key={preset.id} className={`p-2 rounded-xl border text-center flex flex-col items-center gap-0.5 ${i === 1 ? 'bg-orange-50 border-orange-400' : 'bg-white border-purple-200'}`}>
                          <div className="text-[9px] font-mono font-bold text-purple-500">#{i + 1}</div>
                          <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                            <AvatarRenderer avatar={preset.avatar} districtId={i + 1} size="sm" />
                          </div>
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
                    2 / 6 • How You Win
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    What Does &ldquo;Winning&rdquo; Mean?
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Red card with fail/X icon */}
                  <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-2">
                    <XCircle className="w-7 h-7 text-rose-600" />
                    <h3 className="text-sm font-black font-cinzel text-rose-950">You Can Die, Not Quit</h3>
                    <p className="text-xs text-rose-900 leading-relaxed">
                      You can get killed in a round, but nobody gets kicked out. You lose points and keep playing every phase.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                    <Sparkles className="w-7 h-7 text-purple-700" />
                    <h3 className="text-sm font-black font-cinzel text-purple-950">Your Score Stays Yours</h3>
                    <p className="text-xs text-purple-800 leading-relaxed">
                      Throughout the game, only you see your own score.
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

            {/* SLIDE 3: HOW EACH ROUND WORKS */}
            {slideIndex === 3 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    3 / 6 • Session Flow
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    How Each Round Works
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { step: '1', icon: '🏟️', title: 'Arena / The Woods', desc: 'Everyone gathers on their pedestal or in The Woods.', isTakeaway: false },
                    { step: '2', icon: '👑', title: 'Gamemaker Starts', desc: 'The Gamemaker launches the next phase.', isTakeaway: false },
                    { step: '3', icon: '⚡', title: 'Play & Decide', desc: 'Make your choice privately before the timer hits 0.', isTakeaway: false },
                    { step: '4', icon: '📊', title: 'See Results', desc: 'View anonymous room stats and your personal outcome.', isTakeaway: false },
                    { step: '5', icon: '📚', title: 'Psychology Takeaway', desc: 'Game pauses for a short research insight.', isTakeaway: true },
                    { step: '6', icon: '🌲', title: 'Back to The Woods', desc: 'Return to The Woods and get ready for the next phase.', isTakeaway: false }
                  ].map((item) => (
                    <div
                      key={item.step}
                      className={`p-4 rounded-2xl border space-y-1.5 ${
                        item.isTakeaway
                          ? 'bg-[#FFF7ED] border-2 border-orange-300 shadow-sm'
                          : 'bg-purple-50/60 border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        <span className={`w-6 h-6 rounded-full text-white text-[10px] font-mono font-bold flex items-center justify-center ${
                          item.isTakeaway ? 'bg-orange-600' : 'bg-purple-900'
                        }`}>
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

            {/* SLIDE 4: 5 PHASES & 3 PAPERS (Unified Purple vs Warm Orange Preview) */}
            {slideIndex === 4 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-5">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    4 / 6 • 5 Phases &amp; 3 Papers
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    5 Phases • 3 Psychology Papers
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-700">
                    Each phase is revealed as we go, followed by a short psychology takeaway.
                  </p>
                </div>

                {/* Side-by-Side Visual Preview: Purple Play Screen vs Warm Orange Takeaway Screen */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border-2 border-purple-300 bg-[#FAF5FF] p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-800 text-white text-[10px] font-bold uppercase font-mono">
                        Playing Screen
                      </span>
                      <span className="text-[11px] font-mono font-black text-purple-800">⏱ 24s</span>
                    </div>
                    <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-purple-700 rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Option A', 'Option B', 'Option C'].map((opt) => (
                        <div key={opt} className="p-2 rounded-xl bg-white border border-purple-200 text-center text-[10px] font-bold text-purple-900">
                          {opt}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-purple-800 font-medium">
                      <strong>Purple tone + Countdown:</strong> Active round where you make your decision.
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-orange-300 bg-[#FFF7ED] p-4 space-y-3 shadow-sm">
                    <div className="rounded-lg bg-purple-950 text-orange-300 px-2.5 py-1 text-[10px] font-mono font-bold flex items-center gap-1.5">
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>GAME PAUSED • PSYCHOLOGY TAKEAWAY</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-orange-200 space-y-1">
                      <div className="text-[10px] font-bold text-orange-700 uppercase font-mono">Featured Research</div>
                      <div className="h-2 w-3/4 bg-orange-100 rounded" />
                      <div className="h-2 w-1/2 bg-purple-100 rounded" />
                    </div>
                    <p className="text-[11px] text-purple-900 font-medium">
                      <strong>Warm orange tone:</strong> Game paused for a short psychology takeaway.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 5: EVERY SECOND COUNTS + -2 TIMEOUT DEATH RULE */}
            {slideIndex === 5 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    5 / 6 • Time Pressure
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    Every Second Counts
                  </h2>
                </div>

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
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">0-5s: +3 pts</div>
                    <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800">6-10s: +2 pts</div>
                    <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">11-20s: +1 pt</div>
                    <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">Timeout: -2 pts</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-purple-800">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <strong className="text-emerald-900 block mb-1">⚡ Act Fast for Bonus Points</strong>
                    Choosing faster can earn extra speed bonus points, but leaves you less time to think.
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                    <strong className="text-rose-900 block mb-1">⏳ Don&apos;t Let the Timer Run Out</strong>
                    If the timer runs out and you do not respond, you automatically die and lose <strong>-2 points</strong>.
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 6: RISK VS REWARD */}
            {slideIndex === 6 && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold font-mono-capitol uppercase">
                    6 / 6 • Strategy
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
                    The Safest Option Isn&apos;t Always the Best
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black font-mono uppercase text-purple-700">
                      <Shield className="w-4 h-4" />
                      Playing It Safe
                    </div>
                    <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
                      Cautious choices protect you from big losses, but usually earn fewer points and fewer advantages later.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-orange-50 border-2 border-orange-300 space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black font-mono uppercase text-orange-700">
                      <Flame className="w-4 h-4" />
                      Taking Calculated Risks
                    </div>
                    <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
                      Bolder choices carry a higher chance of dying, but offer <strong>higher rewards</strong> and potential advantages later in the Games.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 7: FINAL SLIDE — MAY THE ODDS BE EVER IN YOUR FAVOR + LET THE GAMES BEGIN */}
            {slideIndex === 7 && (
              <div className="rounded-3xl bg-gradient-to-br from-[#240A42] via-[#1B0733] to-[#7C2D12] text-white p-10 sm:p-16 shadow-2xl border-2 border-orange-400 text-center space-y-6">
                <div className="text-4xl">🏹</div>
                <h2 className="text-3xl sm:text-5xl font-black font-cinzel tracking-wide leading-tight text-orange-200">
                  May the Odds Be Ever in Your Favor
                </h2>
                <p className="text-sm sm:text-base text-purple-100 max-w-lg mx-auto">
                  Step forward, draw your district, and enter the arena.
                </p>

                {isGamemaker ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onBeginGames}
                      className="px-9 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black text-base uppercase tracking-wider shadow-2xl ring-4 ring-orange-300/40 inline-flex items-center gap-2.5 transition-all"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>Let the Games Begin</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/60 border border-purple-600 text-xs font-mono-capitol text-purple-100">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                      Waiting for the Gamemaker to launch the Games...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Arrow (Gamemaker only) */}
          {isGamemaker && (
            <button
              type="button"
              disabled={slideIndex >= TOTAL_SLIDES - 1}
              onClick={() => handleSlideChange(slideIndex + 1)}
              className="p-2.5 sm:p-3 rounded-2xl bg-purple-900 border-2 border-purple-700 text-white hover:border-orange-400 hover:text-orange-300 disabled:opacity-25 disabled:cursor-not-allowed shadow-sm transition-all shrink-0"
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </main>

      {/* ================= CLEAN FOOTER (No "May the odds" here; Gamemaker shortcut in bottom-right) ================= */}
      <footer className="relative z-20 border-t border-purple-900/70 bg-[#100420]/95 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono-capitol text-purple-300">
          {slideIndex === 0 ? 'Welcome' : slideIndex === 7 ? 'Ready to Begin' : `Instructions ${slideIndex} of 6`}
        </span>

        {isGamemaker && slideIndex < TOTAL_SLIDES - 1 && (
          <button
            type="button"
            onClick={onBeginGames}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-purple-700 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Let the Games Begin</span>
          </button>
        )}
      </footer>

      {/* ================= GAMEMAKER SIGN-IN MODAL ================= */}
      {showGmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/80 backdrop-blur-sm">
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

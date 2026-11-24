import React from 'react';
import Countdown from './Countdown';
import { CheckCircle2, Lock, BarChart3, ArrowRight } from 'lucide-react';

// Intentionally NO High/Medium/Low risk labels or percentages shown before voting
const STRATEGY_CARDS = [
  {
    id: 'cornucopia',
    icon: '⚔️',
    title: 'Rush to the Cornucopia',
    description: 'Sprint straight into the center for the best supplies.'
  },
  {
    id: 'outskirts',
    icon: '🎒',
    title: 'Grab Supplies from the Outskirts',
    description: 'Stay near the edge and scoop up moderate supplies.'
  },
  {
    id: 'woods',
    icon: '🌲',
    title: 'Run into the Woods',
    description: 'Skip the supplies and head straight for cover.'
  }
];

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function CornucopiaChoice({
  isGamemaker,
  countdown,
  duration,
  myChoice,
  poll,
  onSelectStrategy,
  onCloseVoting
}) {
  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      {/* Live Countdown */}
      <Countdown countdown={countdown} duration={duration} />

      {isGamemaker ? (
        /* ================= GAMEMAKER SHARED SCREEN: LIVE ANONYMOUS POLL ================= */
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono-capitol uppercase text-orange-600">
                <BarChart3 className="w-4 h-4" />
                Live Anonymous Poll
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-cinzel text-purple-950">
                Tributes Are Choosing...
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol">
              {totalVoted} / {totalTributes} Voted
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { id: 'cornucopia', icon: '⚔️', label: 'rushed to the Cornucopia.', count: poll?.cornucopia || 0, color: 'bg-orange-500' },
              { id: 'outskirts', icon: '🎒', label: 'grabbed supplies from the outskirts.', count: poll?.outskirts || 0, color: 'bg-purple-600' },
              { id: 'woods', icon: '🌲', label: 'ran into the woods.', count: poll?.woods || 0, color: 'bg-purple-900' }
            ].map((item) => {
              const pct = getPct(item.count, totalVoted);
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-bold text-purple-950">
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>
                        <span className="font-mono text-orange-600">{pct}%</span> {item.label}
                      </span>
                    </span>
                    <span className="text-xs font-mono-capitol text-purple-500">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-purple-100 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-purple-500 font-mono-capitol">
              Individual choices stay hidden here. Open Tribute Roster to view privately.
            </p>
            <button
              onClick={onCloseVoting}
              className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              Close Voting & Show Poll
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ================= TRIBUTE VIEW: 3 PRIVATE STRATEGY CARDS ================= */
        <div className="w-full max-w-3xl space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
              Make Your Move
            </h2>
            <p className="text-xs sm:text-sm text-purple-700 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              Your choice is private — other tributes cannot see what you pick.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STRATEGY_CARDS.map((card) => {
              const isSelected = myChoice?.strategy === card.id;
              const isLockedOther = myChoice && !isSelected;

              return (
                <button
                  key={card.id}
                  disabled={Boolean(myChoice)}
                  onClick={() => onSelectStrategy(card.id)}
                  className={`text-left p-5 rounded-3xl border-2 transition-all flex flex-col justify-between min-h-[180px] ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 shadow-lg ring-4 ring-orange-300/40'
                      : isLockedOther
                      ? 'bg-purple-50/40 border-purple-100 opacity-45 cursor-not-allowed'
                      : 'bg-white border-purple-200 hover:border-orange-400 hover:shadow-md active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl">{card.icon}</span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase font-mono-capitol">
                        <CheckCircle2 className="w-3 h-3" />
                        Locked In
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black font-cinzel text-purple-950">
                      {card.title}
                    </h3>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {myChoice && (
            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Decision locked in ({myChoice.responseTime}s) — Waiting for countdown to finish...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

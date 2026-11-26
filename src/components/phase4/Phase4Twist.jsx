import React from 'react';
import Countdown from '../phase1/Countdown';
import { Zap, CheckCircle2, BarChart3, ArrowRight, Lock } from 'lucide-react';

// Intentionally NO points or probabilities shown before voting
const FEAST_CARDS = [
  {
    id: 'skip',
    letter: 'A',
    icon: '🌲',
    title: 'Skip the Feast',
    description: 'Stay hidden deep in the woods and avoid the open clearing completely.'
  },
  {
    id: 'scout',
    letter: 'B',
    icon: '👀',
    title: 'Scout the tree line',
    description: 'Creep to the edge of the trees to watch who shows up before risking anything.'
  },
  {
    id: 'grab',
    letter: 'C',
    icon: '⚡',
    title: 'Grab only your pack & sprint cross-angle',
    description: 'Cut in sharply from the side, snatch your crucial pack, and bolt back to cover.'
  }
];

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase4Twist({
  isGamemaker,
  countdown,
  duration,
  myFeastChoice,
  poll,
  onSubmitFeast,
  onRevealOutcomes
}) {
  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      <Countdown countdown={countdown} duration={duration || 25} />

      {/* The Feast Banner */}
      <div className="w-full max-w-3xl rounded-3xl bg-purple-950 text-white p-5 sm:p-6 shadow-xl border-2 border-orange-500 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black font-mono-capitol uppercase tracking-widest">
          <Zap className="w-3 h-3" />
          Gamemaker Trap • Event 2 of 2
        </div>
        <h2 className="text-xl sm:text-2xl font-black font-cinzel tracking-wide text-orange-300">
          🍖 THE FEAST AT DAWN
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-xl mx-auto leading-relaxed">
          The Gamemakers announce that each tribute&apos;s most desperately needed item (medicine, water, warmth) is waiting in an open clearing at dawn — baiting exhausted rivals into a guaranteed bloodbath.
        </p>
      </div>

      {isGamemaker ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono-capitol uppercase text-orange-600">
                <BarChart3 className="w-4 h-4" />
                The Feast • Live Anonymous Poll
              </div>
              <h3 className="text-xl font-black font-cinzel text-purple-950">
                Who Takes the Bait?
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol">
              {totalVoted} / {totalTributes} Voted
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { id: 'skip', icon: '🌲', label: 'skipped the Feast.', count: poll?.skip || 0, color: 'bg-purple-900' },
              { id: 'scout', icon: '👀', label: 'scouted the tree line.', count: poll?.scout || 0, color: 'bg-purple-600' },
              { id: 'grab', icon: '⚡', label: 'sprinted in for their pack.', count: poll?.grab || 0, color: 'bg-orange-500' }
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
                    <span className="text-xs font-mono-capitol text-purple-500">{item.count}</span>
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

          <div className="pt-3 border-t border-purple-100 text-right">
            <button
              onClick={onRevealOutcomes}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              Reveal Outcomes
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEAST_CARDS.map((card) => {
              const isSelected = myFeastChoice === card.id;
              const isLockedOther = Boolean(myFeastChoice) && !isSelected;

              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={Boolean(myFeastChoice)}
                  onClick={() => onSubmitFeast(card.id)}
                  className={`text-left p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-3 min-h-[165px] ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 shadow-lg ring-4 ring-orange-300/40'
                      : isLockedOther
                      ? 'bg-purple-50/40 border-purple-100 opacity-45 cursor-not-allowed'
                      : 'bg-white border-purple-200 hover:border-orange-400 hover:shadow-md active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{card.icon}</span>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase font-mono-capitol">
                        <CheckCircle2 className="w-3 h-3" />
                        Locked In
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black font-mono-capitol">
                        Option {card.letter}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black font-cinzel text-purple-950">
                      {card.letter}. {card.title}
                    </h3>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {myFeastChoice && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Choice locked in — Waiting for outcomes...</span>
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

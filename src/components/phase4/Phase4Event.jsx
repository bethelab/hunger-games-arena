import React, { useState } from 'react';
import Countdown from '../phase1/Countdown';
import { Flame, CheckCircle2, BarChart3, Zap, Lock } from 'lucide-react';

// Intentionally NO points or probabilities shown before voting
const FIRE_CARDS = [
  {
    id: 'downhill',
    letter: 'A',
    icon: '⛰️',
    title: 'Move downhill',
    description: 'Head quickly for lower ground to get below the rising heat and thick smoke.'
  },
  {
    id: 'tree',
    letter: 'B',
    icon: '🌳',
    title: 'Climb a tree',
    description: 'Scale the nearest tall tree to get above the undergrowth and spot a way out.'
  },
  {
    id: 'ditch',
    letter: 'C',
    icon: '🎒',
    title: 'Ditch your gear',
    description: 'Drop your heavy pack immediately so you can outrun the advancing wall of flames.'
  }
];

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase4Event({
  isGamemaker,
  countdown,
  duration,
  myFireChoice,
  poll,
  onSubmitFire,
  onTriggerFeast
}) {
  const [feastSeconds, setFeastSeconds] = useState(25);
  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      <Countdown countdown={countdown} duration={duration} />

      <div className="w-full max-w-3xl rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-purple-900 text-white px-5 py-3.5 shadow-lg flex items-center justify-center gap-3 text-center">
        <Flame className="w-6 h-6 shrink-0 animate-pulse" />
        <div>
          <div className="text-[10px] font-mono-capitol font-bold uppercase tracking-widest text-orange-100">
            Arena Alert • Event 1 of 2
          </div>
          <div className="text-base sm:text-xl font-black font-cinzel tracking-wide">
            A WALL OF FIRE IS APPROACHING!
          </div>
        </div>
        <Flame className="w-6 h-6 shrink-0 animate-pulse hidden sm:block" />
      </div>

      {isGamemaker ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono-capitol uppercase text-orange-600">
                <BarChart3 className="w-4 h-4" />
                Fire Disaster • Live Anonymous Poll
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-cinzel text-purple-950">
                How Are Tributes Reacting?
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol">
              {totalVoted} / {totalTributes} Voted
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { id: 'downhill', icon: '⛰️', label: 'moved downhill.', count: poll?.downhill || 0, color: 'bg-purple-800' },
              { id: 'tree', icon: '🌳', label: 'climbed a tree.', count: poll?.tree || 0, color: 'bg-orange-500' },
              { id: 'ditch', icon: '🎒', label: 'ditched their gear.', count: poll?.ditch || 0, color: 'bg-purple-600' }
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

          <div className="pt-3 border-t border-purple-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-purple-700">
              <span>Feast timer:</span>
              <input
                type="number"
                min={10}
                max={180}
                value={feastSeconds}
                onChange={(e) => setFeastSeconds(Math.max(10, Math.min(180, parseInt(e.target.value, 10) || 25)))}
                className="w-14 px-1.5 py-1 rounded-lg border border-purple-300 text-center font-bold text-purple-950"
              />
              <span>s</span>
            </div>
            <button
              onClick={() => onTriggerFeast(feastSeconds)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              Next: Launch The Feast ({feastSeconds}s)
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-4">
          <p className="text-center text-xs font-bold font-mono-capitol text-rose-700">
            Decide before the timer hits 0 — freezing up costs -8 points!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FIRE_CARDS.map((card) => {
              const isSelected = myFireChoice === card.id;
              const isLockedOther = Boolean(myFireChoice) && !isSelected;

              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={Boolean(myFireChoice)}
                  onClick={() => onSubmitFire(card.id)}
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

          {myFireChoice && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Move locked in — Stay alert for Event 2...</span>
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

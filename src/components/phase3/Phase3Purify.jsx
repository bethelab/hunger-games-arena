import React from 'react';
import Countdown from '../phase1/Countdown';
import { CheckCircle2, Lock, BarChart3, ArrowRight } from 'lucide-react';

const LOCATION_CLUE = {
  puddle: { name: 'The nearby puddle', clue: 'The water in your container looks muddy and stagnant.' },
  pond: { name: 'The forest pond', clue: 'The water looks slightly cloudy with bits of leaves.' },
  stream: { name: 'The mountain stream', clue: 'The water looks cool and clear.' }
};

const ACTION_CARDS = [
  {
    id: 'drink',
    letter: 'A',
    title: 'Drink it immediately',
    description: 'Save time and energy. Take your chances with the water quality.',
    illustration: (
      <svg viewBox="0 0 120 64" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Canteen / bottle */}
        <rect x="46" y="16" width="28" height="38" rx="8" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2.2" />
        <rect x="53" y="10" width="14" height="6" rx="2" fill="#F97316" />
        <path d="M52 34 Q60 30 68 34 L68 48 Q60 50 52 48 Z" fill="#C4B5FD" />
      </svg>
    )
  },
  {
    id: 'purify',
    letter: 'B',
    title: 'Purify it first',
    description: 'Spend extra time and resources treating the water before drinking.',
    illustration: (
      <svg viewBox="0 0 120 64" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Campfire flame heating water pot */}
        <rect x="42" y="16" width="36" height="22" rx="5" fill="#EDE9FE" stroke="#5B21B6" strokeWidth="2" />
        <path d="M52 12 Q55 7 58 12" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M63 12 Q66 7 69 12" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M60 40 C52 48 54 56 60 56 C66 56 68 48 60 40 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
      </svg>
    )
  }
];

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase3Purify({
  isGamemaker,
  isInAlliance,
  countdown,
  duration,
  myLocation,
  myAction,
  poll,
  onSelectAction,
  onRevealOutcomes
}) {
  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;
  const locInfo = LOCATION_CLUE[myLocation] || LOCATION_CLUE.puddle;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      <Countdown countdown={countdown} duration={duration} />

      {isGamemaker ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono-capitol uppercase text-orange-600">
                <BarChart3 className="w-4 h-4" />
                Decision 2 • Live Anonymous Poll
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-cinzel text-purple-950">
                Drink Immediately or Purify First?
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol">
              {totalVoted} / {totalTributes} Voted
            </span>
          </div>

          <div className="space-y-4">
            {[
              { id: 'drink', icon: '🥤', label: 'drank it immediately.', count: poll?.drink || 0, color: 'bg-orange-500' },
              { id: 'purify', icon: '🔥', label: 'purified it first.', count: poll?.purify || 0, color: 'bg-purple-800' }
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
            <p className="text-[11px] text-purple-500 font-mono-capitol">
              When ready, reveal combined outcomes &amp; contamination results.
            </p>
            <button
              onClick={onRevealOutcomes}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              Reveal Outcomes
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold font-mono-capitol uppercase text-orange-600">
              Decision 2 of 2
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
              The Water Is Collected. What Now?
            </h2>
            <p className="text-xs sm:text-sm text-purple-800 bg-purple-50 border border-purple-200 inline-block px-3.5 py-1.5 rounded-full">
              <strong>{locInfo.name}:</strong> {locInfo.clue}
            </p>
            {isInAlliance && (
              <div>
                <p className="text-xs font-bold text-orange-800 bg-orange-50 border border-orange-300 inline-block px-3.5 py-1 rounded-full">
                  🤝 Coordinate with your alliance — picking differently costs -3 pts each!
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ACTION_CARDS.map((card) => {
              const isSelected = myAction === card.id;
              const isLockedOther = myAction && !isSelected;

              return (
                <button
                  key={card.id}
                  disabled={Boolean(myAction)}
                  onClick={() => onSelectAction(card.id)}
                  className={`text-left p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 shadow-lg ring-4 ring-orange-300/40'
                      : isLockedOther
                      ? 'bg-purple-50/40 border-purple-100 opacity-45 cursor-not-allowed'
                      : 'bg-white border-purple-200 hover:border-orange-400 hover:shadow-md active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black font-mono-capitol">
                      Option {card.letter}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase font-mono-capitol">
                        <CheckCircle2 className="w-3 h-3" />
                        Locked In
                      </span>
                    )}
                  </div>

                  <div className="bg-purple-50/60 rounded-2xl border border-purple-100 p-3 flex items-center justify-center">
                    {card.illustration}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black font-cinzel text-purple-950">
                      {card.letter}. {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-700 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {myAction && (
            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Choice locked in — Waiting for outcomes...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

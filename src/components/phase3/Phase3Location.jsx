import React from 'react';
import Countdown from '../phase1/Countdown';
import { CheckCircle2, Lock, BarChart3, ArrowRight } from 'lucide-react';

// Intentionally hides contamination levels before voting so the choice isn't obvious
const LOCATION_CARDS = [
  {
    id: 'puddle',
    letter: 'A',
    title: 'The nearby puddle',
    distance: '2 minutes away',
    effort: 'Low travel cost',
    details: 'Very convenient and right beside your hiding spot.',
    illustration: (
      <svg viewBox="0 0 120 64" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="42" rx="40" ry="12" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <ellipse cx="56" cy="41" rx="22" ry="6" fill="#DDD6FE" />
        <circle cx="42" cy="24" r="3" fill="#F97316" />
        <circle cx="76" cy="28" r="2.5" fill="#A78BFA" />
      </svg>
    )
  },
  {
    id: 'pond',
    letter: 'B',
    title: 'The forest pond',
    distance: '10 minutes away',
    effort: 'Moderate travel cost',
    details: 'Requires a short hike deeper into the woods.',
    illustration: (
      <svg viewBox="0 0 120 64" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 38 L26 16 L34 38 Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.5" />
        <path d="M86 38 L94 14 L102 38 Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.5" />
        <ellipse cx="60" cy="45" rx="44" ry="11" fill="#EDE9FE" stroke="#5B21B6" strokeWidth="2" />
        <path d="M36 45 Q48 40 60 45 T84 45" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'stream',
    letter: 'C',
    title: 'The mountain stream',
    distance: '25 minutes away',
    effort: 'High travel cost',
    details: 'A long uphill climb requiring the most effort.',
    illustration: (
      <svg viewBox="0 0 120 64" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 52 L48 14 L76 52 Z" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.8" />
        <path d="M56 52 L82 20 L108 52 Z" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="1.8" />
        <path d="M62 28 C54 36 68 42 56 54" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
];

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase3Location({
  isGamemaker,
  countdown,
  duration,
  myLocation,
  poll,
  onSelectLocation,
  onMoveToPurify
}) {
  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      <Countdown countdown={countdown} duration={duration} />

      {isGamemaker ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono-capitol uppercase text-orange-600">
                <BarChart3 className="w-4 h-4" />
                Decision 1 • Live Anonymous Poll
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-cinzel text-purple-950">
                Where Are Tributes Collecting Water?
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol">
              {totalVoted} / {totalTributes} Voted
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { id: 'puddle', icon: '💧', label: 'chose the nearby puddle (2 min).', count: poll?.puddle || 0, color: 'bg-orange-500' },
              { id: 'pond', icon: '🌿', label: 'chose the forest pond (10 min).', count: poll?.pond || 0, color: 'bg-purple-600' },
              { id: 'stream', icon: '⛰️', label: 'chose the mountain stream (25 min).', count: poll?.stream || 0, color: 'bg-purple-900' }
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
              Next step: Tributes decide whether to drink or purify.
            </p>
            <button
              onClick={onMoveToPurify}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              Next: Drink or Purify
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold font-mono-capitol uppercase text-orange-600">
              Decision 1 of 2
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
              Where Will You Collect Your Water?
            </h2>
            <p className="text-xs sm:text-sm text-purple-700 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              Your choice is private.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LOCATION_CARDS.map((card) => {
              const isSelected = myLocation === card.id;
              const isLockedOther = myLocation && !isSelected;

              return (
                <button
                  key={card.id}
                  disabled={Boolean(myLocation)}
                  onClick={() => onSelectLocation(card.id)}
                  className={`text-left p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 shadow-lg ring-4 ring-orange-300/40'
                      : isLockedOther
                      ? 'bg-purple-50/40 border-purple-100 opacity-45 cursor-not-allowed'
                      : 'bg-white border-purple-200 hover:border-orange-400 hover:shadow-md active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-black font-mono-capitol">
                      Location {card.letter}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase font-mono-capitol">
                        <CheckCircle2 className="w-3 h-3" />
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="bg-purple-50/60 rounded-2xl border border-purple-100 p-2.5 flex items-center justify-center">
                    {card.illustration}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black font-cinzel text-purple-950">
                      {card.title}
                    </h3>
                    <div className="text-xs font-bold font-mono-capitol text-orange-700">
                      {card.distance} • {card.effort}
                    </div>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      {card.details}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {myLocation && (
            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Water collected — Waiting for Decision 2...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

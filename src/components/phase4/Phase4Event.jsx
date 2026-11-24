import React, { useState } from 'react';
import Countdown from '../phase1/Countdown';
import { Flame, CheckCircle2, BarChart3, Zap, Lock } from 'lucide-react';

const EVENT_CARDS = [
  {
    id: 'stay',
    letter: 'A',
    icon: '🛡️',
    title: 'Stay where you are',
    description: "You know the area and don't want to risk travelling somewhere unfamiliar."
  },
  {
    id: 'river',
    letter: 'B',
    icon: '🌊',
    title: 'Run towards the river',
    description: 'You might escape the fire, but the route is unfamiliar.'
  },
  {
    id: 'alliance',
    letter: 'C',
    icon: '🤝',
    title: 'Find your alliance',
    description: 'Reunite with your partner before making a move. Strength in numbers, but it could cost valuable time.'
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
  myInitial,
  poll,
  onSubmitInitial,
  onTriggerTwist
}) {
  const [selectedMove, setSelectedMove] = useState(null);
  const [reason, setReason] = useState('');

  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;

  const handleLockIn = () => {
    if (!selectedMove || myInitial) return;
    onSubmitInitial(selectedMove, reason);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      <Countdown countdown={countdown} duration={duration} />

      {/* Dramatic Fire Alert Banner */}
      <div className="w-full max-w-3xl rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-purple-900 text-white px-5 py-3.5 shadow-lg flex items-center justify-center gap-3 text-center">
        <Flame className="w-6 h-6 shrink-0 animate-pulse" />
        <div>
          <div className="text-[10px] font-mono-capitol font-bold uppercase tracking-widest text-orange-100">
            Arena Alert
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
                Initial Response • Live Anonymous Poll
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
              { id: 'stay', icon: '🛡️', label: 'stayed where they are.', count: poll?.stay || 0, color: 'bg-purple-900' },
              { id: 'river', icon: '🌊', label: 'ran towards the river.', count: poll?.river || 0, color: 'bg-orange-500' },
              { id: 'alliance', icon: '🤝', label: 'went to find their alliance.', count: poll?.alliance || 0, color: 'bg-purple-600' }
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
              Triggering the twist randomly selects Fire, Weather, Alliance, or Resources!
            </p>
            <button
              onClick={onTriggerTwist}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              Trigger Random Twist (15s)
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EVENT_CARDS.map((card) => {
              const lockedMove = myInitial?.move;
              const isSelected = lockedMove ? lockedMove === card.id : selectedMove === card.id;
              const isLockedOther = Boolean(lockedMove) && lockedMove !== card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={Boolean(lockedMove)}
                  onClick={() => setSelectedMove(card.id)}
                  className={`text-left p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-3 min-h-[165px] ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 shadow-lg ring-4 ring-orange-300/40'
                      : isLockedOther
                      ? 'bg-purple-50/40 border-purple-100 opacity-45 cursor-not-allowed'
                      : 'bg-white border-purple-200 hover:border-orange-400 hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{card.icon}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black font-mono-capitol">
                      Option {card.letter}
                    </span>
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

          {!myInitial ? (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-purple-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-sm">
              <input
                type="text"
                maxLength={140}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Quick reason for your move (optional, +5 pts for a sensible reason)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                disabled={!selectedMove}
                onClick={handleLockIn}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all shrink-0"
              >
                Lock In Move
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Move locked in — Stay alert...</span>
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

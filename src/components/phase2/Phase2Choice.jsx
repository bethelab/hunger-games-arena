import React from 'react';
import Countdown from '../phase1/Countdown';
import { CheckCircle2, Lock, BarChart3, ArrowRight } from 'lucide-react';

const PHASE2_CARDS = [
  {
    id: 'alliance',
    letter: 'A',
    title: 'Form an alliance',
    bullets: [
      'Find another tribute.',
      'Discuss strategies and share information.',
      'Help protect each other in future rounds.',
      'But your partner could betray you.'
    ],
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Two tributes linked together */}
        <circle cx="42" cy="22" r="9" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" />
        <path d="M27 52 C27 37 57 37 57 52" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <circle cx="78" cy="22" r="9" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
        <path d="M63 52 C63 37 93 37 93 52" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
        <line x1="51" y1="22" x2="69" y2="22" stroke="#F97316" strokeWidth="2.5" strokeDasharray="3 2" />
      </svg>
    )
  },
  {
    id: 'solo',
    letter: 'B',
    title: 'Go solo',
    bullets: [
      'Rely entirely on yourself.',
      'Keep your resources and decisions independent.',
      'No risk of betrayal by an ally.',
      'But you have no one to help you.'
    ],
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lone tribute standing in the woods */}
        <path d="M22 52 L32 24 L42 52 Z" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1.5" />
        <path d="M78 52 L88 24 L98 52 Z" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1.5" />
        <circle cx="60" cy="22" r="9" fill="#DDD6FE" stroke="#4C1D95" strokeWidth="2.2" />
        <path d="M45 54 C45 38 75 38 75 54" fill="#F3E8FF" stroke="#4C1D95" strokeWidth="2.2" />
      </svg>
    )
  }
];

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase2Choice({
  isGamemaker,
  countdown,
  duration,
  myChoice,
  poll,
  onSelectChoice,
  onAssignAlliances
}) {
  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
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
                Alliance or Solo?
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol">
              {totalVoted} / {totalTributes} Voted
            </span>
          </div>

          <div className="space-y-4">
            {[
              { id: 'alliance', icon: '🤝', label: 'chose to form an alliance.', count: poll?.alliance || 0, color: 'bg-orange-500' },
              { id: 'solo', icon: '🌲', label: 'chose to go solo.', count: poll?.solo || 0, color: 'bg-purple-800' }
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
              Open Tribute Roster to see individual choices privately.
            </p>
            <button
              onClick={onAssignAlliances}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              Close Voting & Assign Alliances
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ================= TRIBUTE VIEW: 2 PRIVATE CHOICE CARDS ================= */
        <div className="w-full max-w-3xl space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
              Make Your Choice
            </h2>
            <p className="text-xs sm:text-sm text-purple-700 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              Your decision is private until alliances are assigned.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHASE2_CARDS.map((card) => {
              const isSelected = myChoice?.choice === card.id;
              const isLockedOther = myChoice && !isSelected;

              return (
                <button
                  key={card.id}
                  disabled={Boolean(myChoice)}
                  onClick={() => onSelectChoice(card.id)}
                  className={`text-left p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 shadow-lg ring-4 ring-orange-300/40'
                      : isLockedOther
                      ? 'bg-purple-50/40 border-purple-100 opacity-45 cursor-not-allowed'
                      : 'bg-white border-purple-200 hover:border-orange-400 hover:shadow-md active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black font-mono-capitol">
                        Option {card.letter}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase font-mono-capitol">
                          <CheckCircle2 className="w-3 h-3" />
                          Locked In
                        </span>
                      )}
                    </div>

                    <div className="bg-purple-50/60 rounded-2xl border border-purple-100 p-3 flex items-center justify-center">
                      {card.illustration}
                    </div>

                    <h3 className="text-lg font-black font-cinzel text-purple-950">
                      {card.letter}. {card.title}
                    </h3>

                    <ul className="space-y-1.5 text-xs sm:text-sm text-purple-800">
                      {card.bullets.map((line, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={idx === card.bullets.length - 1 ? 'text-orange-600 font-bold' : 'text-purple-400'}>•</span>
                          <span className={idx === card.bullets.length - 1 ? 'font-semibold text-orange-800' : ''}>
                            {line}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>

          {myChoice && (
            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Decision locked in — Waiting for alliances to be assigned...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

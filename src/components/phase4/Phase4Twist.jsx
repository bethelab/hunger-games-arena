import React, { useState } from 'react';
import Countdown from '../phase1/Countdown';
import { Zap, CheckCircle2, BarChart3, ArrowRight } from 'lucide-react';

const MOVE_LABELS = {
  stay: '🛡️ Stay where you are',
  river: '🌊 Run towards the river',
  alliance: '🤝 Find your alliance'
};

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase4Twist({
  isGamemaker,
  isInAlliance,
  countdown,
  duration,
  twist,
  myInitial,
  myRethink,
  poll,
  onSubmitRethink,
  onRevealOutcomes
}) {
  const [pickingNew, setPickingNew] = useState(false);

  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;
  const originalMove = myInitial?.move || 'stay';
  const availableMoves = isInAlliance ? ['stay', 'river', 'alliance'] : ['stay', 'river'];
  const alternativeMoves = availableMoves.filter(k => k !== originalMove);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      <Countdown countdown={countdown} duration={duration || 15} />

      <div className="w-full max-w-3xl rounded-3xl bg-purple-950 text-white p-5 sm:p-6 shadow-xl border-2 border-orange-500 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black font-mono-capitol uppercase tracking-widest">
          <Zap className="w-3 h-3" />
          Gamemaker Twist • {twist?.category || 'Arena'}
        </div>
        <h2 className="text-xl sm:text-2xl font-black font-cinzel tracking-wide text-orange-300">
          {twist?.icon || '🔥'} {twist?.headline || 'YOUR ESCAPE ROUTE IS BLOCKED!'}
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-xl mx-auto">
          {twist?.message || 'Your planned escape route is no longer available.'} You have 15 seconds to react!
        </p>
      </div>

      {isGamemaker ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono-capitol uppercase text-orange-600">
                <BarChart3 className="w-4 h-4" />
                Live Adaptation Poll
              </div>
              <h3 className="text-xl font-black font-cinzel text-purple-950">
                Stick or Change Plan?
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol">
              {totalVoted} / {totalTributes} Responded
            </span>
          </div>

          <div className="space-y-4">
            {[
              { id: 'stick', icon: '📌', label: 'stuck with their original plan.', count: poll?.stick || 0, color: 'bg-purple-800' },
              { id: 'change', icon: '🔄', label: 'changed their plan.', count: poll?.change || 0, color: 'bg-orange-500' }
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
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 shadow-md space-y-4">
          <div className="text-center text-xs font-mono-capitol text-purple-700">
            Your original plan: <strong className="text-purple-950">{MOVE_LABELS[originalMove]}</strong>
          </div>

          {!myRethink ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onSubmitRethink('stick', originalMove)}
                  className="p-4 rounded-2xl border-2 text-left transition-all bg-purple-50/40 border-purple-200 hover:border-orange-500 hover:bg-orange-50 active:scale-[0.98]"
                >
                  <div className="text-lg mb-1">📌</div>
                  <div className="text-sm font-black font-cinzel text-purple-950">Stick to original plan</div>
                  <div className="text-xs text-purple-700">Keep going despite the twist.</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (alternativeMoves.length === 1) {
                      onSubmitRethink('change', alternativeMoves[0]);
                    } else {
                      setPickingNew(true);
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    pickingNew
                      ? 'bg-orange-50 border-orange-500 shadow-md'
                      : 'bg-purple-50/40 border-purple-200 hover:border-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <div className="text-lg mb-1">🔄</div>
                  <div className="text-sm font-black font-cinzel text-purple-950">Change my plan</div>
                  <div className="text-xs text-purple-700">Pivot to a different move right now.</div>
                </button>
              </div>

              {pickingNew && alternativeMoves.length > 1 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold font-mono-capitol uppercase text-purple-700">
                    Pick your new move:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {alternativeMoves.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => onSubmitRethink('change', m)}
                        className="px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-900 hover:text-white text-purple-900 text-xs font-bold transition-all text-left"
                      >
                        {MOVE_LABELS[m]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Response locked in ({myRethink.action === 'change' ? 'Changed plan' : 'Stuck with original'}) — Waiting for outcomes...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

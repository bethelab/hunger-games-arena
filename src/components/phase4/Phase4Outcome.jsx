import React from 'react';
import AvatarRenderer from '../AvatarRenderer';
import { DISTRICTS } from '../../data/hungerGamesData';
import { Zap, ShieldCheck, ArrowRight, Lock, BarChart3 } from 'lucide-react';

const MOVE_LABELS = {
  stay: '🛡️ Stayed put',
  river: '🌊 Ran to river',
  alliance: '🤝 Sought alliance'
};

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase4Outcome({
  isGamemaker,
  currentTribute,
  tributes,
  twist,
  initialPoll,
  twistPoll,
  onShowLesson
}) {
  const myResult = !isGamemaker
    ? tributes.find(t => t.id === currentTribute?.id)
    : null;

  const total = Math.max(tributes.length, 1);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto space-y-6">
      <div className="text-center space-y-1">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
          Phase 4 Outcomes
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
          How the Arena Adapted
        </h2>
        {twist && (
          <p className="text-xs font-mono-capitol text-purple-600">
            Twist triggered: {twist.icon} <strong>{twist.category}</strong> — {twist.headline}
          </p>
        )}
      </div>

      {/* Private Personal Score & Breakdown Card (ONLY visible to the current tribute) */}
      {myResult && (
        <div className="p-4 sm:p-5 rounded-2xl border-2 bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <div className="text-sm sm:text-base font-black font-cinzel">
                  {myResult.p4TwistAction === 'change'
                    ? 'You pivoted under pressure!'
                    : myResult.p4TwistAction === 'stick'
                    ? 'You stood by your original plan!'
                    : 'You weathered the twist!'}
                </div>
                <div className="text-xs opacity-80 font-mono-capitol">
                  Initial: {MOVE_LABELS[myResult.p4InitialMove] || 'None'} • Final: {MOVE_LABELS[myResult.p4FinalMove] || 'None'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-[10px] font-mono-capitol uppercase opacity-75">
                <Lock className="w-3 h-3" />
                Your Private Score
              </div>
              <div className="text-2xl font-black font-mono text-emerald-700">
                +{myResult.p4RoundPoints ?? 0} pts
              </div>
              <div className="text-[11px] font-mono-capitol opacity-80">
                Total: <strong>{myResult.totalScore ?? 0} pts</strong>
              </div>
            </div>
          </div>

          {myResult.p4Breakdown && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200 text-[10px] font-mono-capitol">
              <div className="bg-white/70 rounded-lg px-2 py-1">Initial move: <strong>+{myResult.p4Breakdown.ptsInitial}</strong></div>
              <div className="bg-white/70 rounded-lg px-2 py-1">Sensible reason: <strong>+{myResult.p4Breakdown.ptsReason}</strong></div>
              <div className="bg-white/70 rounded-lg px-2 py-1">Twist response: <strong>+{myResult.p4Breakdown.ptsAdapt}</strong></div>
              <div className="bg-white/70 rounded-lg px-2 py-1">In countdown: <strong>+{myResult.p4Breakdown.ptsTimer}</strong></div>
            </div>
          )}
        </div>
      )}

      {/* Anonymous Arena Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-2.5">
          <h3 className="text-xs font-black font-mono-capitol uppercase text-purple-700 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-orange-600" />
            Initial Reaction
          </h3>
          {[
            { id: 'stay', label: '🛡️ Stayed put', count: initialPoll?.stay || 0 },
            { id: 'river', label: '🌊 Ran to river', count: initialPoll?.river || 0 },
            { id: 'alliance', label: '🤝 Sought alliance', count: initialPoll?.alliance || 0 }
          ].map((row) => (
            <div key={row.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="font-bold text-purple-950">{row.label}</span>
              <span className="font-mono font-black text-orange-600">{getPct(row.count, total)}% ({row.count})</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-black font-mono-capitol uppercase text-purple-700 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-orange-600" />
            Twist Response
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
              <div className="text-2xl font-black font-mono text-purple-900">
                {getPct(twistPoll?.stick || 0, total)}%
              </div>
              <div className="text-xs font-bold text-purple-800">Stuck With Plan</div>
            </div>
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200">
              <div className="text-2xl font-black font-mono text-orange-600">
                {getPct(twistPoll?.change || 0, total)}%
              </div>
              <div className="text-xs font-bold text-purple-900">Changed Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tribute Adaptations (NO other tributes' scores displayed) */}
      <div className="bg-white rounded-3xl border border-purple-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black font-cinzel text-purple-950 uppercase tracking-wider">
            Tribute Decisions
          </h3>
          <span className="text-[11px] font-mono-capitol text-purple-500 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Scores remain private
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {tributes.map((t) => {
            const dist = DISTRICTS.find(d => d.id === t.districtId) || DISTRICTS[0];
            const isMe = t.id === currentTribute?.id;
            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                  isMe ? 'bg-orange-50 border-orange-300' : 'bg-purple-50/40 border-purple-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white border border-purple-200 flex items-center justify-center">
                    <AvatarRenderer avatar={t.avatar} districtId={t.districtId} size="sm" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-purple-950 truncate flex items-center gap-1">
                      <span>{t.realName}</span>
                      {isMe && <span className="text-[9px] px-1 rounded bg-orange-200 text-orange-800">YOU</span>}
                    </div>
                    <div className="text-[10px] text-purple-600 font-mono-capitol truncate">
                      {MOVE_LABELS[t.p4FinalMove] || 'No move'} • {dist.name}
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-capitol uppercase shrink-0 ${
                  t.p4TwistAction === 'change'
                    ? 'bg-orange-100 text-orange-800'
                    : t.p4TwistAction === 'stick'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {t.p4TwistAction === 'change' ? 'Changed' : t.p4TwistAction === 'stick' ? 'Stuck' : 'Timed out'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isGamemaker ? (
        <div className="text-center pt-2">
          <button
            onClick={onShowLesson}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all"
          >
            Share Learning Slide
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center text-xs text-purple-500 font-mono-capitol">
          Waiting for Gamemaker to continue...
        </div>
      )}
    </div>
  );
}

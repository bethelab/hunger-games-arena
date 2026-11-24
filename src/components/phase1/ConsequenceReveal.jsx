import React from 'react';
import AvatarRenderer from '../AvatarRenderer';
import { DISTRICTS } from '../../data/hungerGamesData';
import { Skull, ShieldCheck, ArrowRight, Package, Lock } from 'lucide-react';

const STRATEGY_LABELS = {
  cornucopia: { name: 'Cornucopia', icon: '⚔️' },
  outskirts: { name: 'Outskirts', icon: '🎒' },
  woods: { name: 'Woods', icon: '🌲' }
};

export default function ConsequenceReveal({
  isGamemaker,
  currentTribute,
  tributes,
  poll,
  scaledRisks,
  onShowLesson
}) {
  const myResult = !isGamemaker
    ? tributes.find(t => t.id === currentTribute?.id)
    : null;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
          Phase 1 Outcomes
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
          Consequences Revealed
        </h2>
      </div>

      {/* Private Personal Outcome & Score Banner (Tribute only — nobody else sees your score) */}
      {myResult && (
        <div className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-4 shadow-sm ${
          myResult.survivalStatus === 'eliminated'
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}>
          <div className="flex items-center gap-3">
            {myResult.survivalStatus === 'eliminated' ? (
              <Skull className="w-8 h-8 text-rose-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            )}
            <div>
              <div className="text-sm sm:text-base font-black font-cinzel">
                {myResult.survivalStatus === 'eliminated'
                  ? 'You were eliminated in the Cornucopia!'
                  : 'You survived Phase 1!'}
              </div>
              <div className="text-xs opacity-80 font-mono-capitol">
                Supplies: {myResult.supplies} • Response: {myResult.responseTime}s
                {myResult.survivalStatus === 'eliminated' && ' • You remain in the game for future rounds.'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-[10px] font-mono-capitol uppercase opacity-75">
              <Lock className="w-3 h-3" />
              Your Private Score
            </div>
            <div className={`text-2xl font-black font-mono ${
              myResult.roundPoints >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {myResult.roundPoints >= 0 ? `+${myResult.roundPoints}` : myResult.roundPoints} pts
            </div>
            <div className="text-[11px] font-mono-capitol opacity-80">
              Total: <strong>{myResult.totalScore ?? 0} pts</strong>
              {myResult.survivalStatus !== 'eliminated' && myResult.speedBonus > 0
                ? ` (+${myResult.speedBonus} speed)`
                : ''}
            </div>
          </div>
        </div>
      )}

      {/* 1. Strategy Count & Scaled Risk Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { key: 'cornucopia', count: poll?.cornucopia || 0, risk: scaledRisks?.cornucopia ?? 0 },
          { key: 'outskirts', count: poll?.outskirts || 0, risk: scaledRisks?.outskirts ?? 0 },
          { key: 'woods', count: poll?.woods || 0, risk: 0 }
        ].map((item) => {
          const info = STRATEGY_LABELS[item.key];
          return (
            <div key={item.key} className="bg-white rounded-2xl border border-purple-200 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <div className="text-xs font-black font-cinzel text-purple-950">{info.name}</div>
                  <div className="text-[11px] text-purple-600 font-mono-capitol">
                    {item.count} {item.count === 1 ? 'tribute' : 'tributes'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black font-mono text-orange-600">{item.risk}%</div>
                <div className="text-[10px] text-purple-500 font-mono-capitol">actual risk</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Tribute Survival & Supplies (NO other tributes' scores shown) */}
      <div className="bg-white rounded-3xl border border-purple-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black font-cinzel text-purple-950 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-600" />
            Survival &amp; Supplies
          </h3>
          <span className="text-[11px] font-mono-capitol text-purple-500 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Scores remain private
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {tributes.map((t) => {
            const dist = DISTRICTS.find(d => d.id === t.districtId) || DISTRICTS[0];
            const strat = STRATEGY_LABELS[t.strategy] || STRATEGY_LABELS.woods;
            const isElim = t.survivalStatus === 'eliminated';
            const isMe = t.id === currentTribute?.id;

            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  isElim
                    ? 'bg-rose-50/70 border-rose-200'
                    : isMe
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-purple-50/40 border-purple-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white border border-purple-200 flex items-center justify-center">
                    <AvatarRenderer avatar={t.avatar} districtId={t.districtId} size="sm" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-purple-950 truncate flex items-center gap-1.5">
                      <span>{t.realName}</span>
                      {isMe && <span className="text-[9px] px-1 rounded bg-orange-200 text-orange-800">YOU</span>}
                    </div>
                    <div className="text-[10px] text-purple-600 font-mono-capitol truncate">
                      {strat.icon} {strat.name} • {t.supplies} • {dist.name}
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-capitol uppercase shrink-0 ${
                  isElim
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isElim ? 'Eliminated' : 'Alive'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamemaker Next Button */}
      {isGamemaker && (
        <div className="text-center pt-2">
          <button
            onClick={onShowLesson}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all"
          >
            Reveal the Lesson
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import AvatarRenderer from '../AvatarRenderer';
import { DISTRICTS } from '../../data/hungerGamesData';
import { Skull, ShieldCheck, ArrowRight, Package, Wrench, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showScoring, setShowScoring] = useState(false);

  const myResult = !isGamemaker
    ? tributes.find(t => t.id === currentTribute?.id)
    : null;

  const myDistrict = myResult
    ? (DISTRICTS.find(d => d.id === myResult.districtId) || DISTRICTS[0])
    : null;

  const myStrat = myResult
    ? (STRATEGY_LABELS[myResult.strategy] || STRATEGY_LABELS.woods)
    : null;

  // For players, bottom box lists the OTHER tributes; for Gamemaker, lists all tributes
  const listedTributes = isGamemaker
    ? tributes
    : tributes.filter(t => t.id !== currentTribute?.id);

  const strategyStats = [
    { key: 'cornucopia', count: poll?.cornucopia || 0, risk: scaledRisks?.cornucopia ?? 0 },
    { key: 'outskirts', count: poll?.outskirts || 0, risk: scaledRisks?.outskirts ?? 0 },
    { key: 'woods', count: poll?.woods || 0, risk: 0 }
  ];

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
          Phase 1 Outcomes
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
          Consequences Revealed
        </h2>
      </div>

      {/* ================= PLAYER VIEW: UNIFIED PERSONAL BOX ON TOP ================= */}
      {!isGamemaker && myResult && (
        <div className={`p-5 sm:p-6 rounded-3xl border-2 shadow-md space-y-4 ${
          myResult.survivalStatus === 'eliminated'
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-white shadow flex items-center justify-center shrink-0">
                <AvatarRenderer avatar={myResult.avatar} districtId={myResult.districtId} size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {myResult.survivalStatus === 'eliminated' ? (
                    <Skull className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <h3 className="text-base sm:text-lg font-black font-cinzel">
                    {myResult.survivalStatus === 'eliminated'
                      ? 'You fell in Phase 1 (-5 marks)'
                      : 'You survived Phase 1!'}
                  </h3>
                </div>
                <div className="text-xs opacity-85 font-mono-capitol mt-0.5">
                  {myStrat?.icon} {myStrat?.name} • {myDistrict?.name} • Response: {myResult.responseTime}s
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono-capitol uppercase opacity-75 font-bold">
                Your Score
              </div>
              <div className={`text-2xl font-black font-mono ${
                myResult.roundPoints >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {myResult.roundPoints >= 0 ? `+${myResult.roundPoints}` : myResult.roundPoints} pts
              </div>
              <div className="text-[11px] font-mono-capitol opacity-85">
                Total: <strong>{myResult.totalScore ?? 0} pts</strong>
                {myResult.survivalStatus !== 'eliminated' && myResult.speedBonus > 0
                  ? ` (+${myResult.speedBonus} speed)`
                  : ''}
              </div>
            </div>
          </div>

          {/* Your Survival & Supplies + Special Tool inside the same top box */}
          <div className="pt-3 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-white/80 border border-black/5">
              <div className="text-[10px] font-mono-capitol uppercase font-bold opacity-70">
                Your Supplies
              </div>
              <div className="text-sm font-black font-cinzel mt-0.5">
                {myResult.supplies}
              </div>
              {myResult.survivalStatus === 'eliminated' && (
                <div className="text-[11px] opacity-80 mt-0.5">
                  You are NOT eliminated — just -5 marks. You keep playing!
                </div>
              )}
            </div>

            {myResult.arenaTool ? (
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-300 text-purple-950">
                <div className="text-[10px] font-mono-capitol uppercase font-bold text-orange-700 flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  Special Tool Acquired
                </div>
                <div className="text-sm font-black font-cinzel mt-0.5">
                  {myResult.arenaTool.icon} {myResult.arenaTool.name}
                </div>
                <div className="text-[11px] text-purple-800 mt-0.5">
                  {myResult.arenaTool.effect}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-white/60 border border-black/5 flex flex-col justify-center">
                <div className="text-[10px] font-mono-capitol uppercase font-bold opacity-70">
                  Status
                </div>
                <div className="text-xs font-bold mt-0.5">
                  {myResult.survivalStatus === 'eliminated'
                    ? 'Fell (-5 marks) • Still playing next round'
                    : 'Alive and moving into The Woods'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= STRATEGY SUMMARY (COMPACT FOR PLAYERS, STANDARD FOR GAMEMAKER) ================= */}
      {isGamemaker ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {strategyStats.map((item) => {
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
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {strategyStats.map((item) => {
            const info = STRATEGY_LABELS[item.key];
            return (
              <div
                key={item.key}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-purple-200 text-xs shadow-sm"
              >
                <span>{info.icon}</span>
                <span className="font-bold text-purple-950">{info.name}:</span>
                <span className="font-mono font-bold text-purple-700">{item.count}</span>
                <span className="text-[10px] font-mono text-orange-600">({item.risk}% risk)</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= BOTTOM BOX: OTHER TRIBUTES (PLAYER) OR ALL TRIBUTES (GAMEMAKER) ================= */}
      <div className="bg-white rounded-3xl border border-purple-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black font-cinzel text-purple-950 uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-orange-600" />
          {isGamemaker ? 'Tribute Outcomes' : 'Other Tributes'}
        </h3>

        {listedTributes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
            {listedTributes.map((t) => {
              const dist = DISTRICTS.find(d => d.id === t.districtId) || DISTRICTS[0];
              const strat = STRATEGY_LABELS[t.strategy] || STRATEGY_LABELS.woods;
              const isElim = t.survivalStatus === 'eliminated';

              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    isElim
                      ? 'bg-rose-50/70 border-rose-200'
                      : 'bg-purple-50/40 border-purple-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white border border-purple-200 flex items-center justify-center">
                      <AvatarRenderer avatar={t.avatar} districtId={t.districtId} size="sm" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-purple-950 truncate">
                        {t.realName}
                      </div>
                      {/* Show ONLY what they chose + District (NOT what supplies/tool they received) */}
                      <div className="text-[10px] text-purple-600 font-mono-capitol truncate">
                        {strat.icon} {strat.name} • {dist.name}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-capitol uppercase shrink-0 ${
                    isElim
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isElim ? 'Fallen (-5)' : 'Alive'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-purple-500 font-mono-capitol text-center py-3">
            No other tributes in the arena yet.
          </p>
        )}
      </div>

      {/* ================= SCORING & RISK MECHANICS ================= */}
      <div className="bg-white rounded-3xl border border-purple-200 p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setShowScoring(!showScoring)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-bold font-mono text-purple-800 transition-colors"
        >
          <span>Scoring &amp; Risk Mechanics</span>
          {showScoring ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showScoring && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-[11px] text-purple-900 space-y-1 font-mono">
            <div><strong>But what makes us choose one option over another?</strong></div>
            <div><strong>Cornucopia:</strong> +20 pts + Tool (50% base risk) • <strong>Outskirts:</strong> +16 pts (25% base, 10% min) • <strong>Woods:</strong> +12 pts (0% risk)</div>
            <div><strong>Speed Bonus:</strong> 0–5s (+3) • 6–10s (+2) • 11–20s (+1) • <strong>Fallen:</strong> -5 marks (still playing!)</div>
          </div>
        )}
      </div>

      {/* Gamemaker Next Button */}
      {isGamemaker && (
        <div className="text-center pt-2">
          <button
            onClick={onShowLesson}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all"
          >
            Return to The Woods (Next: Phase 2)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

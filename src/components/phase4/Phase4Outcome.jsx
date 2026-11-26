import React from 'react';
import AvatarRenderer from '../AvatarRenderer';
import { DISTRICTS } from '../../data/hungerGamesData';
import { Flame, Zap, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

const FIRE_LABELS = {
  downhill: '⛰️ Moved downhill',
  tree: '🌳 Climbed a tree',
  ditch: '🎒 Ditched gear'
};

const FEAST_LABELS = {
  skip: '🌲 Skipped Feast',
  scout: '👀 Scouted tree line',
  grab: '⚡ Grabbed pack & sprinted'
};

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase4Outcome({
  isGamemaker,
  currentTribute,
  tributes,
  firePoll,
  feastPoll,
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
          Fire &amp; The Feast Results
        </h2>
      </div>

      {/* Personal Outcome & Score Card */}
      {myResult && (
        <div className={`p-4 sm:p-5 rounded-2xl border-2 shadow-sm space-y-3 ${
          myResult.p4FireDied || myResult.p4FeastDied
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {myResult.p4FireDied || myResult.p4FeastDied ? (
                <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              )}
              <div>
                <div className="text-sm sm:text-base font-black font-cinzel">
                  {myResult.p4FireDied || myResult.p4FeastDied
                    ? 'You took a heavy hit in Phase 4!'
                    : 'You survived both Fire & The Feast!'}
                </div>
                <div className="text-xs opacity-85 font-mono-capitol">
                  Fire: {FIRE_LABELS[myResult.p4FireChoice] || 'Timed out'} ({myResult.p4FirePoints >= 0 ? `+${myResult.p4FirePoints}` : myResult.p4FirePoints}) • Feast: {FEAST_LABELS[myResult.p4FeastChoice] || 'Timed out'} ({myResult.p4FeastPoints >= 0 ? `+${myResult.p4FeastPoints}` : myResult.p4FeastPoints})
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono-capitol uppercase opacity-75 font-bold">
                Your Score
              </div>
              <div className={`text-2xl font-black font-mono ${
                (myResult.p4RoundPoints || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {(myResult.p4RoundPoints || 0) >= 0 ? `+${myResult.p4RoundPoints}` : myResult.p4RoundPoints} pts
              </div>
              <div className="text-[11px] font-mono-capitol opacity-80">
                Total: <strong>{myResult.totalScore ?? 0} pts</strong>
              </div>
            </div>
          </div>

          {myResult.feastBonusVote && (
            <div className="p-2.5 rounded-xl bg-orange-100 border border-orange-300 text-xs font-bold text-orange-900">
              ⚡ Feast Reward Unlocked: You survived the sprint and earned <strong>+1 bonus vote</strong> in Phase 5&apos;s Sponsor Pitch!
            </div>
          )}
        </div>
      )}

      {/* Anonymous Arena Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-2.5">
          <h3 className="text-xs font-black font-mono-capitol uppercase text-purple-700 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-600" />
            Event 1: Wall of Fire
          </h3>
          {[
            { id: 'downhill', label: '⛰️ Moved downhill', count: firePoll?.downhill || 0 },
            { id: 'tree', label: '🌳 Climbed a tree', count: firePoll?.tree || 0 },
            { id: 'ditch', label: '🎒 Ditched gear', count: firePoll?.ditch || 0 }
          ].map((row) => (
            <div key={row.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="font-bold text-purple-950">{row.label}</span>
              <span className="font-mono font-black text-orange-600">{getPct(row.count, total)}% ({row.count})</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-2.5">
          <h3 className="text-xs font-black font-mono-capitol uppercase text-purple-700 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-orange-600" />
            Event 2: The Feast
          </h3>
          {[
            { id: 'skip', label: '🌲 Skipped the Feast', count: feastPoll?.skip || 0 },
            { id: 'scout', label: '👀 Scouted tree line', count: feastPoll?.scout || 0 },
            { id: 'grab', label: '⚡ Sprinted for pack', count: feastPoll?.grab || 0 }
          ].map((row) => (
            <div key={row.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="font-bold text-purple-950">{row.label}</span>
              <span className="font-mono font-black text-orange-600">{getPct(row.count, total)}% ({row.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tribute Status List */}
      <div className="bg-white rounded-3xl border border-purple-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black font-cinzel text-purple-950 uppercase tracking-wider">
          Tribute Decisions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {tributes.map((t) => {
            const dist = DISTRICTS.find(d => d.id === t.districtId) || DISTRICTS[0];
            const isMe = t.id === currentTribute?.id;
            const tookHit = t.p4FireDied || t.p4FeastDied;
            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                  tookHit ? 'bg-rose-50/70 border-rose-200' : isMe ? 'bg-orange-50 border-orange-300' : 'bg-purple-50/40 border-purple-100'
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
                      {FIRE_LABELS[t.p4FireChoice] || 'Timeout'} • {FEAST_LABELS[t.p4FeastChoice] || 'Timeout'} • {dist.name}
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-capitol uppercase shrink-0 ${
                  tookHit ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {tookHit ? 'Hit' : 'Survived'}
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
            Share Psychology Takeaway
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

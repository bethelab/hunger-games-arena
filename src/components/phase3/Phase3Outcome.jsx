import React from 'react';
import AvatarRenderer from '../AvatarRenderer';
import { DISTRICTS } from '../../data/hungerGamesData';
import { Droplets, ShieldCheck, AlertTriangle, ArrowRight, Lock, BarChart3 } from 'lucide-react';

const LOC_LABELS = {
  puddle: { name: 'Nearby Puddle', icon: '💧', quality: 'Highly contaminated' },
  pond: { name: 'Forest Pond', icon: '🌿', quality: 'Moderately contaminated' },
  stream: { name: 'Mountain Stream', icon: '⛰️', quality: 'Least contaminated' }
};

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function Phase3Outcome({
  isGamemaker,
  currentTribute,
  tributes,
  locationPoll,
  actionPoll,
  onShowLesson
}) {
  const myResult = !isGamemaker
    ? tributes.find(t => t.id === currentTribute?.id)
    : null;

  const total = Math.max(tributes.length, 1);
  const sickCount = tributes.filter(t => t.p3GotSick).length;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto space-y-6">
      <div className="text-center space-y-1">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
          Phase 3 Outcomes
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
          Water &amp; Consequences
        </h2>
      </div>

      {/* Private Personal Outcome & Score Card (ONLY visible to the current tribute) */}
      {myResult && (
        <div className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-4 shadow-sm ${
          myResult.p3GotSick
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}>
          <div className="flex items-center gap-3">
            {myResult.p3GotSick ? (
              <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            )}
            <div>
              <div className="text-sm sm:text-base font-black font-cinzel">
                {myResult.p3GotSick
                  ? 'Contaminated water made you sick!'
                  : 'You hydrated safely!'}
              </div>
              <div className="text-xs opacity-80 font-mono-capitol">
                {LOC_LABELS[myResult.p3Location]?.name} • {myResult.p3Action === 'purify' ? 'Purified first' : 'Drank immediately'}
                {myResult.p3GotSick ? ` • Contamination penalty: -${myResult.p3Penalty}` : ''}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono-capitol uppercase opacity-75 font-bold">
              Your Score
            </div>
            <div className={`text-2xl font-black font-mono ${
              (myResult.p3RoundPoints || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              +{myResult.p3RoundPoints ?? 0} pts
            </div>
            <div className="text-[11px] font-mono-capitol opacity-80">
              Total: <strong>{myResult.totalScore ?? 0} pts</strong>
            </div>
          </div>
        </div>
      )}

      {/* Arena Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-black font-mono-capitol uppercase text-purple-700 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-orange-600" />
            Water Source Reveal
          </h3>
          <div className="space-y-2.5 text-xs">
            {[
              { id: 'puddle', count: locationPoll?.puddle || 0 },
              { id: 'pond', count: locationPoll?.pond || 0 },
              { id: 'stream', count: locationPoll?.stream || 0 }
            ].map((row) => {
              const info = LOC_LABELS[row.id];
              const pct = getPct(row.count, total);
              return (
                <div key={row.id} className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                  <div>
                    <div className="font-bold text-purple-950">{info.icon} {info.name}</div>
                    <div className="text-[10px] text-purple-600 font-mono-capitol">{info.quality}</div>
                  </div>
                  <div className="text-right font-mono font-black text-orange-600">
                    {pct}% <span className="text-[10px] font-normal text-purple-500">({row.count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-black font-mono-capitol uppercase text-purple-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              Purification &amp; Health
            </h3>
            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                <div className="text-xl font-black font-mono text-orange-600">
                  {getPct(actionPoll?.drink || 0, total)}%
                </div>
                <div className="text-[11px] font-bold text-purple-900">Drank Immediately</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <div className="text-xl font-black font-mono text-purple-800">
                  {getPct(actionPoll?.purify || 0, total)}%
                </div>
                <div className="text-[11px] font-bold text-purple-900">Purified First</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-center text-xs font-bold text-rose-800">
              {sickCount} of {tributes.length} tribute{tributes.length === 1 ? '' : 's'} fell ill from contaminated water
            </div>
          </div>

          <p className="text-[10px] text-purple-500 italic leading-snug pt-2">
            Game probabilities are fictional — in real life, even clear mountain streams can carry pathogens.
          </p>
        </div>
      </div>

      {/* Tribute Health Status (NO other tributes' scores displayed) */}
      <div className="bg-white rounded-3xl border border-purple-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black font-cinzel text-purple-950 uppercase tracking-wider">
            Tribute Health Status
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {tributes.map((t) => {
            const dist = DISTRICTS.find(d => d.id === t.districtId) || DISTRICTS[0];
            const loc = LOC_LABELS[t.p3Location] || LOC_LABELS.puddle;
            const isMe = t.id === currentTribute?.id;

            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                  t.p3GotSick
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
                    <div className="text-xs font-black text-purple-950 truncate flex items-center gap-1">
                      <span>{t.realName}</span>
                      {isMe && <span className="text-[9px] px-1 rounded bg-orange-200 text-orange-800">YOU</span>}
                    </div>
                    <div className="text-[10px] text-purple-600 font-mono-capitol truncate">
                      {loc.icon} {loc.name} • {t.p3Action === 'purify' ? 'Purified' : 'Drank'} • {dist.name}
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-capitol uppercase shrink-0 ${
                  t.p3GotSick
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {t.p3GotSick ? 'Ill' : 'Healthy'}
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

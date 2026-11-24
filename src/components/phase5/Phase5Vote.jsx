import React from 'react';
import Countdown from '../phase1/Countdown';
import AvatarRenderer from '../AvatarRenderer';
import { PERSONAS } from './Phase5Pitch';
import { Heart, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export default function Phase5Vote({
  isGamemaker,
  currentTribute,
  countdown,
  duration,
  tributes,
  pitches,
  votes,
  myVote,
  onCastVote,
  onRevealWinner
}) {
  const totalVotesCast = Object.keys(votes || {}).length;
  const eligibleCandidates = tributes.filter(t => t.id !== currentTribute?.id);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      <Countdown countdown={countdown} duration={duration || 45} />

      {isGamemaker ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6 sm:p-8 text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
            <Heart className="w-3.5 h-3.5" />
            Anonymous Sponsor Voting
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
            The Capitol Is Deciding...
          </h2>

          <div className="py-4">
            <div className="text-4xl font-black font-mono text-orange-600">
              {totalVotesCast} / {tributes.length}
            </div>
            <div className="text-xs font-mono-capitol text-purple-600 mt-1">
              anonymous sponsor votes cast
            </div>
          </div>

          <p className="text-xs text-purple-600 font-mono-capitol">
            1st place earns +5 pts • Runner-up +3 pts • 3rd place +1 pt
          </p>

          <button
            onClick={onRevealWinner}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all"
          >
            Reveal Sponsor Winner
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
              Cast Your Sponsor Vote
            </h2>
            <p className="text-xs sm:text-sm text-purple-700 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              Vote anonymously for one other tribute (you cannot vote for yourself).
            </p>
          </div>

          {eligibleCandidates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {eligibleCandidates.map((t) => {
                const p = pitches?.[t.id];
                const pInfo = PERSONAS.find(x => x.id === p?.persona) || PERSONAS[4];
                const isSelected = myVote === t.id;
                const isLockedOther = Boolean(myVote) && !isSelected;

                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={Boolean(myVote)}
                    onClick={() => onCastVote(t.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-orange-50 border-orange-500 shadow-lg ring-4 ring-orange-200'
                        : isLockedOther
                        ? 'bg-purple-50/40 border-purple-100 opacity-45 cursor-not-allowed'
                        : 'bg-white border-purple-200 hover:border-orange-400 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                          <AvatarRenderer avatar={t.avatar} districtId={t.districtId} size="sm" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black font-cinzel text-purple-950 truncate">{t.realName}</div>
                          <div className="text-[10px] font-mono-capitol font-bold text-orange-700">
                            {pInfo.icon} {pInfo.label}
                          </div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />}
                    </div>

                    <p className="text-xs text-purple-800 italic leading-relaxed">
                      {p?.pitch ? `“${p.pitch}”` : '“Sponsor me — I am built to survive.”'}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-purple-200 text-center text-xs text-purple-600 font-mono-capitol">
              Waiting for other tributes to join...
            </div>
          )}

          {myVote && (
            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono-capitol">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Anonymous sponsor vote locked in! Waiting for results...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import Countdown from '../phase1/Countdown';
import AvatarRenderer from '../AvatarRenderer';
import { Sparkles, CheckCircle2, ArrowRight, Mic } from 'lucide-react';

export default function Phase5Pitch({
  isGamemaker,
  countdown,
  duration,
  tributes,
  pitches,
  myPitch,
  onSubmitPitch,
  onStartVote
}) {
  const [pitchText, setPitchText] = useState(myPitch?.pitch || '');
  const submittedCount = Object.keys(pitches || {}).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pitchText.trim()) return;
    onSubmitPitch(pitchText.trim());
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
      <Countdown countdown={countdown} duration={duration} />

      {isGamemaker ? (
        <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono-capitol uppercase text-orange-600">
                <Mic className="w-4 h-4" />
                Capitol Interviews
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-cinzel text-purple-950">
                Live Tribute Pitches
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol">
              {submittedCount} / {tributes.length} Submitted
            </span>
          </div>

          {submittedCount > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {tributes.map((t, idx) => {
                const p = pitches?.[t.id];
                if (!p) return null;
                return (
                  <div key={t.id} className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-purple-200 flex items-center justify-center shrink-0">
                        <AvatarRenderer avatar={t.avatar} districtId={t.districtId} size="sm" />
                      </div>
                      <div className="text-xs font-black font-cinzel text-purple-950 truncate">
                        Tribute #{idx + 1}
                      </div>
                    </div>
                    <p className="text-xs text-purple-900 italic leading-relaxed">
                      &ldquo;{p.pitch}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-purple-50/50 border border-dashed border-purple-200 text-center text-xs text-purple-600 font-mono-capitol">
              Waiting for tributes to submit their Capitol pitches...
            </div>
          )}

          <div className="pt-3 border-t border-purple-100 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-purple-500 font-mono-capitol">
              Next: Tributes vote anonymously on the pitches (names hidden to prevent bias!).
            </p>
            <button
              onClick={onStartVote}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              Open Sponsor Voting
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-5 sm:p-8 space-y-5">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono-capitol uppercase text-orange-600">
              <Sparkles className="w-3.5 h-3.5" />
              Sell Yourself to the Capitol
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-cinzel text-purple-950">
              &ldquo;Why should we sponsor YOU?&rdquo;
            </h2>
          </div>

          {!myPitch ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <textarea
                  rows={4}
                  maxLength={220}
                  required
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Write your pitch to win over the Capitol sponsors..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 text-sm text-purple-950 focus:outline-none focus:border-orange-500 resize-none"
                />
                <div className="text-right text-[10px] font-mono text-purple-400">
                  {pitchText.length}/220
                </div>
              </div>

              <button
                type="submit"
                disabled={!pitchText.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all"
              >
                Submit Pitch to Capitol
              </button>
            </form>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-sm font-black font-cinzel text-emerald-950">
                Your pitch is live with the Capitol!
              </div>
              <p className="text-xs text-emerald-800 italic">&ldquo;{myPitch.pitch}&rdquo;</p>
              <div className="text-[11px] font-mono-capitol text-emerald-700 pt-1">
                Waiting for sponsor voting to open...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

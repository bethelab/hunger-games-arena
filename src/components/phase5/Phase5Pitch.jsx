import React, { useState } from 'react';
import Countdown from '../phase1/Countdown';
import AvatarRenderer from '../AvatarRenderer';
import { Sparkles, CheckCircle2, ArrowRight, Mic } from 'lucide-react';

export const PERSONAS = [
  { id: 'underdog', icon: '🔥', label: 'The Underdog', tagline: 'The unexpected survivor.' },
  { id: 'mastermind', icon: '🧠', label: 'The Mastermind', tagline: 'Always three steps ahead.' },
  { id: 'favourite', icon: '✨', label: 'The Crowd Favourite', tagline: 'Wins people over effortlessly.' },
  { id: 'wildcard', icon: '🎲', label: 'The Wildcard', tagline: 'Unpredictable and impossible to ignore.' },
  { id: 'myself', icon: '🙋', label: 'Just Myself', tagline: 'Authentic and unfiltered.' }
];

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
  const [persona, setPersona] = useState(myPitch?.persona || 'myself');
  const [pitchText, setPitchText] = useState(myPitch?.pitch || '');

  const submittedCount = Object.keys(pitches || {}).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pitchText.trim()) return;
    onSubmitPitch(persona, pitchText.trim());
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
              {tributes.map((t) => {
                const p = pitches?.[t.id];
                if (!p) return null;
                const pInfo = PERSONAS.find(x => x.id === p.persona) || PERSONAS[4];
                return (
                  <div key={t.id} className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-purple-200 flex items-center justify-center shrink-0">
                        <AvatarRenderer avatar={t.avatar} districtId={t.districtId} size="sm" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black font-cinzel text-purple-950 truncate">{t.realName}</div>
                        <div className="text-[10px] font-mono-capitol text-orange-700 font-bold">
                          {pInfo.icon} {pInfo.label}
                        </div>
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
              You can invite tributes to read theirs aloud, then open the anonymous sponsor vote.
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
              {/* Optional Personality Selector */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold font-mono-capitol uppercase text-purple-700">
                  Pick a Persona (Optional)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPersona(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        persona === p.id
                          ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200'
                          : 'bg-purple-50/40 border-purple-200 hover:border-purple-400'
                      }`}
                    >
                      <div className="text-xs font-black text-purple-950">{p.icon} {p.label}</div>
                      <div className="text-[10px] text-purple-600">{p.tagline}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guiding prompts */}
              <div className="text-[11px] text-purple-600 bg-purple-50/60 border border-purple-100 rounded-xl px-3.5 py-2 font-mono-capitol">
                Ideas: What makes you different? What&apos;s your biggest strength? Why will you survive?
              </div>

              {/* Pitch Input */}
              <div className="space-y-1.5">
                <textarea
                  rows={3}
                  maxLength={220}
                  required
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Write your 30-second pitch to win over the Capitol sponsors..."
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

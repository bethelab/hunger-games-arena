import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import AvatarRenderer from '../AvatarRenderer';
import { PERSONAS } from './Phase5Pitch';
import { Award, Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function Phase5Winner({
  isGamemaker,
  currentTribute,
  tributes,
  podium,
  onShowLesson
}) {
  const winnerEntry = podium?.[0];
  const winner = winnerEntry ? tributes.find(t => t.id === winnerEntry.tributeId) : null;
  const runnerUps = (podium || []).slice(1);
  const myResult = !isGamemaker ? tributes.find(t => t.id === currentTribute?.id) : null;

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#F97316', '#7C3AED', '#FBBF24', '#C026D3']
    });
  }, []);

  const winnerPersona = PERSONAS.find(x => x.id === winner?.p5Persona) || PERSONAS[4];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-3xl w-full mx-auto space-y-5">
      {/* Dramatic Capitol Announcement Card */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-purple-950 via-purple-900 to-orange-900 text-white p-6 sm:p-8 shadow-2xl border-2 border-orange-400 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-black font-mono-capitol uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Capitol Announcement
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-orange-300 tracking-wide">
            A SPONSOR HAS CHOSEN YOU!
          </h2>
          <p className="text-xs font-mono-capitol uppercase tracking-widest text-purple-200">
            The Capitol&apos;s Favourite Tribute
          </p>
        </div>

        {winner ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-orange-400 flex items-center justify-center overflow-hidden shadow-xl">
              <AvatarRenderer avatar={winner.avatar} districtId={winner.districtId} size="md" showPedestal={false} />
            </div>
            <div>
              <div className="text-2xl font-black font-cinzel text-white">{winner.realName}</div>
              <div className="text-xs font-mono-capitol text-orange-300">
                {winnerPersona.icon} {winnerPersona.label} • {winnerEntry.votes} sponsor vote{winnerEntry.votes === 1 ? '' : 's'}
              </div>
            </div>
            {winner.p5Pitch && (
              <p className="text-xs sm:text-sm text-purple-100 italic max-w-md">
                &ldquo;{winner.p5Pitch}&rdquo;
              </p>
            )}
            <div className="px-4 py-1.5 rounded-full bg-orange-500 text-white font-black font-mono text-sm shadow">
              +5 SPONSOR BONUS POINTS
            </div>
          </div>
        ) : (
          <p className="text-sm text-purple-200 py-4">No sponsor votes were cast this round.</p>
        )}

        {/* Runner-up & 3rd place mentions */}
        {runnerUps.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-white/15">
            {runnerUps.map((entry) => {
              const t = tributes.find(x => x.id === entry.tributeId);
              if (!t) return null;
              return (
                <div key={entry.tributeId} className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono-capitol flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-orange-300" />
                  <span>#{entry.rank} <strong>{t.realName}</strong></span>
                  <span className="text-orange-300 font-bold">+{entry.bonus} pts</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Private Personal Score Card for Current Tribute */}
      {myResult && (
        <div className="w-full p-4 rounded-2xl bg-white border-2 border-purple-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-mono-capitol uppercase text-purple-600">
              <Lock className="w-3 h-3" />
              Your Private Phase 5 Score
            </div>
            <div className="text-xs text-purple-800 font-mono-capitol mt-0.5">
              Pitch +{myResult.p5Breakdown?.ptsPitch ?? 0} • Creativity +{myResult.p5Breakdown?.ptsCreative ?? 0} • Persuasion +{myResult.p5Breakdown?.ptsPersuasive ?? 0} • Sponsor +{myResult.p5Breakdown?.ptsSponsor ?? 0}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black font-mono text-emerald-700">+{myResult.p5RoundPoints ?? 0} pts</div>
            <div className="text-[11px] font-mono-capitol text-purple-700">
              Total: <strong>{myResult.totalScore ?? 0} pts</strong>
            </div>
          </div>
        </div>
      )}

      {isGamemaker ? (
        <button
          onClick={onShowLesson}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all"
        >
          Share Learning Slide
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="text-xs text-purple-500 font-mono-capitol">
          Waiting for Gamemaker to continue...
        </div>
      )}
    </div>
  );
}

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import AvatarRenderer from '../AvatarRenderer';
import { DISTRICTS } from '../../data/hungerGamesData';
import { Trophy, MessageCircle, RotateCcw } from 'lucide-react';

export default function GrandFinale({
  isGamemaker,
  currentTribute,
  tributes,
  onBackToLobby
}) {
  const leaderboard = [...tributes].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  const victor = leaderboard[0] || null;
  const victorDistrict = victor ? (DISTRICTS.find(d => d.id === victor.districtId) || DISTRICTS[0]) : null;

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.45 },
      colors: ['#F97316', '#7C3AED', '#FBBF24', '#C026D3', '#10B981']
    });
  }, []);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto space-y-6">
      {/* Victor Crown Card */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-950 via-purple-900 to-orange-800 text-white p-6 sm:p-10 shadow-2xl border-2 border-orange-400 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-orange-500 text-white text-xs font-black font-mono-capitol uppercase tracking-widest">
          <Trophy className="w-4 h-4" />
          Victor of the Games
        </div>

        {victor ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-white/10 border-4 border-orange-400 flex items-center justify-center overflow-hidden shadow-2xl">
                <AvatarRenderer avatar={victor.avatar} districtId={victor.districtId} size="md" showPedestal={false} />
              </div>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl drop-shadow">👑</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black font-cinzel text-orange-300 tracking-wide">
                {victor.realName}
              </h1>
              <p className="text-xs font-mono-capitol text-purple-200 mt-0.5">
                {victorDistrict?.icon} {victorDistrict?.name} • {victorDistrict?.specialty}
              </p>
            </div>

            <div className="px-5 py-1.5 rounded-full bg-white/15 border border-orange-300/50 text-lg font-black font-mono text-orange-200">
              {victor.totalScore ?? 0} TOTAL POINTS
            </div>
          </div>
        ) : (
          <p className="text-sm text-purple-200">No tributes on the board yet.</p>
        )}
      </div>

      {/* Final Leaderboard (Revealed for the Grand Finale across all 5 phases) */}
      <div className="bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 shadow-md space-y-3">
        <h2 className="text-sm font-black font-cinzel text-purple-950 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-orange-600" />
          Final Leaderboard (All 5 Phases)
        </h2>

        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {leaderboard.map((t, index) => {
            const dist = DISTRICTS.find(d => d.id === t.districtId) || DISTRICTS[0];
            const isMe = t.id === currentTribute?.id;
            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  index === 0
                    ? 'bg-orange-50 border-orange-400 shadow-sm'
                    : isMe
                    ? 'bg-purple-100/70 border-purple-300'
                    : 'bg-purple-50/40 border-purple-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono shrink-0 ${
                    index === 0
                      ? 'bg-orange-500 text-white'
                      : index === 1
                      ? 'bg-purple-800 text-white'
                      : index === 2
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {index + 1}
                  </span>

                  <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-purple-200 flex items-center justify-center shrink-0">
                    <AvatarRenderer avatar={t.avatar} districtId={t.districtId} size="sm" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black font-cinzel text-purple-950 truncate flex items-center gap-1.5">
                      <span>{t.realName}</span>
                      {isMe && <span className="text-[9px] px-1 rounded bg-orange-200 text-orange-800 font-sans">YOU</span>}
                    </div>
                    <div className="text-[10px] text-purple-600 font-mono-capitol truncate">
                      {dist.icon} {dist.name}
                      {t.allianceName ? ` • ${t.allianceName}` : ''}
                    </div>
                  </div>
                </div>

                <span className="text-sm sm:text-base font-black font-mono text-purple-950 shrink-0">
                  {t.totalScore ?? 0} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Reflection Question */}
      <div className="p-5 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-start gap-3">
        <MessageCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-[11px] font-black font-mono-capitol uppercase text-orange-700">
            Final Reflection
          </div>
          <p className="text-sm text-purple-950 italic leading-relaxed">
            &ldquo;What did the Games reveal about the way you think, make decisions and interact with others?&rdquo;
          </p>
        </div>
      </div>

      {isGamemaker && (
        <div className="text-center pt-1">
          <button
            onClick={onBackToLobby}
            className="px-7 py-3 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Return to Lobby
          </button>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import AvatarRenderer from '../AvatarRenderer';
import { DISTRICTS } from '../../data/hungerGamesData';
import { Users, User, ArrowRight } from 'lucide-react';

export default function AllianceReveal({
  isGamemaker,
  currentTribute,
  tributes,
  alliances,
  soloIds,
  onShowLesson
}) {
  const getTribute = (id) => tributes.find(t => t.id === id);

  const myTeam = !isGamemaker
    ? (alliances || []).find(a => a.memberIds.includes(currentTribute?.id))
    : null;
  const myPartners = myTeam
    ? myTeam.memberIds.filter(id => id !== currentTribute?.id).map(getTribute).filter(Boolean)
    : [];

  const soloTributes = (soloIds || []).map(getTribute).filter(Boolean);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-5xl w-full mx-auto space-y-6">
      <div className="text-center space-y-1">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
          Phase 2 Assignments
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
          Alliances &amp; Lone Wolves
        </h2>
      </div>

      {/* Personal Status Banner for Tributes */}
      {!isGamemaker && (
        <div className={`p-4 sm:p-5 rounded-2xl border-2 shadow-sm flex flex-wrap items-center justify-between gap-3 ${
          myTeam
            ? 'bg-orange-50 border-orange-300 text-purple-950'
            : 'bg-purple-50 border-purple-200 text-purple-950'
        }`}>
          <div className="flex items-center gap-3">
            {myTeam ? (
              <Users className="w-7 h-7 text-orange-600 shrink-0" />
            ) : (
              <User className="w-7 h-7 text-purple-700 shrink-0" />
            )}
            <div>
              <div className="text-sm sm:text-base font-black font-cinzel">
                {myTeam
                  ? `You are in ${myTeam.name}!`
                  : 'You are playing Solo for the rest of the Games.'}
              </div>
              <div className="text-xs text-purple-700 font-mono-capitol">
                {myTeam
                  ? `Partner${myPartners.length > 1 ? 's' : ''}: ${myPartners.map(p => p.realName).join(' & ')}`
                  : 'Independent decisions — no risk of betrayal, no backup.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formed Alliances */}
      <div className="space-y-3">
        <h3 className="text-xs font-black font-mono-capitol uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-orange-600" />
          Formed Alliances ({(alliances || []).length})
        </h3>

        {alliances && alliances.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alliances.map((team) => {
              const members = team.memberIds.map(getTribute).filter(Boolean);
              const isMyTeam = team.memberIds.includes(currentTribute?.id);

              return (
                <div
                  key={team.id}
                  className={`p-4 rounded-2xl border-2 bg-white shadow-sm space-y-3 ${
                    isMyTeam ? 'border-orange-400 ring-2 ring-orange-200' : 'border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black font-cinzel text-purple-950">
                      {team.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold font-mono-capitol">
                      Team of {members.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {members.map((m) => {
                      const dist = DISTRICTS.find(d => d.id === m.districtId) || DISTRICTS[0];
                      const isMe = m.id === currentTribute?.id;
                      return (
                        <div
                          key={m.id}
                          className={`p-2 rounded-xl flex items-center gap-2.5 border ${
                            isMe ? 'bg-orange-50 border-orange-200' : 'bg-purple-50/50 border-purple-100'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-purple-200 flex items-center justify-center shrink-0">
                            <AvatarRenderer avatar={m.avatar} districtId={m.districtId} size="sm" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-purple-950 truncate flex items-center gap-1">
                              <span>{m.realName}</span>
                              {isMe && <span className="text-[9px] px-1 bg-orange-200 text-orange-800 rounded">YOU</span>}
                            </div>
                            <div className="text-[10px] text-purple-600 font-mono-capitol truncate">
                              {dist.icon} {dist.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white border border-purple-200 text-center text-xs text-purple-600 font-mono-capitol">
            No alliances were formed this round — everyone is going solo!
          </div>
        )}
      </div>

      {/* Solo Tributes */}
      {soloTributes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black font-mono-capitol uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <User className="w-4 h-4 text-purple-600" />
            Playing Solo ({soloTributes.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {soloTributes.map((m) => {
              const dist = DISTRICTS.find(d => d.id === m.districtId) || DISTRICTS[0];
              const isMe = m.id === currentTribute?.id;
              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl border bg-white flex items-center gap-2.5 shadow-sm ${
                    isMe ? 'border-orange-400 bg-orange-50/60' : 'border-purple-200'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                    <AvatarRenderer avatar={m.avatar} districtId={m.districtId} size="sm" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-purple-950 truncate flex items-center gap-1">
                      <span>{m.realName}</span>
                      {isMe && <span className="text-[9px] px-1 bg-orange-200 text-orange-800 rounded">YOU</span>}
                    </div>
                    <div className="text-[10px] text-purple-600 font-mono-capitol truncate">
                      {dist.icon} Solo
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gamemaker Next Button */}
      {isGamemaker ? (
        <div className="text-center pt-2">
          <button
            onClick={onShowLesson}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all"
          >
            Share Learning Page
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center text-xs text-purple-500 font-mono-capitol pt-2">
          Waiting for Gamemaker to continue...
        </div>
      )}
    </div>
  );
}

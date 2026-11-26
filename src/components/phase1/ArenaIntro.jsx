import React, { useState } from 'react';
import { Flame, Play, Clock } from 'lucide-react';

const PRESET_SECONDS = [15, 20, 30, 45, 60];

export default function ArenaIntro({ isGamemaker, durationSeconds, tributeCount, onStartChoice, onChangeDuration }) {
  const [customSeconds, setCustomSeconds] = useState(durationSeconds || 30);

  const handleSelectSeconds = (secs) => {
    const clamped = Math.max(5, Math.min(300, secs));
    setCustomSeconds(clamped);
    onChangeDuration(clamped);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase tracking-widest">
          <Flame className="w-3.5 h-3.5" />
          Phase 1
        </div>

        <div className="space-y-2.5">
          <h1 className="text-3xl sm:text-4xl font-black font-cinzel text-purple-950 tracking-wide">
            The Cornucopia
          </h1>
          <p className="text-sm sm:text-base text-purple-700 max-w-lg mx-auto leading-relaxed">
            At the center of the arena sits the Cornucopia, stocked with supplies.
            When the countdown begins, every tribute must make one split-second decision.
          </p>
          <p className="text-xs sm:text-sm font-bold text-orange-700 max-w-md mx-auto">
            Choose carefully — your decision will directly impact your survival and how the rest of the Games turns out.
          </p>
        </div>

        {isGamemaker ? (
          <div className="pt-4 border-t border-purple-100 space-y-4">
            {/* Timer Duration Picker */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 font-mono-capitol uppercase">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Set Decision Timer (Seconds)
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {PRESET_SECONDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSelectSeconds(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-capitol transition-all ${
                      customSeconds === s
                        ? 'bg-purple-800 text-white shadow-sm'
                        : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
                <div className="flex items-center gap-1 ml-1">
                  <input
                    type="number"
                    min={5}
                    max={300}
                    value={customSeconds}
                    onChange={(e) => handleSelectSeconds(parseInt(e.target.value, 10) || 30)}
                    className="w-16 px-2 py-1.5 rounded-xl border border-purple-300 text-center text-xs font-bold font-mono text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-xs text-purple-600 font-mono">sec</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartChoice(customSeconds)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Sound the Gong ({customSeconds}s)
            </button>
            <p className="text-xs text-purple-500 font-mono-capitol">
              {tributeCount} tribute{tributeCount === 1 ? '' : 's'} standing on pedestals
            </p>
          </div>
        ) : (
          <div className="pt-4 border-t border-purple-100">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold font-mono-capitol">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              Stand by on your pedestal... Waiting for Gamemaker
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

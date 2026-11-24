import React, { useState } from 'react';
import { Sparkles, Play, Clock } from 'lucide-react';

const PRESET_SECONDS = [30, 45, 60, 90];

export default function Phase5Intro({ isGamemaker, durationSeconds, tributeCount, onStartPitch }) {
  const [customSeconds, setCustomSeconds] = useState(durationSeconds || 60);

  const handleSelectSeconds = (secs) => {
    setCustomSeconds(Math.max(10, Math.min(300, secs)));
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Phase 5 • Final Challenge
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950 tracking-wide">
          Win Over the Sponsors
        </h1>

        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-5 sm:p-6 text-left space-y-3 text-sm sm:text-base text-purple-900 leading-relaxed italic">
          <p>
            &ldquo;Tributes, you have made it through the arena, survived unexpected dangers and demonstrated your ability to adapt.
          </p>
          <p>
            But survival isn&apos;t just about what you can do. It&apos;s also about how others perceive you.
          </p>
          <p>
            The Capitol is watching, and our sponsors are ready to support the tributes they believe are worthy. However, sponsors have limited resources.
          </p>
          <p className="font-bold not-italic text-orange-700">
            You must now convince the Capitol why YOU deserve their support.
          </p>
          <p className="font-semibold not-italic text-purple-950">
            Make an impression, Tributes. Your survival may depend on it.&rdquo;
          </p>
        </div>

        {isGamemaker ? (
          <div className="pt-2 border-t border-purple-100 space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 font-mono-capitol uppercase">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Set Pitch Preparation Timer
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
                    min={10}
                    max={300}
                    value={customSeconds}
                    onChange={(e) => handleSelectSeconds(parseInt(e.target.value, 10) || 60)}
                    className="w-16 px-2 py-1.5 rounded-xl border border-purple-300 text-center text-xs font-bold font-mono text-purple-950 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-xs text-purple-600 font-mono">sec</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartPitch(customSeconds)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Open Sponsor Pitches ({customSeconds}s)
            </button>
            <p className="text-xs text-purple-500 font-mono-capitol">
              {tributeCount} tribute{tributeCount === 1 ? '' : 's'} stepping up to the microphone
            </p>
          </div>
        ) : (
          <div className="pt-2 border-t border-purple-100">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold font-mono-capitol">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              Prepare your Capitol pitch... Waiting for Gamemaker
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

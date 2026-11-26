import React, { useState } from 'react';
import { Flame, Play, Clock } from 'lucide-react';

const PRESET_SECONDS = [15, 20, 30, 45, 60];

export default function Phase4Intro({ isGamemaker, durationSeconds, tributeCount, onStartEvent }) {
  const [customSeconds, setCustomSeconds] = useState(durationSeconds || 30);

  const handleSelectSeconds = (secs) => {
    setCustomSeconds(Math.max(5, Math.min(300, secs)));
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase tracking-widest">
          <Flame className="w-3.5 h-3.5" />
          Phase 4 • The Arena Is Changing
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950 tracking-wide">
          The Gamemakers&apos; Twist
        </h1>

        {/* Detailed phase explanation WITHOUT giving away the surprise scenarios or options */}
        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-5 sm:p-6 text-left space-y-3 text-sm sm:text-base text-purple-900 leading-relaxed italic">
          <p>
            &ldquo;Tributes, you have made it this far. Some of you have found allies, gathered resources and developed strategies.
          </p>
          <p className="font-bold not-italic text-orange-700">
            But perhaps you&apos;ve forgotten something important. You are not in control of this arena. We are.
          </p>
          <p>
            Things have become a little too comfortable. In this phase, you will face two sudden, back-to-back Gamemaker events designed to test how you react when danger strikes without warning.
          </p>
          <p className="font-semibold not-italic text-purple-950">
            You will not know what is coming until the countdown begins. React fast — freezing up and missing the timer will cost you heavily (-8 points).&rdquo;
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-purple-900 text-left space-y-1">
          <div><strong>How Phase 4 Works:</strong> Two surprise survival scenarios will appear back-to-back.</div>
          <div><strong>Don&apos;t Freeze:</strong> Every decision is individual and timed — failing to respond before the countdown ends deducts <strong>-8 points</strong>.</div>
        </div>

        {isGamemaker ? (
          <div className="pt-2 border-t border-purple-100 space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 font-mono-capitol uppercase">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Set Fire Disaster Timer
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
              onClick={() => onStartEvent(customSeconds)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Trigger Event 1 ({customSeconds}s)
            </button>
            <p className="text-xs text-purple-500 font-mono-capitol">
              {tributeCount} tribute{tributeCount === 1 ? '' : 's'} in the arena
            </p>
          </div>
        ) : (
          <div className="pt-2 border-t border-purple-100">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold font-mono-capitol">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              Brace yourself... Waiting for Gamemaker
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

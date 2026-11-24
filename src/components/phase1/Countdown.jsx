import React from 'react';
import { Timer } from 'lucide-react';

export default function Countdown({ countdown, duration }) {
  const safeDuration = Math.max(duration || 30, 1);
  const pct = Math.max(0, Math.min(100, (countdown / safeDuration) * 100));
  const isUrgent = countdown <= 10 && countdown > 0;

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border-2 border-purple-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-bold font-mono-capitol uppercase text-purple-700">
          <Timer className={`w-4 h-4 ${isUrgent ? 'text-orange-600 animate-bounce' : 'text-purple-600'}`} />
          <span>Decision Countdown</span>
        </div>
        <span className={`text-2xl sm:text-3xl font-black font-mono tracking-widest ${
          isUrgent ? 'text-orange-600' : 'text-purple-950'
        }`}>
          {countdown}s
        </span>
      </div>
      <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isUrgent ? 'bg-orange-500' : 'bg-gradient-to-r from-purple-700 to-orange-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

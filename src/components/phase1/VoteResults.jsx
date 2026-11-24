import React from 'react';
import { BarChart3, ArrowRight } from 'lucide-react';

function getPct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default function VoteResults({ isGamemaker, poll, onRevealConsequences }) {
  const totalVoted = poll?.totalVoted || 0;
  const totalTributes = poll?.totalTributes || 0;
  const denominator = totalVoted || totalTributes || 1;

  const rows = [
    {
      id: 'cornucopia',
      icon: '⚔️',
      label: 'rushed to the Cornucopia.',
      count: poll?.cornucopia || 0,
      barColor: 'bg-orange-500'
    },
    {
      id: 'outskirts',
      icon: '🎒',
      label: 'grabbed supplies from the outskirts.',
      count: poll?.outskirts || 0,
      barColor: 'bg-purple-600'
    },
    {
      id: 'woods',
      icon: '🌲',
      label: 'ran into the woods.',
      count: poll?.woods || 0,
      barColor: 'bg-purple-900'
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold font-mono-capitol uppercase">
            <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
            Arena Poll Results
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950">
            How the Tributes Moved
          </h2>
          <p className="text-xs text-purple-600 font-mono-capitol">
            {totalVoted} of {totalTributes} tributes locked in a choice
          </p>
        </div>

        <div className="space-y-4">
          {rows.map((row) => {
            const pct = getPct(row.count, denominator);
            return (
              <div key={row.id} className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-purple-950">
                    <span className="text-xl">{row.icon}</span>
                    <span>
                      <span className="text-lg font-black font-mono text-orange-600">{pct}%</span> {row.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono-capitol text-purple-600 shrink-0">
                    {row.count} {row.count === 1 ? 'tribute' : 'tributes'}
                  </span>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-purple-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${row.barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {isGamemaker ? (
          <div className="pt-2 text-center">
            <button
              onClick={onRevealConsequences}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center justify-center gap-2 transition-all"
            >
              Reveal Consequences
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center pt-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold font-mono-capitol">
              Waiting for Gamemaker to reveal the outcomes...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

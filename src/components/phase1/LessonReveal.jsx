import React, { useState } from 'react';
import { Lightbulb, RotateCcw, ChevronDown, ChevronUp, ExternalLink, BookOpen } from 'lucide-react';

const PSYCHOLOGY_CARDS = [
  {
    number: '1',
    title: 'Risk perception',
    description: 'Risk judgments are influenced by social discussion and how people interpret danger.',
    presenterDetail:
      'Perlstein (2023) systematically reviewed how interpersonal discussion shapes risk perception. In the arena, how dangerous the Cornucopia feels depends on how we interpret the threat — not just the math.',
    citation: 'Perlstein, 2023',
    paperUrl: 'https://scholar.google.com/scholar?q=Perlstein+2023+Risk+perception+and+interpersonal+discussion+on+risk+systematic+literature+review',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 36 Q46 16 70 36 Q46 56 22 36 Z" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <circle cx="46" cy="36" r="7" fill="#5B21B6" />
        <path d="M90 18 L106 52 L74 52 Z" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.2" strokeLinejoin="round" />
        <text x="90" y="47" textAnchor="middle" fill="#C2410C" fontSize="14" fontWeight="bold">!</text>
      </svg>
    )
  },
  {
    number: '2',
    title: 'Social influence',
    description: 'Social norms can become particularly influential when people face uncertainty.',
    presenterDetail:
      'Bergquist & Ekelund (2025) explored how emotion regulation interacts with normative social influence under uncertainty. When the clock is ticking, what others appear to be doing pulls our choices.',
    citation: 'Bergquist & Ekelund, 2025',
    paperUrl: 'https://scholar.google.com/scholar?q=Bergquist+Ekelund+2025+role+of+emotion+regulation+in+normative+influence+under+uncertainty',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {[18, 40, 62, 102].map((x) => (
          <g key={x}>
            <circle cx={x} cy="24" r="6" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.8" />
            <path d={`M${x - 7} 48 C${x - 7} 36 ${x + 7} 36 ${x + 7} 48`} fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.8" />
            <path d={`M${x - 4} 57 L${x + 5} 57 M${x + 2} 54 L${x + 5} 57 L${x + 2} 60`} stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
        <circle cx="82" cy="24" r="6.5" fill="#F97316" />
        <path d="M74 48 C74 35 90 35 90 48" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
        <path d="M86 57 L77 57 M80 54 L77 57 L80 60" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    number: '3',
    title: 'Loss aversion',
    description: "People's sensitivity to losses interacts with social influence when making uncertain decisions.",
    presenterDetail:
      'Li et al. (2024) examined psychological and neural representations of loss aversion in social conformity — showing why fear of losing points (-5) often outweighs chasing the biggest reward (+20).',
    citation: 'Li et al., 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Li+2024+role+of+loss+aversion+in+social+conformity+psychological+and+neural+representations',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="60" y1="14" x2="60" y2="62" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="62" x2="78" y2="62" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="22" x2="98" y2="42" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="32" r="4" fill="#F97316" />
        <circle cx="26" cy="18" r="10" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <text x="26" y="22" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">+</text>
        <circle cx="94" cy="48" r="14" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.5" />
        <text x="94" y="53" textAnchor="middle" fill="#C2410C" fontSize="14" fontWeight="bold">−</text>
      </svg>
    )
  }
];

export default function LessonReveal({ isGamemaker, onBackToLobby }) {
  const [showScoring, setShowScoring] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
            <Lightbulb className="w-3.5 h-3.5" />
            Phase 1 Takeaway
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-cinzel text-purple-950 tracking-wide uppercase">
            RISK VS REWARD
          </h2>
          <p className="text-sm sm:text-base font-medium text-purple-700">
            What does psychology tell us about our decisions?
          </p>
        </div>

        {/* 3 Psychology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PSYCHOLOGY_CARDS.map((card) => (
            <div
              key={card.number}
              className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="bg-white rounded-xl border border-purple-100 p-3 flex items-center justify-center">
                {card.illustration}
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-base font-black font-cinzel text-purple-950">
                  {card.number}. {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-800 leading-relaxed">
                  {card.description}
                </p>
                {isGamemaker && (
                  <p className="text-[11px] text-purple-700 bg-white/90 border border-purple-200 rounded-xl p-2.5 leading-relaxed">
                    {card.presenterDetail}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-purple-100">
                <a
                  href={card.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono-capitol font-bold text-orange-700 hover:text-purple-900 underline underline-offset-2 transition-colors"
                >
                  <span>{card.citation}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Gamemaker In-Depth Presenter Guide */}
        {isGamemaker && (
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-1.5">
            <div className="text-[11px] font-black font-mono-capitol uppercase text-orange-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Gamemaker Presenter Notes
            </div>
            <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">
              When tributes decide whether to rush the Cornucopia, they are weighing potential rewards (+20 pts &amp; a Survival Tool) against possible losses (-5 pts). Under time pressure and uncertainty, they are also influenced by what other tributes appear to be doing — even when crowding a risky option makes it more dangerous.
            </p>
          </div>
        )}

        {/* Collapsible Scoring & Mechanics Dropdown */}
        <div className="border-t border-purple-100 pt-4">
          <button
            type="button"
            onClick={() => setShowScoring(!showScoring)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-50/60 hover:bg-purple-50 border border-purple-100 text-xs font-bold font-mono-capitol text-purple-700 transition-colors"
          >
            <span>Scoring &amp; Risk Mechanics</span>
            {showScoring ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showScoring && (
            <div className="mt-3 p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-white border border-orange-200">
                  <div className="text-lg">⚔️</div>
                  <div className="text-xs font-bold text-purple-950">Cornucopia</div>
                  <div className="text-[11px] text-orange-700">High Risk (50% base)</div>
                  <div className="text-[11px] font-mono text-purple-700">+20 pts + Tool if alive</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-purple-200">
                  <div className="text-lg">🎒</div>
                  <div className="text-xs font-bold text-purple-950">Outskirts</div>
                  <div className="text-[11px] text-purple-700">Medium Risk (25% base)</div>
                  <div className="text-[11px] font-mono text-purple-700">+16 pts if alive</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                  <div className="text-lg">🌲</div>
                  <div className="text-xs font-bold text-purple-950">The Woods</div>
                  <div className="text-[11px] text-emerald-700">Low Risk (0% base)</div>
                  <div className="text-[11px] font-mono text-purple-700">+12 pts guaranteed</div>
                </div>
              </div>

              <div className="text-[11px] text-purple-700 space-y-1 font-mono-capitol">
                <div><strong>But what makes us choose one option over another?</strong></div>
                <div><strong>Last-Second Danger:</strong> Picking Cornucopia or Outskirts in the final 5 seconds significantly increases risk</div>
                <div><strong>Speed Bonus:</strong> 0–5s (+3) • 6–10s (+2) • 11–20s (+1) • 21+s (+0)</div>
                <div><strong>If You Fall:</strong> -5 marks (not eliminated — you keep playing!)</div>
              </div>
            </div>
          )}
        </div>

        {isGamemaker ? (
          <div className="text-center pt-1">
            <button
              onClick={onBackToLobby}
              className="px-7 py-3 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Enter The Woods
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-purple-500 font-mono-capitol">
            Waiting for Gamemaker to continue...
          </div>
        )}
      </div>
    </div>
  );
}

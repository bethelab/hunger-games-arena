import React, { useState } from 'react';
import { Lightbulb, RotateCcw, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const PSYCHOLOGY_CARDS = [
  {
    number: '1',
    title: 'Loss aversion',
    description: 'We tend to feel losses more strongly than equivalent gains.',
    citation: 'Kahneman & Tversky, 1979',
    paperUrl: 'https://doi.org/10.2307/1914185',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Prospect-theory tilted balance scale: loss weighs heavier */}
        <line x1="60" y1="14" x2="60" y2="62" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="62" x2="78" y2="62" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="22" x2="98" y2="42" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="32" r="4" fill="#F97316" />
        {/* Gain side (higher, lighter) */}
        <circle cx="26" cy="18" r="10" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <text x="26" y="22" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">+</text>
        {/* Loss side (lower, heavier) */}
        <circle cx="94" cy="48" r="14" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.5" />
        <text x="94" y="53" textAnchor="middle" fill="#C2410C" fontSize="14" fontWeight="bold">−</text>
      </svg>
    )
  },
  {
    number: '2',
    title: 'Conformity',
    description: "Other people's decisions can influence our own, even when we disagree.",
    citation: 'Asch, 1956',
    paperUrl: 'https://doi.org/10.1037/h0093718',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Crowd arrows going right */}
        {[18, 40, 62, 102].map((x) => (
          <g key={x}>
            <circle cx={x} cy="24" r="6" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.8" />
            <path d={`M${x - 7} 48 C${x - 7} 36 ${x + 7} 36 ${x + 7} 48`} fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.8" />
            <path d={`M${x - 4} 57 L${x + 5} 57 M${x + 2} 54 L${x + 5} 57 L${x + 2} 60`} stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
        {/* Highlighted individual pulled / contrasting */}
        <circle cx="82" cy="24" r="6.5" fill="#F97316" />
        <path d="M74 48 C74 35 90 35 90 48" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
        <path d="M86 57 L77 57 M80 54 L77 57 L80 60" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    number: '3',
    title: 'Illusion of control',
    description: 'We can overestimate how much influence we have over uncertain outcomes.',
    citation: 'Langer, 1975',
    paperUrl: 'https://doi.org/10.1037/0022-3514.32.2.311',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Control strings above a random die */}
        <line x1="34" y1="12" x2="86" y2="12" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" />
        <line x1="46" y1="12" x2="50" y2="30" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="74" y1="12" x2="70" y2="30" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Tilted die representing chance */}
        <g transform="rotate(-8 60 44)">
          <rect x="44" y="28" width="32" height="32" rx="7" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2.5" />
          <circle cx="53" cy="37" r="2.5" fill="#EA580C" />
          <circle cx="67" cy="37" r="2.5" fill="#EA580C" />
          <circle cx="60" cy="44" r="2.5" fill="#7C3AED" />
          <circle cx="53" cy="51" r="2.5" fill="#EA580C" />
          <circle cx="67" cy="51" r="2.5" fill="#EA580C" />
        </g>
      </svg>
    )
  }
];

export default function LessonReveal({ isGamemaker, onBackToLobby }) {
  const [showScoring, setShowScoring] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-7">
        {/* Title & Subtitle */}
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

        {/* 3 Psychology Cards (Center of Attention) */}
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

        {/* Collapsible Scoring & Risk Breakdown Dropdown (Tucked Below) */}
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
                  <div className="text-[11px] text-orange-700">High Risk (20% base)</div>
                  <div className="text-[11px] font-mono text-purple-700">+20 pts if alive</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-purple-200">
                  <div className="text-lg">🎒</div>
                  <div className="text-xs font-bold text-purple-950">Outskirts</div>
                  <div className="text-[11px] text-purple-700">Medium Risk (10% base)</div>
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
                <div><strong>Scaled Risk:</strong> Base Risk × (Tributes on Option ÷ Total Tributes)</div>
                <div><strong>Last-Second Danger:</strong> Deciding in the final 5 seconds adds +3% to +18% elimination risk</div>
                <div><strong>Speed Bonus:</strong> 0–5s (+3) • 6–10s (+2) • 11–20s (+1) • 21+s (+0)</div>
                <div><strong>Eliminated:</strong> -5 pts (no speed bonus), but you stay in the game!</div>
              </div>
            </div>
          )}
        </div>

        {/* Gamemaker Return / Tribute Wait */}
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

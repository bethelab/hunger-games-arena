import React, { useState } from 'react';
import { Lightbulb, Trophy, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const PHASE5_CARDS = [
  {
    number: '1',
    title: 'The Halo Effect',
    description: "One positive characteristic can influence how we judge someone's other qualities.",
    citation: 'Thorndike, 1920',
    paperUrl: 'https://doi.org/10.1037/h0071663',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glowing halo above a silhouette */}
        <ellipse cx="60" cy="16" rx="18" ry="5" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.5" />
        <circle cx="60" cy="34" r="10" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <path d="M44 58 C44 45 76 45 76 58" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" />
      </svg>
    )
  },
  {
    number: '2',
    title: 'Elaboration Likelihood Model',
    description: 'We can be persuaded by strong arguments or by presentation cues and emotions.',
    citation: 'Petty & Cacioppo, 1986',
    paperUrl: 'https://doi.org/10.1016/S0065-2601(08)60214-2',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Two persuasion routes: logic vs style */}
        <path d="M22 22 L92 22" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="34" cy="22" r="5" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <text x="64" y="17" textAnchor="middle" fill="#5B21B6" fontSize="8" fontWeight="bold">LOGIC</text>
        <path d="M22 46 Q46 34 60 46 T92 46" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
        <text x="64" y="61" textAnchor="middle" fill="#C2410C" fontSize="8" fontWeight="bold">STYLE</text>
      </svg>
    )
  },
  {
    number: '3',
    title: 'Impression Management',
    description: 'We adjust how we present ourselves to influence how others perceive us.',
    citation: 'Goffman, 1959',
    paperUrl: 'https://psycnet.apa.org/record/1959-15044-000',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Two theatre masks */}
        <circle cx="46" cy="34" r="16" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <path d="M40 37 Q46 43 52 37" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="74" cy="34" r="16" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
        <path d="M68 38 Q74 32 80 38" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
];

export default function Phase5Lesson({ isGamemaker, onShowFinale }) {
  const [showScript, setShowScript] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
            <Lightbulb className="w-3.5 h-3.5" />
            Phase 5 Takeaway
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-cinzel text-purple-950 tracking-wide uppercase">
            THE POWER OF PERCEPTION
          </h2>
          <p className="text-sm sm:text-base font-medium text-purple-700">
            Why do some people naturally attract more attention and support?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PHASE5_CARDS.map((card) => (
            <div
              key={card.number}
              className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="bg-white rounded-xl border border-purple-100 p-2.5 flex items-center justify-center">
                {card.illustration}
              </div>

              <div className="space-y-1.5 flex-1">
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

        <p className="text-center text-xs sm:text-sm font-bold text-purple-900 font-mono-capitol">
          Being capable and being perceived as capable are not always the same thing.
        </p>

        {/* Gamemaker-Only Collapsible Speaking Script */}
        {isGamemaker && (
          <div className="border-t border-purple-100 pt-3">
            <button
              type="button"
              onClick={() => setShowScript(!showScript)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-purple-50/60 hover:bg-purple-50 border border-purple-100 text-xs font-bold font-mono-capitol text-purple-700 transition-colors"
            >
              <span>Gamemaker Speaking Script (Optional)</span>
              {showScript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showScript && (
              <div className="mt-2.5 p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-xs text-purple-900 space-y-2 leading-relaxed">
                <p>
                  &ldquo;This round was about persuasion and how we influence the way other people see us. With the Halo Effect, a single positive impression like confidence or charisma can influence how we judge someone&apos;s other qualities.&rdquo;
                </p>
                <p>
                  &ldquo;Think about who you voted for: did you choose the person with the strongest argument, or the person who made the best impression? Sometimes the way we communicate our abilities can be just as influential as the abilities themselves.&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {isGamemaker ? (
          <div className="text-center pt-1">
            <button
              onClick={onShowFinale}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all"
            >
              <Trophy className="w-4 h-4" />
              Crown the Victor &amp; Final Leaderboard
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-purple-500 font-mono-capitol">
            Waiting for Gamemaker to announce the Victor...
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Lightbulb, RotateCcw, ExternalLink, BookOpen } from 'lucide-react';

const PHASE2_CARDS = [
  {
    number: '1',
    title: 'Cooperation & social dilemmas',
    description: 'Higher-trust contexts encourage people to choose collective solutions over going alone.',
    presenterDetail:
      'Lo Iacono, Sonmez & Fairbrother (2024) ran a preregistered experiment (n = 371) showing that trusting contexts significantly increase collective solutions in social dilemmas.',
    citation: 'Lo Iacono, Sonmez & Fairbrother, 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Lo+Iacono+Sonmez+Fairbrother+2024+effect+of+trusting+contexts+in+social+dilemmas',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="26" r="10" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <circle cx="80" cy="26" r="10" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
        <path d="M50 26 L70 26" stroke="#F97316" strokeWidth="2.5" strokeDasharray="3 2" />
        <path d="M26 56 C26 42 54 42 54 56" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" />
        <path d="M66 56 C66 42 94 42 94 56" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
      </svg>
    )
  },
  {
    number: '2',
    title: 'Social identity & group loyalty',
    description: 'People cooperate more readily with members of their own group — even newly formed alliances.',
    presenterDetail:
      'Imada, Mifune & Shimizu (2024) explored the psychological mechanisms behind ingroup favouritism in cooperation, showing how quickly group membership creates loyalty.',
    citation: 'Imada, Mifune & Shimizu, 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Imada+Mifune+Shimizu+2024+Psychological+mechanisms+underlying+ingroup+favouritism+in+cooperation',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="52" cy="36" r="24" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="44" cy="36" r="7" fill="#7C3AED" />
        <circle cx="60" cy="36" r="7" fill="#F97316" />
        <circle cx="96" cy="36" r="7" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.8" />
      </svg>
    )
  },
  {
    number: '3',
    title: 'Trust under uncertainty',
    description: 'Trust expectations shift quickly in uncertain situations and during collective threats.',
    presenterDetail:
      'Composto et al. (2025) examined changing norms of trust, showing how shared threats and uncertainty reshape whether people expect others to cooperate or defect.',
    citation: 'Composto et al., 2025',
    paperUrl: 'https://scholar.google.com/scholar?q=Composto+2025+Changing+norms+of+trust',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 12 L88 24 V40 C88 53 75 61 60 66 C45 61 32 53 32 40 V24 L60 12 Z" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.2" />
        <path d="M49 38 L57 46 L72 30" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

export default function Phase2Lesson({ isGamemaker, onBackToWoods }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
            <Lightbulb className="w-3.5 h-3.5" />
            Phase 2 Takeaway
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-cinzel text-purple-950 tracking-wide uppercase">
            TRUST VS INDEPENDENCE
          </h2>
          <p className="text-sm sm:text-base font-medium text-purple-700">
            Why do we choose to trust — or walk away?
          </p>
        </div>

        {/* 3 Clean Visual Cards (Matching Phase 1 Structure) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PHASE2_CARDS.map((card) => (
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

        {isGamemaker && (
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-1.5">
            <div className="text-[11px] font-black font-mono-capitol uppercase text-orange-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Gamemaker Presenter Notes
            </div>
            <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">
              Participants must decide whether working with another tribute is worth the risk. This research explains why trust expectations, group membership, and perceived benefits vs. costs drive cooperation — and why alliances create instant loyalty even with random partners.
            </p>
          </div>
        )}

        {isGamemaker ? (
          <div className="text-center pt-1">
            <button
              onClick={onBackToWoods}
              className="px-7 py-3 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Return to The Woods
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

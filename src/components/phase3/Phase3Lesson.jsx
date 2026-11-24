import React from 'react';
import { Lightbulb, RotateCcw, ExternalLink, MessageCircle } from 'lucide-react';

const PHASE3_CARDS = [
  {
    number: '1',
    title: 'Present bias',
    description: 'We often favour immediate rewards over future benefits.',
    citation: 'Laibson, 1997',
    paperUrl: 'https://doi.org/10.1162/003355397555253',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Big "NOW" circle vs smaller "LATER" circle */}
        <circle cx="38" cy="36" r="18" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.5" />
        <text x="38" y="40" textAnchor="middle" fill="#C2410C" fontSize="10" fontWeight="bold">NOW</text>
        <path d="M62 36 L76 36" stroke="#A78BFA" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="92" cy="36" r="11" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <text x="92" y="39" textAnchor="middle" fill="#5B21B6" fontSize="8" fontWeight="bold">LATER</text>
      </svg>
    )
  },
  {
    number: '2',
    title: 'Risk perception',
    description: "Our feelings about danger don't always match the actual level of risk.",
    citation: 'Slovic, 1987',
    paperUrl: 'https://doi.org/10.1126/science.3563507',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Eye looking through tinted lens at warning triangle */}
        <path d="M20 34 Q42 14 64 34 Q42 54 20 34 Z" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <circle cx="42" cy="34" r="7" fill="#5B21B6" />
        <path d="M84 18 L102 50 L66 50 Z" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.2" strokeLinejoin="round" />
        <text x="84" y="45" textAnchor="middle" fill="#C2410C" fontSize="14" fontWeight="bold">!</text>
      </svg>
    )
  },
  {
    number: '3',
    title: 'Effort justification',
    description: 'We can place greater value on something simply because we worked hard to obtain it.',
    citation: 'Festinger, 1957',
    paperUrl: 'https://psycnet.apa.org/record/1958-00265-000',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Steep climb leading to a shining star */}
        <path d="M18 54 L46 38 L66 42 L94 18" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="94" cy="18" r="9" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
        <text x="94" y="22" textAnchor="middle" fill="#EA580C" fontSize="11" fontWeight="bold">★</text>
      </svg>
    )
  }
];

export default function Phase3Lesson({ isGamemaker, onBackToWoods }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
            <Lightbulb className="w-3.5 h-3.5" />
            Phase 3 Takeaway
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-cinzel text-purple-950 tracking-wide uppercase">
            THE PSYCHOLOGY OF CHOICE
          </h2>
          <p className="text-sm sm:text-base font-medium text-purple-700">
            Why do we choose convenience over caution?
          </p>
        </div>

        {/* 3 Psychology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PHASE3_CARDS.map((card) => (
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

        {/* Key Summary Line */}
        <p className="text-center text-xs sm:text-sm font-bold text-purple-900 font-mono-capitol">
          Convenience, effort and confidence can all influence our decisions.
        </p>

        {/* Discussion Question */}
        <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-[11px] font-black font-mono-capitol uppercase text-orange-700">
              Discussion Question
            </div>
            <p className="text-xs sm:text-sm text-purple-950 italic leading-relaxed">
              &ldquo;Did you choose the nearby water because you wanted to save time, or the distant water because you believed more effort meant a better outcome? And did you trust your instincts when deciding whether to purify it?&rdquo;
            </p>
          </div>
        </div>

        {/* Gamemaker Return / Tribute Wait */}
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

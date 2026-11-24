import React, { useState } from 'react';
import { Lightbulb, RotateCcw, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const PHASE4_CARDS = [
  {
    number: '1',
    title: 'Cognitive flexibility',
    description: 'The ability to adjust our thinking and approach when situations change.',
    citation: 'Monsell, 2003',
    paperUrl: 'https://doi.org/10.1016/S1364-6613(03)00028-7',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Path branching around an obstacle */}
        <path d="M18 34 L50 34" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="52" y="25" width="16" height="18" rx="3" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
        <path d="M44 34 C48 16 74 16 86 24 L98 24" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M93 19 L99 24 L93 29" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    number: '2',
    title: 'Stress and coping',
    description: 'How we interpret and respond to challenging situations influences our behaviour.',
    citation: 'Lazarus & Folkman, 1984',
    paperUrl: 'https://psycnet.apa.org/record/1984-97799-000',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Same lightning bolt -> two different mind responses */}
        <path d="M60 10 L53 26 L61 26 L55 38" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="48" r="11" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
        <path d="M27 50 Q32 44 37 50" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="88" cy="48" r="11" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
        <path d="M83 47 Q88 53 93 47" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    number: '3',
    title: 'Escalation of commitment',
    description: "We sometimes continue with a failing decision because we've already invested in it.",
    citation: 'Staw, 1976',
    paperUrl: 'https://doi.org/10.1016/0030-5073(76)90005-2',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Arrow pushing into a blocked wall */}
        <path d="M20 34 L74 34" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
        <path d="M68 28 L75 34 L68 40" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="82" y="14" width="12" height="40" rx="3" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.5" />
      </svg>
    )
  }
];

export default function Phase4Lesson({ isGamemaker, onBackToWoods }) {
  const [showScript, setShowScript] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-6">
        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
            <Lightbulb className="w-3.5 h-3.5" />
            Phase 4 Takeaway
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-cinzel text-purple-950 tracking-wide uppercase">
            ADAPT OR FALL BEHIND
          </h2>
          <p className="text-sm sm:text-base font-medium text-purple-700">
            How do we respond when things don&apos;t go to plan?
          </p>
        </div>

        {/* 3 Psychology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PHASE4_CARDS.map((card) => (
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
          Knowing when to change direction is a strength.
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
                  &ldquo;This round was all about adaptability and how we respond when things don&apos;t go according to plan.
                  One interesting psychological concept is escalation of commitment — people sometimes continue with a decision even when it&apos;s no longer working, simply because they&apos;ve already invested time, effort or resources into it.&rdquo;
                </p>
                <p>
                  &ldquo;Changing your mind isn&apos;t a sign of weakness — sometimes it&apos;s a sign that you&apos;ve recognised the situation has changed. Don&apos;t become so attached to your original plan that you fail to recognise when it&apos;s time for a new one.&rdquo;
                </p>
              </div>
            )}
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

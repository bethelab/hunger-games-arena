import React, { useState } from 'react';
import { Lightbulb, RotateCcw, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const PHASE4_CARDS = [
  {
    number: '1',
    title: 'Cognitive flexibility',
    description: 'How people adjust their readiness to switch tasks and strategies when situations change.',
    presenterDetail:
      'Egner & Siqi-Liu (2024) reviewed task-switching studies showing how we regulate cognitive flexibility — shifting strategy carries a mental cost, yet staying rigid can be costly.',
    citation: 'Egner & Siqi-Liu, 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Egner+Siqi-Liu+2024+Insights+into+control+over+cognitive+flexibility+from+studies+of+task-switching',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 34 L50 34" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="52" y="25" width="16" height="18" rx="3" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
        <path d="M44 34 C48 16 74 16 86 24 L98 24" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M93 19 L99 24 L93 29" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    number: '2',
    title: 'Stress & decision-making',
    description: 'Acute stress can impair decision quality across varying levels of decision complexity.',
    presenterDetail:
      'Doroc, Yadav & Murawski (2025) tested how acute stress affects decision-making quality, explaining why sudden twists and short countdowns cause very different reactions under pressure.',
    citation: 'Doroc, Yadav & Murawski, 2025',
    paperUrl: 'https://scholar.google.com/scholar?q=Doroc+Yadav+Murawski+2025+Acute+stress+impairs+decision-making+at+varying+levels+of+decision+complexity',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    presenterDetail:
      'A 2025 review of cognitive biases in strategic decision-making highlights how escalation of commitment and loss aversion push people to stick with a blocked plan instead of pivoting.',
    citation: 'Strategic Decision-Making Review, 2025',
    paperUrl: 'https://scholar.google.com/scholar?q=A+review+of+cognitive+biases+in+strategic+decision+making+2025+escalation+of+commitment',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
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

        <p className="text-center text-xs sm:text-sm font-bold text-purple-900 font-mono-capitol">
          Knowing when to change direction is a strength.
        </p>

        {isGamemaker && (
          <div className="space-y-3 border-t border-purple-100 pt-3">
            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-1">
              <div className="text-[11px] font-black font-mono-capitol uppercase text-orange-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Gamemaker Presenter Notes
              </div>
              <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">
                When the Gamemakers change the arena, participants must decide whether to stick with their original strategy or change direction — a vivid demonstration of how acute stress and commitment bias shape decisions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowScript(!showScript)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-purple-50/60 hover:bg-purple-50 border border-purple-100 text-xs font-bold font-mono-capitol text-purple-700 transition-colors"
            >
              <span>Gamemaker Speaking Script (Optional)</span>
              {showScript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showScript && (
              <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-xs text-purple-900 space-y-2 leading-relaxed">
                <p>
                  &ldquo;This round was all about adaptability and how we respond when things don&apos;t go according to plan. With escalation of commitment, people sometimes continue with a decision even when it&apos;s no longer working, simply because they&apos;ve already invested in it.&rdquo;
                </p>
                <p>
                  &ldquo;Changing your mind isn&apos;t a sign of weakness — sometimes it&apos;s a sign that you&apos;ve recognised the situation has changed.&rdquo;
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

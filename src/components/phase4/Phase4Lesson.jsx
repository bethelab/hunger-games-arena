import React from 'react';
import TakeawayLayout from '../TakeawayLayout';
import { RotateCcw } from 'lucide-react';

const PHASE4_PAPERS = [
  {
    title: 'Cognitive flexibility',
    description: 'How people adjust their readiness to switch tasks and strategies when situations change.',
    presenterDetail:
      'Egner & Siqi-Liu (2024) reviewed task-switching studies showing how we regulate cognitive flexibility — shifting strategy carries a mental cost, yet staying rigid can be costly.',
    citation: 'Egner & Siqi-Liu, 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Egner+Siqi-Liu+2024+Insights+into+control+over+cognitive+flexibility+from+studies+of+task-switching',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 34 L50 34" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="52" y="25" width="16" height="18" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <path d="M44 34 C48 16 74 16 86 24 L98 24" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M93 19 L99 24 L93 29" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'Stress & decision-making',
    description: 'Acute stress can impair decision quality across varying levels of decision complexity.',
    presenterDetail:
      'Doroc, Yadav & Murawski (2025) tested how acute stress affects decision-making quality, explaining why sudden crises and short countdowns cause very different reactions under pressure.',
    citation: 'Doroc, Yadav & Murawski, 2025',
    paperUrl: 'https://scholar.google.com/scholar?q=Doroc+Yadav+Murawski+2025+Acute+stress+impairs+decision-making+at+varying+levels+of+decision+complexity',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 10 L53 26 L61 26 L55 38" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="48" r="11" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <circle cx="88" cy="48" r="11" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
      </svg>
    )
  },
  {
    title: 'Escalation of commitment',
    description: "We sometimes continue with a failing decision because we've already invested in it.",
    presenterDetail:
      'A 2025 review of cognitive biases in strategic decision-making highlights how escalation of commitment and loss aversion push people to take desperate risks instead of stepping back.',
    citation: 'Strategic Decision-Making Review, 2025',
    paperUrl: 'https://scholar.google.com/scholar?q=A+review+of+cognitive+biases+in+strategic+decision+making+2025+escalation+of+commitment',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 34 L74 34" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
        <path d="M68 28 L75 34 L68 40" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="82" y="14" width="12" height="40" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
      </svg>
    )
  }
];

export default function Phase4Lesson({ isGamemaker, selectedTopicIndex, takeawayHidden = false, onSelectTopic, onToggleHidden, onBackToWoods }) {
  return (
    <TakeawayLayout
      phaseLabel="Phase 4 • Fire & The Feast"
      title="ADAPT OR FALL BEHIND"
      subtitle="How do we respond when things don't go to plan?"
      closingLine="Knowing when to change direction — or walk away from a trap — is a strength."
      papers={PHASE4_PAPERS}
      selectedIndex={selectedTopicIndex}
      takeawayHidden={takeawayHidden}
      isGamemaker={isGamemaker}
      onSelectTopic={onSelectTopic}
      onToggleHidden={onToggleHidden}
      presenterNote="Under acute stress (the Fire) and high-stakes bait (The Feast), our instincts can pull us toward familiar habits or desperate gambles. Adapting cleanly under pressure means pausing to evaluate what actually helps you survive."
      actionButton={
        <button
          onClick={onBackToWoods}
          className="px-7 py-3 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Resume Game: Return to The Woods
        </button>
      }
    />
  );
}

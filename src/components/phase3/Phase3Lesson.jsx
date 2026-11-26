import React from 'react';
import TakeawayLayout from '../TakeawayLayout';
import { RotateCcw } from 'lucide-react';

const PHASE3_PAPERS = [
  {
    title: 'Present bias',
    description: 'We often favour immediate rewards and convenience over future benefits.',
    presenterDetail:
      "Taş, Maknoon & Rezaei (2026) systematically reviewed intertemporal decision-making biases — showing why saving time right now feels more appealing than waiting.",
    citation: 'Taş, Maknoon & Rezaei, 2026',
    paperUrl: 'https://scholar.google.com/scholar?q=Tas+Maknoon+Rezaei+2026+Time+Influence+Systematic+Review+of+Biases+in+Intertemporal+Decision-Making',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="38" cy="36" r="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
        <text x="38" y="40" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="bold">NOW</text>
        <path d="M62 36 L76 36" stroke="#64748B" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="92" cy="36" r="11" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
        <text x="92" y="39" textAnchor="middle" fill="#115E59" fontSize="8" fontWeight="bold">LATER</text>
      </svg>
    )
  },
  {
    title: 'Risk perception',
    description: "Our feelings about danger don't always match the actual level of risk.",
    presenterDetail:
      'Perlstein (2023) explored how people interpret and discuss uncertain risks — clear mountain water feels safe, while travel danger feels less obvious until it hits.',
    citation: 'Perlstein, 2023',
    paperUrl: 'https://scholar.google.com/scholar?q=Perlstein+2023+Risk+perception+and+interpersonal+discussion+on+risk',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 34 Q42 14 64 34 Q42 54 20 34 Z" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
        <circle cx="42" cy="34" r="7" fill="#115E59" />
        <path d="M84 18 L102 50 L66 50 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" strokeLinejoin="round" />
        <text x="84" y="45" textAnchor="middle" fill="#B45309" fontSize="14" fontWeight="bold">!</text>
      </svg>
    )
  },
  {
    title: 'Effort & reward value',
    description: 'How effort changes how much we value an outcome depends partly on perceived control.',
    presenterDetail:
      'Harmon-Jones et al. (2024) found effort-reward valuation depends on perceived control. Relatedly, Campbell, Wang & Inzlicht (2025, 6 studies, n = 2,883) showed exerting effort increases perceived meaning — though not via simple post-hoc justification.',
    citation: 'Harmon-Jones et al., 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Harmon-Jones+2024+Does+effort+increase+or+decrease+reward+valuation',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 54 L46 38 L66 42 L94 18" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="94" cy="18" r="9" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <text x="94" y="22" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="bold">★</text>
      </svg>
    )
  }
];

export default function Phase3Lesson({ isGamemaker, selectedTopicIndex, onSelectTopic, onBackToWoods }) {
  return (
    <TakeawayLayout
      phaseLabel="Phase 3 • Finding Water"
      title="THE PSYCHOLOGY OF CHOICE"
      subtitle="Why do we choose convenience over caution?"
      closingLine="Convenience, effort and confidence can all influence our decisions."
      papers={PHASE3_PAPERS}
      selectedIndex={selectedTopicIndex}
      isGamemaker={isGamemaker}
      onSelectTopic={onSelectTopic}
      presenterNote="Related finding: Campbell, Wang & Inzlicht (2025) found across 6 studies (2,883 participants) that exerting more effort increases how meaningful an activity feels — though working harder to reach a distant stream does not automatically eliminate risk."
      actionButton={
        <button
          onClick={onBackToWoods}
          className="px-7 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Resume Game — Return to The Woods
        </button>
      }
    />
  );
}

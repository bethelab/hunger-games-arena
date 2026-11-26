import React from 'react';
import TakeawayLayout from '../TakeawayLayout';
import { Trophy } from 'lucide-react';

const PHASE5_PAPERS = [
  {
    title: 'The Halo Effect',
    description: "Impressions of one characteristic can influence how we judge someone's other qualities.",
    presenterDetail:
      'Mattavelli et al. (2026) examined asymmetric generalizations in social judgment ("If Immoral Then Unable"), showing how a single trait impression spills over into capability ratings.',
    citation: 'Mattavelli et al., 2026',
    paperUrl: 'https://scholar.google.com/scholar?q=Mattavelli+2026+If+Immoral+Then+Unable+Asymmetric+Generalizations+in+Social+Judgment',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="16" rx="18" ry="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
        <circle cx="60" cy="34" r="10" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
        <path d="M44 58 C44 45 76 45 76 58" fill="#99F6E4" stroke="#0F766E" strokeWidth="2" />
      </svg>
    )
  },
  {
    title: 'Elaboration Likelihood Model',
    description: 'Arguments, credibility, message style, and audience factors all shape persuasion.',
    presenterDetail:
      'Petty (2021) applied the Elaboration Likelihood Model to show how both central-route reasoning and peripheral-route presentation cues drive whether an audience is convinced.',
    citation: 'Petty, 2021',
    paperUrl: 'https://scholar.google.com/scholar?q=Petty+2021+Persuasion+amidst+a+pandemic+Insights+from+the+Elaboration+Likelihood+Model',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 22 L92 22" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
        <text x="58" y="17" textAnchor="middle" fill="#115E59" fontSize="8" fontWeight="bold">LOGIC</text>
        <path d="M22 46 Q46 34 60 46 T92 46" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <text x="58" y="61" textAnchor="middle" fill="#B45309" fontSize="8" fontWeight="bold">STYLE</text>
      </svg>
    )
  },
  {
    title: 'First impressions',
    description: 'First impressions form rapidly and strongly influence how others evaluate and support us.',
    presenterDetail:
      'Swider et al. (2026) meta-analysed 204 independent samples across 145 studies on First Impressions at Work, confirming how powerfully early impressions shape real-world outcomes.',
    citation: 'Swider et al., 2026',
    paperUrl: 'https://scholar.google.com/scholar?q=Swider+2026+First+Impressions+at+Work+Meta-Analytic+Review',
    illustration: (
      <svg viewBox="0 0 120 68" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="46" cy="34" r="16" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
        <path d="M40 37 Q46 43 52 37" stroke="#115E59" strokeWidth="2" strokeLinecap="round" />
        <circle cx="74" cy="34" r="16" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <path d="M68 38 Q74 32 80 38" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
];

export default function Phase5Lesson({ isGamemaker, selectedTopicIndex, onSelectTopic, onShowFinale }) {
  return (
    <TakeawayLayout
      phaseLabel="Phase 5 • Sponsors"
      title="THE POWER OF PERCEPTION"
      subtitle="Why do some people naturally attract more attention and support?"
      closingLine="Being capable and being perceived as capable are not always the same thing."
      papers={PHASE5_PAPERS}
      selectedIndex={selectedTopicIndex}
      isGamemaker={isGamemaker}
      onSelectTopic={onSelectTopic}
      presenterNote="Because sponsor votes were anonymous, notice how tone, clarity, and argument quality shaped who stood out. Sometimes how we communicate our abilities is just as influential as the abilities themselves."
      actionButton={
        <button
          onClick={onShowFinale}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-800 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-lg inline-flex items-center gap-2 transition-all"
        >
          <Trophy className="w-4 h-4" />
          Crown the Victor &amp; Final Leaderboard
        </button>
      }
    />
  );
}

import React from 'react';
import TakeawayLayout from '../TakeawayLayout';
import { RotateCcw } from 'lucide-react';

const PHASE2_PAPERS = [
  {
    title: 'Cooperation & social dilemmas',
    description: 'Higher-trust contexts encourage people to choose collective solutions over going alone.',
    presenterDetail:
      'Lo Iacono, Sonmez & Fairbrother (2024) ran a preregistered experiment (n = 371) showing that trusting contexts significantly increase collective solutions in social dilemmas.',
    citation: 'Lo Iacono, Sonmez & Fairbrother, 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Lo+Iacono+Sonmez+Fairbrother+2024+effect+of+trusting+contexts+in+social+dilemmas',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="26" r="10" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
        <circle cx="80" cy="26" r="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <path d="M50 26 L70 26" stroke="#0F766E" strokeWidth="2.5" strokeDasharray="3 2" />
        <path d="M26 56 C26 42 54 42 54 56" fill="#99F6E4" stroke="#0F766E" strokeWidth="2" />
        <path d="M66 56 C66 42 94 42 94 56" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      </svg>
    )
  },
  {
    title: 'Social identity & group loyalty',
    description: 'People cooperate more readily with members of their own group — even newly formed alliances.',
    presenterDetail:
      'Imada, Mifune & Shimizu (2024) explored the psychological mechanisms behind ingroup favouritism in cooperation, showing how quickly group membership creates loyalty.',
    citation: 'Imada, Mifune & Shimizu, 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Imada+Mifune+Shimizu+2024+Psychological+mechanisms+underlying+ingroup+favouritism+in+cooperation',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="52" cy="36" r="24" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="44" cy="36" r="7" fill="#0F766E" />
        <circle cx="60" cy="36" r="7" fill="#D97706" />
        <circle cx="96" cy="36" r="7" fill="#CBD5E1" stroke="#334155" strokeWidth="1.8" />
      </svg>
    )
  },
  {
    title: 'Trust under uncertainty',
    description: 'Trust expectations shift quickly in uncertain situations and during collective threats.',
    presenterDetail:
      'Composto et al. (2025) examined changing norms of trust, showing how shared threats and uncertainty reshape whether people expect others to cooperate or defect.',
    citation: 'Composto et al., 2025',
    paperUrl: 'https://scholar.google.com/scholar?q=Composto+2025+Changing+norms+of+trust',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 12 L88 24 V40 C88 53 75 61 60 66 C45 61 32 53 32 40 V24 L60 12 Z" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2.2" />
        <path d="M49 38 L57 46 L72 30" stroke="#115E59" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

export default function Phase2Lesson({ isGamemaker, selectedTopicIndex, takeawayHidden = false, onSelectTopic, onToggleHidden, onBackToWoods }) {
  return (
    <TakeawayLayout
      phaseLabel="Phase 2 • Alliances"
      title="TRUST VS INDEPENDENCE"
      subtitle="Why do we choose to trust — or walk away?"
      papers={PHASE2_PAPERS}
      selectedIndex={selectedTopicIndex}
      takeawayHidden={takeawayHidden}
      isGamemaker={isGamemaker}
      onSelectTopic={onSelectTopic}
      onToggleHidden={onToggleHidden}
      presenterNote="Participants must decide whether working with another tribute is worth the risk. This research explains why trust expectations, group membership, and perceived benefits vs. costs drive cooperation."
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

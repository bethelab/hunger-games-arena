import React, { useState } from 'react';
import TakeawayLayout from '../TakeawayLayout';
import { RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const PHASE1_PAPERS = [
  {
    title: 'Risk perception',
    description: 'Risk judgments are influenced by social discussion and how people interpret danger.',
    presenterDetail:
      'Perlstein (2023) systematically reviewed how interpersonal discussion shapes risk perception. In the arena, how dangerous the Cornucopia feels depends on how we interpret the threat — not just the math.',
    citation: 'Perlstein, 2023',
    paperUrl: 'https://scholar.google.com/scholar?q=Perlstein+2023+Risk+perception+and+interpersonal+discussion+on+risk+systematic+literature+review',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 36 Q46 16 70 36 Q46 56 22 36 Z" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
        <circle cx="46" cy="36" r="7" fill="#115E59" />
        <path d="M90 18 L106 52 L74 52 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" strokeLinejoin="round" />
        <text x="90" y="47" textAnchor="middle" fill="#B45309" fontSize="14" fontWeight="bold">!</text>
      </svg>
    )
  },
  {
    title: 'Social influence',
    description: 'Social norms can become particularly influential when people face uncertainty.',
    presenterDetail:
      'Bergquist & Ekelund (2025) explored how emotion regulation interacts with normative social influence under uncertainty. When the clock is ticking, what others appear to be doing pulls our choices.',
    citation: 'Bergquist & Ekelund, 2025',
    paperUrl: 'https://scholar.google.com/scholar?q=Bergquist+Ekelund+2025+role+of+emotion+regulation+in+normative+influence+under+uncertainty',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {[18, 40, 62, 102].map((x) => (
          <g key={x}>
            <circle cx={x} cy="24" r="6" fill="#CBD5E1" stroke="#334155" strokeWidth="1.8" />
            <path d={`M${x - 7} 48 C${x - 7} 36 ${x + 7} 36 ${x + 7} 48`} fill="#E2E8F0" stroke="#334155" strokeWidth="1.8" />
          </g>
        ))}
        <circle cx="82" cy="24" r="6.5" fill="#0F766E" />
        <path d="M74 48 C74 35 90 35 90 48" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
      </svg>
    )
  },
  {
    title: 'Loss aversion',
    description: "People's sensitivity to losses interacts with social influence when making uncertain decisions.",
    presenterDetail:
      'Li et al. (2024) examined psychological and neural representations of loss aversion in social conformity — showing why fear of losing points (-5) often outweighs chasing the biggest reward (+20).',
    citation: 'Li et al., 2024',
    paperUrl: 'https://scholar.google.com/scholar?q=Li+2024+role+of+loss+aversion+in+social+conformity+psychological+and+neural+representations',
    illustration: (
      <svg viewBox="0 0 120 72" className="w-full h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="60" y1="14" x2="60" y2="62" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="62" x2="78" y2="62" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="22" x2="98" y2="42" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="26" cy="18" r="10" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
        <text x="26" y="22" textAnchor="middle" fill="#115E59" fontSize="11" fontWeight="bold">+</text>
        <circle cx="94" cy="48" r="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
        <text x="94" y="53" textAnchor="middle" fill="#B45309" fontSize="14" fontWeight="bold">−</text>
      </svg>
    )
  }
];

export default function LessonReveal({ isGamemaker, selectedTopicIndex, onSelectTopic, onBackToLobby }) {
  const [showScoring, setShowScoring] = useState(false);

  return (
    <TakeawayLayout
      phaseLabel="Phase 1 • The Cornucopia"
      title="RISK VS REWARD"
      subtitle="What does psychology tell us about our decisions?"
      papers={PHASE1_PAPERS}
      selectedIndex={selectedTopicIndex}
      isGamemaker={isGamemaker}
      onSelectTopic={onSelectTopic}
      presenterNote="When tributes decide whether to rush the Cornucopia, they weigh potential rewards (+20 pts & a Survival Tool) against possible losses (-5 marks). Under uncertainty, they are also influenced by what other tributes appear to be doing."
      extraBottom={
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowScoring(!showScoring)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold font-mono text-slate-600 transition-colors"
          >
            <span>Scoring &amp; Risk Mechanics</span>
            {showScoring ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showScoring && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1 font-mono">
              <div><strong>But what makes us choose one option over another?</strong></div>
              <div><strong>Cornucopia:</strong> +20 pts + Tool (50% base risk) • <strong>Outskirts:</strong> +16 pts (25% base, 10% min) • <strong>Woods:</strong> +12 pts (0% risk)</div>
              <div><strong>Speed Bonus:</strong> 0–5s (+3) • 6–10s (+2) • 11–20s (+1) • <strong>Fallen:</strong> -5 marks (still playing!)</div>
            </div>
          )}
        </div>
      }
      actionButton={
        <button
          onClick={onBackToLobby}
          className="px-7 py-3 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Resume Game: Enter The Woods
        </button>
      }
    />
  );
}

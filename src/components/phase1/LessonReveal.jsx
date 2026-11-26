import React from 'react';
import TakeawayLayout from '../TakeawayLayout';
import { RotateCcw } from 'lucide-react';

const TIME_PRESSURE_SLIDES = [
  {
    badge: '1 / 5 • The Central Question',
    heading: 'How Do Deadlines Change Our Appetite for Risk?',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-7 space-y-3 text-xs sm:text-sm text-purple-900">
          <div className="p-3.5 rounded-xl bg-white border border-orange-200 space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase text-orange-700">Two Clashing Stories</div>
            <p className="leading-relaxed">
              Earlier research split between two predictions: time pressure makes people <strong>more cautious</strong>, or it makes them <strong>more risk-seeking for gains</strong> and <strong>more risk-averse for losses</strong>.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase text-purple-800">The 2012 Prospect Theory Test</div>
            <p className="leading-relaxed">
              Young, Goodie, Hall, &amp; Wu separated <strong>how we value outcomes</strong> from <strong>how we weight probabilities</strong> under time pressure.
            </p>
          </div>
        </div>

        {/* Visual SVG: Clashing Theories -> Prospect Theory Lens */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-orange-200 p-4 shadow-sm">
          <svg viewBox="0 0 220 150" className="w-full h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="10" width="90" height="36" rx="8" fill="#F3E8FF" stroke="#7E22CE" strokeWidth="1.8" />
            <text x="53" y="25" textAnchor="middle" fill="#3B0764" fontSize="8.5" fontWeight="bold">More Cautious</text>
            <text x="53" y="38" textAnchor="middle" fill="#6B21A8" fontSize="7.5">(Risk-Averse)</text>

            <rect x="122" y="10" width="90" height="36" rx="8" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.8" />
            <text x="167" y="25" textAnchor="middle" fill="#7C2D12" fontSize="8.5" fontWeight="bold">Domain Split</text>
            <text x="167" y="38" textAnchor="middle" fill="#C2410C" fontSize="7.5">(Gains vs. Losses)</text>

            <path d="M53 46 L110 74" stroke="#7E22CE" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M167 46 L110 74" stroke="#EA580C" strokeWidth="2" strokeDasharray="3 3" />

            <rect x="30" y="76" width="160" height="62" rx="12" fill="#2E1065" stroke="#F97316" strokeWidth="2" />
            <text x="110" y="96" textAnchor="middle" fill="#FDBA74" fontSize="9.5" fontWeight="bold">PROSPECT THEORY LENS</text>
            <rect x="42" y="106" width="62" height="22" rx="6" fill="#4C1D95" />
            <text x="73" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">Outcome Value</text>
            <rect x="116" y="106" width="62" height="22" rx="6" fill="#EA580C" />
            <text x="147" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">Prob. Weight</text>
          </svg>
        </div>
      </div>
    )
  },
  {
    badge: '2 / 5 • Experimental Setup & Model',
    heading: 'Unlimited Time vs. The Clock (3 Experiments)',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-900 text-white flex items-center justify-center font-mono font-black text-sm shrink-0">
              ∞
            </div>
            <div>
              <div className="text-xs font-black text-purple-950">Unlimited-Time Group</div>
              <p className="text-[11px] text-purple-800">No countdown pressure on the modified Georgia Gambling Task.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-orange-100/70 border-2 border-orange-300 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-600 text-white flex items-center justify-center font-mono font-black text-xs shrink-0">
              10s/5s
            </div>
            <div>
              <div className="text-xs font-black text-purple-950">Time-Pressure Group</div>
              <p className="text-[11px] text-purple-900">10s first screen, 5s follow-ups. Responded <strong>~2× faster</strong> with few timeouts.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { num: '1', label: 'Risk Attractiveness', desc: 'Elevation of the probability weighting curve' },
            { num: '2', label: 'Probability Discriminability', desc: 'Sensitivity to differences between probabilities' },
            { num: '3', label: 'Outcome Utility', desc: 'How sharply value changes with payoff size' }
          ].map((m) => (
            <div key={m.num} className="p-3 rounded-xl bg-white border border-orange-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  {m.num}
                </span>
                <span className="text-xs font-black text-purple-950">{m.label}</span>
              </div>
              <p className="text-[11px] text-purple-800 leading-snug">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    badge: '3 / 5 • Gains Domain (Experiments 1 & 2)',
    heading: 'Under Time Pressure, Gains Look More Attractive',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-6 space-y-2.5 text-xs sm:text-sm text-purple-900">
          <div className="p-3 rounded-xl bg-white border border-orange-200">
            <strong className="text-orange-700 block text-xs uppercase font-mono mb-0.5">Exp. 1 (51%–99% • Real Money)</strong>
            Risk attractiveness rose significantly under time pressure. Outcome utility and overall discriminability did not shift.
          </div>
          <div className="p-3 rounded-xl bg-white border border-purple-200">
            <strong className="text-purple-800 block text-xs uppercase font-mono mb-0.5">Exp. 2 (Broad Range • Hypothetical)</strong>
            Pattern held across wider probabilities below 50%: time pressure boosted overall risk attractiveness.
          </div>
        </div>

        {/* Visual SVG Chart: Probability Weighting Curve for Gains */}
        <div className="md:col-span-6 bg-white rounded-2xl border border-orange-200 p-4 shadow-sm space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase text-purple-700 text-center">
            Gains: Probability Weighting Shift
          </div>
          <svg viewBox="0 0 220 135" className="w-full h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Axes */}
            <line x1="28" y1="110" x2="205" y2="110" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="28" y1="14" x2="28" y2="110" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="28" y1="110" x2="200" y2="18" stroke="#D8B4FE" strokeWidth="1.2" strokeDasharray="4 4" />

            {/* Unlimited Time Curve */}
            <path d="M28 110 C65 78, 130 62, 200 18" stroke="#6B21A8" strokeWidth="2.5" fill="none" />
            {/* Time Pressure Curve (Elevated!) */}
            <path d="M28 110 C55 56, 120 38, 200 18" stroke="#EA580C" strokeWidth="3" fill="none" />

            {/* Upward arrow indicating elevation */}
            <line x1="112" y1="68" x2="112" y2="48" stroke="#EA580C" strokeWidth="2" />
            <polygon points="112,43 107,51 117,51" fill="#EA580C" />
            <text x="118" y="34" fill="#C2410C" fontSize="8.5" fontWeight="bold">↑ Risk Attractiveness</text>

            {/* Legend */}
            <line x1="34" y1="125" x2="50" y2="125" stroke="#EA580C" strokeWidth="3" />
            <text x="54" y="128" fill="#7C2D12" fontSize="8" fontWeight="bold">Time Pressure</text>
            <line x1="124" y1="125" x2="140" y2="125" stroke="#6B21A8" strokeWidth="2.5" />
            <text x="144" y="128" fill="#4C1D95" fontSize="8" fontWeight="bold">Unlimited Time</text>
          </svg>
        </div>
      </div>
    )
  },
  {
    badge: '4 / 5 • Losses Domain (Experiment 3)',
    heading: 'For Losses, Time Pressure Blunts Probability Sensitivity',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-6 space-y-2.5 text-xs sm:text-sm text-purple-900">
          <div className="p-3 rounded-xl bg-white border border-purple-200">
            <strong className="text-purple-800 block text-xs uppercase font-mono mb-0.5">Real Cash Endowments</strong>
            Participants stated how much they would pay to avoid loss-only gambles. Both groups showed steep risk-seeking (gambling over paying a sure loss).
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <strong className="text-rose-800 block text-xs uppercase font-mono mb-0.5">Key Effect of Deadlines</strong>
            Time pressure <strong>significantly lowered probability discriminability</strong>: stressed participants became less sensitive to differences across loss odds.
          </div>
        </div>

        {/* Visual SVG Chart: Flatter Discriminability Curve for Losses */}
        <div className="md:col-span-6 bg-white rounded-2xl border border-orange-200 p-4 shadow-sm space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase text-purple-700 text-center">
            Losses: Lower Probability Discriminability
          </div>
          <svg viewBox="0 0 220 135" className="w-full h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="28" y1="110" x2="205" y2="110" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="28" y1="14" x2="28" y2="110" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="28" y1="110" x2="200" y2="18" stroke="#D8B4FE" strokeWidth="1.2" strokeDasharray="4 4" />

            {/* Unlimited Time: clearer slope */}
            <path d="M28 110 C60 72, 140 50, 200 18" stroke="#6B21A8" strokeWidth="2.5" fill="none" />
            {/* Time Pressure: flatter middle (less discriminability) */}
            <path d="M28 110 C42 52, 168 48, 200 18" stroke="#E11D48" strokeWidth="3" fill="none" />

            <text x="114" y="38" textAnchor="middle" fill="#BE123C" fontSize="8.5" fontWeight="bold">Flatter Curve = Less Sensitivity</text>

            <line x1="34" y1="125" x2="50" y2="125" stroke="#E11D48" strokeWidth="3" />
            <text x="54" y="128" fill="#9F1239" fontSize="8" fontWeight="bold">Time Pressure</text>
            <line x1="124" y1="125" x2="140" y2="125" stroke="#6B21A8" strokeWidth="2.5" />
            <text x="144" y="128" fill="#4C1D95" fontSize="8" fontWeight="bold">Unlimited Time</text>
          </svg>
        </div>
      </div>
    )
  },
  {
    badge: '5 / 5 • Limitations & 3 Main Takeaways',
    heading: 'What to Remember Under Pressure',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-300 space-y-1.5">
            <div className="text-lg">📈</div>
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">1. Gains Look More Attractive</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Deadlines boost risk attractiveness for gains across real and hypothetical stakes without changing outcome utility.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
            <div className="text-lg">🎯</div>
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">2. Loss Odds Blur Together</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              In loss-framed bets, time pressure blunts probability sensitivity, making different odds harder to tell apart.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
            <div className="text-lg">⚖️</div>
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">3. Selective, Not Uniform</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Deadlines do not simply make us reckless or cautious. They shift distinct cognitive levers for gains vs. losses.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white border border-purple-200 text-[11px] text-purple-700 font-mono text-center">
          <strong>Study Caveats:</strong> Hypothetical stakes in Exp. 2 • Narrowing/matching task vs. binary choice • Shared 3-station lab room
        </div>
      </div>
    )
  }
];

const PHASE1_PAPERS = [
  {
    shortTitle: 'Time Pressure (Young et al., 2012)',
    title: 'Decision Making Under Time Pressure: A Prospect Theory Approach',
    description: 'How time pressure shifts risk attractiveness for gains and reduces probability sensitivity for losses.',
    citation: 'Young, Goodie, Hall, & Wu (2012, OBHDP) • Read Full Paper (PMC)',
    paperUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3375992/',
    slides: TIME_PRESSURE_SLIDES
  }
];

export default function LessonReveal({
  isGamemaker,
  selectedTopicIndex,
  takeawaySlideIndex = 0,
  takeawayHidden = false,
  onSelectTopic,
  onChangeTakeawaySlide,
  onToggleHidden,
  onBackToLobby
}) {
  return (
    <TakeawayLayout
      phaseLabel="Phase 1 • The Cornucopia"
      title="DECISION MAKING UNDER TIME PRESSURE"
      subtitle="What does psychology tell us about our decisions when the clock is ticking?"
      papers={PHASE1_PAPERS}
      selectedIndex={selectedTopicIndex}
      takeawaySlideIndex={takeawaySlideIndex}
      takeawayHidden={takeawayHidden}
      isGamemaker={isGamemaker}
      onSelectTopic={onSelectTopic}
      onChangeTakeawaySlide={onChangeTakeawaySlide}
      onToggleHidden={onToggleHidden}
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

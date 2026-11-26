import React from 'react';
import TakeawayLayout from '../TakeawayLayout';
import { RotateCcw } from 'lucide-react';

const PHASE3_TIME_BIASES_SLIDES = [
  {
    badge: '1 / 4 • Why Time Distorts Choice',
    heading: 'Classical Economics vs. How Humans Actually Choose',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-7 space-y-3 text-xs sm:text-sm text-purple-900">
          <div className="p-3.5 rounded-xl bg-white border border-orange-200 space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase text-orange-700">Now vs. Later Trade-Offs</div>
            <p className="leading-relaxed">
              Classical models assume we discount future rewards at a steady, consistent rate. In reality, immediate comfort, impulse, and optimism routinely pull our choices off course.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase text-purple-800">215 Empirical Studies Reviewed</div>
            <p className="leading-relaxed">
              Taş, Maknoon, &amp; Rezaei (2026) synthesized <strong>215 peer-reviewed human studies</strong> across Web of Science and Scopus into <strong>six time-related biases</strong>.
            </p>
          </div>
        </div>

        {/* Visual SVG: Smooth Rational Curve vs Bent Human Discounting */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-orange-200 p-4 shadow-sm space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase text-purple-700 text-center">
            Value Over Time: Model vs. Reality
          </div>
          <svg viewBox="0 0 220 135" className="w-full h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="26" y1="108" x2="204" y2="108" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="26" y1="14" x2="26" y2="108" stroke="#9333EA" strokeWidth="1.5" />

            {/* Steady rational exponential curve */}
            <path d="M26 22 Q110 48, 200 72" stroke="#6B21A8" strokeWidth="2.2" strokeDasharray="4 3" fill="none" />
            {/* Steep human present-biased curve */}
            <path d="M26 20 C38 80, 95 92, 200 98" stroke="#EA580C" strokeWidth="3" fill="none" />

            <text x="150" y="45" fill="#6B21A8" fontSize="8" fontWeight="bold">Steady Model</text>
            <text x="80" y="84" fill="#C2410C" fontSize="8.5" fontWeight="bold">Human Steep Drop</text>

            <text x="30" y="122" fill="#4C1D95" fontSize="8" fontWeight="bold">NOW</text>
            <text x="172" y="122" fill="#4C1D95" fontSize="8" fontWeight="bold">LATER</text>
          </svg>
        </div>
      </div>
    )
  },
  {
    badge: '2 / 4 • The Six Time-Related Biases',
    heading: 'Six Ways Time Warps Perception & Evaluation',
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {[
          {
            name: 'Present Bias',
            count: '78 studies',
            group: 'Now vs. Later',
            desc: 'Pull toward immediate rewards or relief over larger future gains (debt, health, green tech).',
            highlight: true
          },
          {
            name: 'Impact Bias',
            count: '37 studies',
            group: 'Forecasting',
            desc: 'Overestimating how intense and long-lasting future emotions will feel (focalism & immune neglect).'
          },
          {
            name: 'Duration Neglect',
            count: '25 studies',
            group: 'Memory',
            desc: 'Judging experiences by their peak intensity and ending (peak-end rule) instead of total length.'
          },
          {
            name: 'Planning Fallacy',
            count: '25 studies',
            group: 'Forecasting',
            desc: 'Underestimating time, cost, effort, and risks of future tasks due to overoptimism.'
          },
          {
            name: 'Projection Bias',
            count: '18 studies',
            group: 'Now vs. Later',
            desc: 'Assuming current states, tastes, or weather will carry unchanged into the future.'
          },
          {
            name: 'Recency Bias',
            count: '7 studies',
            group: 'Memory',
            desc: 'Giving outsized weight to the most recent event (e.g., market drops or recent weather).'
          }
        ].map((b) => (
          <div
            key={b.name}
            className={`p-3 rounded-xl border space-y-1 ${
              b.highlight
                ? 'bg-orange-50 border-2 border-orange-300'
                : 'bg-white border-purple-200'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-black font-cinzel text-purple-950">{b.name}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[9px] font-mono font-bold shrink-0">
                {b.count}
              </span>
            </div>
            <p className="text-[11px] text-purple-800 leading-snug">{b.desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    badge: '3 / 4 • Interrelationships & Mitigation',
    heading: 'Biases Compound — Tailored Tools Counter Them',
    content: (
      <div className="space-y-3.5">
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-[11px] sm:text-xs text-purple-900">
          <strong className="text-purple-950 uppercase font-mono text-[10px] block mb-1">Key Overlaps</strong>
          Present bias ↔ <strong>Loss/Risk Aversion</strong> • Projection ↔ <strong>Salience/Optimism</strong> • Recency ↔ <strong>Anchoring</strong> • Impact ↔ <strong>Empathy Gaps</strong> • Planning Fallacy ↔ <strong>Optimism/Anchoring</strong>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-xl bg-white border border-orange-200 space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase text-orange-700">Present &amp; Projection</div>
            <p className="text-[11px] text-purple-900 leading-snug">
              Precommitment devices, cooling-off periods, future-date framing, episodic future thinking, and joint decisions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-purple-200 space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase text-purple-800">Recency &amp; Planning</div>
            <p className="text-[11px] text-purple-900 leading-snug">
              Unpacking tasks into steps, backward planning, checking past reference data, and taking an outside perspective.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-orange-200 space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase text-orange-700">Duration &amp; Impact</div>
            <p className="text-[11px] text-purple-900 leading-snug">
              Reordering sequences, spacing evaluations, surrogate experiences, and considering multiple co-occurring events.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    badge: '4 / 4 • Research Gaps & 3 Main Takeaways',
    heading: 'What to Remember About Time & Choice',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-300 space-y-1.5">
            <div className="text-lg">⏳</div>
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">1. Six Distinct Biases</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Human choices violate steady discounting across present, projection, recency, duration neglect, impact, and planning biases.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
            <div className="text-lg">🌍</div>
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">2. High-Stakes Impact</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Across 215 studies, compounding biases reshape debt, health habits, green adoption, voting, and project timelines.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1.5">
            <div className="text-lg">🧭</div>
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">3. Shift Friction &amp; Frame</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Waiting periods, mental simulation, backward planning, and outside perspectives help, though prescriptive testing needs growth.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white border border-purple-200 text-[11px] text-purple-700 font-mono text-center">
          <strong>Key Research Gap:</strong> Current studies are heavily descriptive. Stronger real-world prescriptive testing of tailored interventions is still needed.
        </div>
      </div>
    )
  }
];

const PHASE3_PAPERS = [
  {
    shortTitle: "Time's Influence (Taş et al., 2026)",
    title: "Time's Influence: A Systematic Review of Biases in Intertemporal Decision-Making",
    description: 'Synthesizes 215 empirical studies into six time-related biases, their overlaps, and mitigation strategies.',
    citation: 'Taş, Maknoon, & Rezaei (2026, Annual Review of Psychology) • Read Paper',
    paperUrl: 'https://www.annualreviews.org/content/journals/10.1146/annurev-psych-091924-040158',
    slides: PHASE3_TIME_BIASES_SLIDES
  }
];

export default function Phase3Lesson({
  isGamemaker,
  selectedTopicIndex,
  takeawaySlideIndex = 0,
  takeawayHidden = false,
  onSelectTopic,
  onChangeTakeawaySlide,
  onToggleHidden,
  onBackToWoods
}) {
  return (
    <TakeawayLayout
      phaseLabel="Phase 3 • Finding Water"
      title="THE PSYCHOLOGY OF CHOICE"
      subtitle="Why do we choose convenience over caution?"
      papers={PHASE3_PAPERS}
      selectedIndex={selectedTopicIndex}
      takeawaySlideIndex={takeawaySlideIndex}
      takeawayHidden={takeawayHidden}
      isGamemaker={isGamemaker}
      onSelectTopic={onSelectTopic}
      onChangeTakeawaySlide={onChangeTakeawaySlide}
      onToggleHidden={onToggleHidden}
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

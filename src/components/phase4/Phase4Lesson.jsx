import React from 'react';
import TakeawayLayout from '../TakeawayLayout';
import { RotateCcw } from 'lucide-react';

const TIME_PRESSURE_SLIDES = [
  {
    badge: '1 / 5 • The Central Question',
    heading: 'How Do Deadlines Change How We Handle Risk?',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-7 space-y-3 text-xs sm:text-sm text-purple-900">
          <div className="p-3.5 rounded-xl bg-white border border-orange-200 space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase text-orange-700">Two Clashing Ideas</div>
            <p className="leading-relaxed">
              Earlier studies disagreed: one side said deadlines make people <strong>play it safer</strong>, while another said deadlines make us <strong>bolder when chasing a win</strong> and <strong>more cautious when facing a loss</strong>.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase text-purple-800">What the 2012 Study Tested</div>
            <p className="leading-relaxed">
              Young, Goodie, Hall, &amp; Wu split every decision into two parts: <strong>how much the prize matters</strong> vs. <strong>how we judge the odds</strong> under a ticking clock.
            </p>
          </div>
        </div>

        {/* Visual SVG: Clashing Theories -> Two-Part Lens */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-orange-200 p-4 shadow-sm">
          <svg viewBox="0 0 220 150" className="w-full h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="10" width="90" height="36" rx="8" fill="#F3E8FF" stroke="#7E22CE" strokeWidth="1.8" />
            <text x="53" y="25" textAnchor="middle" fill="#3B0764" fontSize="8.5" fontWeight="bold">Play It Safer</text>
            <text x="53" y="38" textAnchor="middle" fill="#6B21A8" fontSize="7.5">(More Cautious)</text>

            <rect x="122" y="10" width="90" height="36" rx="8" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.8" />
            <text x="167" y="25" textAnchor="middle" fill="#7C2D12" fontSize="8.5" fontWeight="bold">Depends on Frame</text>
            <text x="167" y="38" textAnchor="middle" fill="#C2410C" fontSize="7.5">(Wins vs. Losses)</text>

            <path d="M53 46 L110 74" stroke="#7E22CE" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M167 46 L110 74" stroke="#EA580C" strokeWidth="2" strokeDasharray="3 3" />

            <rect x="30" y="76" width="160" height="62" rx="12" fill="#2E1065" stroke="#F97316" strokeWidth="2" />
            <text x="110" y="96" textAnchor="middle" fill="#FDBA74" fontSize="9.5" fontWeight="bold">DECISION BREAKDOWN</text>
            <rect x="40" y="106" width="65" height="22" rx="6" fill="#4C1D95" />
            <text x="72" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">Prize Value</text>
            <rect x="115" y="106" width="65" height="22" rx="6" fill="#EA580C" />
            <text x="147" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">Judging Odds</text>
          </svg>
        </div>
      </div>
    )
  },
  {
    badge: '2 / 5 • How They Tested It',
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
              <p className="text-[11px] text-purple-800">No countdown while deciding how much a risky bet was worth to them.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-orange-100/70 border-2 border-orange-300 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-600 text-white flex items-center justify-center font-mono font-black text-xs shrink-0">
              10s/5s
            </div>
            <div>
              <div className="text-xs font-black text-purple-950">Time-Pressure Group</div>
              <p className="text-[11px] text-purple-900">10s on screen 1, 5s on follow-ups. Answered <strong>~2× faster</strong> with few timeouts.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { num: '1', label: 'Appetite for Risk', desc: 'How tempting a risky bet feels overall' },
            { num: '2', label: 'Odds Sensitivity', desc: 'How clearly you tell 60% odds apart from 90% odds' },
            { num: '3', label: 'Prize Sensitivity', desc: 'How much bigger payoffs change your choice' }
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
    badge: '3 / 5 • Playing for Wins (Experiments 1 & 2)',
    heading: 'Under a Deadline, Risky Wins Feel More Tempting',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-6 space-y-2.5 text-xs sm:text-sm text-purple-900">
          <div className="p-3 rounded-xl bg-white border border-orange-200">
            <strong className="text-orange-700 block text-xs uppercase font-mono mb-0.5">Exp. 1 (51%–99% • Real Money)</strong>
            Under time pressure, risky bets felt noticeably more appealing. How people valued the prize size itself did not change.
          </div>
          <div className="p-3 rounded-xl bg-white border border-purple-200">
            <strong className="text-purple-800 block text-xs uppercase font-mono mb-0.5">Exp. 2 (Wider Odds • Pretend Stakes)</strong>
            Same result even with odds below 50%: deadlines boosted appetite for risk across both real and pretend stakes.
          </div>
        </div>

        {/* Visual SVG Chart: Higher Risk Appetite for Gains */}
        <div className="md:col-span-6 bg-white rounded-2xl border border-orange-200 p-4 shadow-sm space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase text-purple-700 text-center">
            Playing for Wins: How Tempting the Risk Feels
          </div>
          <svg viewBox="0 0 220 135" className="w-full h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="28" y1="110" x2="205" y2="110" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="28" y1="14" x2="28" y2="110" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="28" y1="110" x2="200" y2="18" stroke="#D8B4FE" strokeWidth="1.2" strokeDasharray="4 4" />

            <path d="M28 110 C65 78, 130 62, 200 18" stroke="#6B21A8" strokeWidth="2.5" fill="none" />
            <path d="M28 110 C55 56, 120 38, 200 18" stroke="#EA580C" strokeWidth="3" fill="none" />

            <line x1="112" y1="68" x2="112" y2="48" stroke="#EA580C" strokeWidth="2" />
            <polygon points="112,43 107,51 117,51" fill="#EA580C" />
            <text x="118" y="34" fill="#C2410C" fontSize="8.5" fontWeight="bold">↑ More Tempting</text>

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
    badge: '4 / 5 • Facing Losses (Experiment 3)',
    heading: 'When Facing Losses, Deadlines Blur the Odds',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-6 space-y-2.5 text-xs sm:text-sm text-purple-900">
          <div className="p-3 rounded-xl bg-white border border-purple-200">
            <strong className="text-purple-800 block text-xs uppercase font-mono mb-0.5">Real Cash on the Line</strong>
            Players started with cash and chose whether to pay a guaranteed fee or gamble to avoid a loss. Both groups strongly preferred gambling over taking a sure loss.
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <strong className="text-rose-800 block text-xs uppercase font-mono mb-0.5">Key Effect of Deadlines</strong>
            Under time pressure, players became <strong>much worse at telling different loss odds apart</strong> — medium risks and high risks started to blur together.
          </div>
        </div>

        {/* Visual SVG Chart: Flatter Curve = Blurred Odds */}
        <div className="md:col-span-6 bg-white rounded-2xl border border-orange-200 p-4 shadow-sm space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase text-purple-700 text-center">
            Facing Losses: Odds Blur Together
          </div>
          <svg viewBox="0 0 220 135" className="w-full h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="28" y1="110" x2="205" y2="110" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="28" y1="14" x2="28" y2="110" stroke="#9333EA" strokeWidth="1.5" />
            <line x1="28" y1="110" x2="200" y2="18" stroke="#D8B4FE" strokeWidth="1.2" strokeDasharray="4 4" />

            <path d="M28 110 C60 72, 140 50, 200 18" stroke="#6B21A8" strokeWidth="2.5" fill="none" />
            <path d="M28 110 C42 52, 168 48, 200 18" stroke="#E11D48" strokeWidth="3" fill="none" />

            <text x="114" y="38" textAnchor="middle" fill="#BE123C" fontSize="8.5" fontWeight="bold">Flatter Line = Blurred Odds</text>

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
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">1. Wins Feel More Tempting</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Under a deadline, risky upsides look more attractive — across both real and pretend stakes — without changing how we value the prize itself.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
            <div className="text-lg">🎯</div>
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">2. Loss Odds Blur Together</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              When trying to avoid a loss, time pressure makes it harder to separate small risks from big risks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
            <div className="text-lg">⚖️</div>
            <h4 className="text-xs sm:text-sm font-black font-cinzel text-purple-950">3. Targeted, Not Random</h4>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Deadlines do not just make us blindly reckless or cautious. They shift different mental gears for wins vs. losses.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white border border-purple-200 text-[11px] text-purple-700 font-mono text-center">
          <strong>Study Caveats:</strong> Pretend stakes in Exp. 2 • Step-by-step narrowing task (not simple Yes/No) • Shared 3-computer lab room
        </div>
      </div>
    )
  }
];

const PHASE4_PAPERS = [
  {
    shortTitle: 'Time Pressure (Young et al., 2012)',
    title: 'Decision Making Under Time Pressure',
    description: 'How deadlines make risky wins feel more tempting and blur the odds when facing losses.',
    citation: 'Young, Goodie, Hall, & Wu (2012, OBHDP) • Read Full Paper (PMC)',
    paperUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3375992/',
    slides: TIME_PRESSURE_SLIDES
  }
];

export default function Phase4Lesson({
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
      phaseLabel="Psychology Debrief • After the Survival Rounds"
      title="DECISION MAKING UNDER TIME PRESSURE"
      subtitle="What happens to our judgment when the clock is ticking?"
      papers={PHASE4_PAPERS}
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
          Resume Game: Return to The Woods (Next: Phase 5)
        </button>
      }
    />
  );
}

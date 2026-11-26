import React, { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';
import { DISTRICTS } from '../data/hungerGamesData';
import { BookOpen, Users, Timer, Pause, Play, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Eye, EyeOff, FlaskConical } from 'lucide-react';

const Key = ({ children }) => (
  <strong className="text-orange-300 font-extrabold underline decoration-orange-400/75 underline-offset-2">
    {children}
  </strong>
);

const TIME_PRESSURE_SPEAKER_SLIDES = [
  {
    title: 'Slide 1: Title & The Central Question (~45 seconds)',
    visual: 'Decision Making Under Time Pressure: A Prospect Theory Approach — Young, Goodie, Hall, & Wu (2012, OBHDP).',
    script: [
      <>
        &ldquo;We make choices under deadlines every day—from quick market trades and urgent project calls to emergency responses. Earlier decision research gave us <Key>two clashing stories</Key> about what deadlines do to risk: one camp argued time pressure makes people <Key>more cautious and risk-averse</Key>, while another—like Busemeyer&rsquo;s sequential-comparison work—suggested people become <Key>more risk-seeking when expected value is positive</Key>, and <Key>more risk-averse when it&rsquo;s negative</Key>.&rdquo;
      </>,
      <>
        &ldquo;In this <Key>2012 study</Key>, <Key>Young, Goodie, Hall, and Wu</Key> tested how time pressure shapes risk by fitting participants&rsquo; <Key>certainty equivalents</Key> into a formal <Key>prospect theory model</Key>—separating <Key>how we value outcomes</Key> from <Key>how we weight probabilities</Key>.&rdquo;
      </>
    ]
  },
  {
    title: 'Slide 2: Experimental Setup & Model (~60 seconds)',
    visual: 'Modified Georgia Gambling Task + Prospect Theory parameters: risk attractiveness, probability discriminability, and outcome utility.',
    script: [
      <>
        &ldquo;Across <Key>three experiments</Key> with <Key>undergraduate participants</Key>, the researchers compared an <Key>unlimited-time group</Key> against a <Key>time-pressure group</Key>—giving <Key>10 seconds</Key> on the first screen of a narrowing-down task and <Key>5 seconds</Key> on each follow-up screen. Time pressure worked: participants responded <Key>roughly twice as fast</Key> and violated the clock on only a small fraction of bets.&rdquo;
      </>,
      <>
        &ldquo;Using <Key>nonlinear mixed-effects modeling</Key> on certainty equivalents, the authors tracked <Key>three psychological mechanisms</Key>: <Key>risk attractiveness</Key> (elevation of probability weighting), <Key>probability discriminability</Key> (sensitivity to differences in probability), and <Key>outcome utility</Key> (how sharply value changes with payoff size). They tested <Key>gains-only bets</Key> using both random odds and U.S. state population confidence wagers, and then tested <Key>loss-only bets</Key>.&rdquo;
      </>
    ]
  },
  {
    title: 'Slide 3: Gains Domain — Experiments 1 & 2 (~75 seconds)',
    visual: 'Gains-Only Bets (Experiments 1 & 2): Higher risk attractiveness under time pressure; no main-effect shift in probability discriminability or value curvature.',
    script: [
      <>
        &ldquo;In <Key>Experiment 1</Key>, participants faced <Key>gains-only bets</Key> across higher win probabilities—from <Key>51% to 99%</Key>—with <Key>real-money payout potential</Key>. Under time pressure, <Key>risk attractiveness increased significantly</Key>, both overall and on random bets alone, while <Key>outcome utility</Key> and <Key>overall probability discriminability did not shift significantly</Key> at the main-effect level.&rdquo;
      </>,
      <>
        &ldquo;<Key>Experiment 2</Key> broadened the probability range <Key>down below 50%</Key> using six-state population comparisons and <Key>hypothetical stakes</Key>. Again, time pressure <Key>increased overall risk attractiveness</Key> across the wider probability spectrum—showing the pattern holds across both <Key>real and hypothetical incentives</Key>, though with one twist: in the random condition without time pressure, participants showed <Key>higher probability discriminability</Key> than under time pressure.&rdquo;
      </>
    ]
  },
  {
    title: 'Slide 4: Losses Domain — Experiment 3 (~60 seconds)',
    visual: 'Loss-Only Bets (Experiment 3): Steep risk-seeking in both groups; lower probability discriminability under time pressure.',
    script: [
      <>
        &ldquo;What happens when the framing flips to <Key>pure losses</Key>? In <Key>Experiment 3</Key>, participants estimated how much they&rsquo;d pay to avoid <Key>loss-only gambles</Key>—backed by <Key>cash endowments and real loss risk</Key>.&rdquo;
      </>,
      <>
        &ldquo;Here, participants in <Key>both conditions</Key> showed <Key>strong risk-seeking behavior</Key>—reflected in elevated probability weighting curves and willingness to gamble rather than pay out—which may have created a <Key>ceiling effect</Key> that masked any extra shift in risk attractiveness. Crucially, however, time pressure <Key>significantly reduced probability discriminability</Key>, meaning stressed participants were <Key>less sensitive to differences across loss probabilities</Key>.&rdquo;
      </>
    ]
  },
  {
    title: 'Slide 5: Limitations & Wrap-Up (~45 seconds)',
    visual: 'Key caveats: Hypothetical stakes in Exp. 2, narrowing/matching elicitation vs. direct choice, and a shared 3-station lab room.',
    script: [
      <>
        &ldquo;A few caveats matter when reading these numbers: <Key>Experiment 2 used hypothetical stakes</Key>, the task used a <Key>narrowing-down matching format</Key> rather than simple binary choice, and sessions ran in a <Key>shared three-workstation room</Key> where subtle social dynamics could play a role.&rdquo;
      </>,
      <>
        &ldquo;Overall, the paper shows that time pressure doesn&rsquo;t just speed us up—it shifts <Key>specific cognitive levers</Key> depending on whether we&rsquo;re looking at <Key>potential gains</Key> or <Key>potential losses</Key>.&rdquo;
      </>
    ]
  }
];

const TIME_PRESSURE_MAIN_TAKEAWAYS = [
  {
    heading: 'Deadlines boost risk attractiveness for gains',
    text: (
      <>
        Across both narrow (<Key>51%–99%</Key>) and broad probability ranges—and with <Key>real or hypothetical stakes</Key>—time pressure made gains-framed risks look <Key>more attractive</Key> without changing <Key>outcome utility</Key> at the main-effect level.
      </>
    )
  },
  {
    heading: 'Deadlines blunt probability sensitivity for losses',
    text: (
      <>
        In <Key>loss-framed gambles</Key>, extreme baseline risk-seeking appeared in both groups, while time pressure <Key>impaired how well participants discriminated between probabilities</Key>.
      </>
    )
  },
  {
    heading: 'Time pressure acts selectively rather than uniformly',
    text: (
      <>
        Rather than simply making people universally more reckless or more cautious, deadlines affect <Key>distinct prospect-theory mechanisms differently</Key> across the <Key>gains and losses domains</Key>.
      </>
    )
  }
];

const RESEARCH_QUICK_FACTS = {
  title: 'Decision Making Under Time Pressure: A Prospect Theory Approach',
  authors: 'Young, Goodie, Hall, & Wu (2012)',
  journal: 'Organizational Behavior and Human Decision Processes (OBHDP)',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3375992/',
  facts: [
    { key: 'Study Type', value: '3 lab experiments using a modified Georgia Gambling Task (narrowing-down certainty-equivalent matching format)' },
    { key: 'Participants', value: 'Undergraduate participants tested in a shared 3-workstation lab room' },
    { key: 'Time Manipulation', value: 'Unlimited time vs. 10s on first screen + 5s on each follow-up (~2× faster responses, few clock violations)' },
    { key: 'Statistical Model', value: 'Nonlinear mixed-effects modeling fitting Prospect Theory (risk attractiveness, probability discriminability, outcome utility)' },
    { key: 'Experiment 1', value: 'Gains-only bets (51%–99% win odds), real-money payout potential → ↑ Risk attractiveness under time pressure' },
    { key: 'Experiment 2', value: 'Gains-only bets (broad odds <50%–99%, 6-state population + random bets), hypothetical stakes → ↑ Overall risk attractiveness' },
    { key: 'Experiment 3', value: 'Loss-only gambles backed by real cash endowments → Steep baseline risk-seeking in both groups; ↓ Probability discriminability under time pressure' },
    { key: 'Key Caveats', value: 'Hypothetical stakes in Exp. 2; matching/narrowing elicitation vs. direct binary choice; shared 3-station lab room' }
  ]
};

const PHASE_NOTES = {
  lobby: {
    title: 'Waiting Room / The Woods',
    goal: 'Wait for all tributes to join, confirm everyone appears on their pedestal, then start the next phase.',
    bullets: [
      'Share Screen 1 (your main Arena tab switched to Player View) so everyone sees the clean screen.',
      'Keep THIS Presenter Notes window on your private monitor or phone — it stays synced live automatically!'
    ]
  },
  intro: {
    title: 'Phase 1 — The Cornucopia (Intro)',
    goal: 'Build suspense without revealing the 3 options yet.',
    bullets: [
      'Remind tributes: every decision impacts how the rest of the Games turns out.',
      'Set the countdown seconds (30s works well for ~10 people) and start the round.'
    ]
  },
  choice: {
    title: 'Phase 1 — Live Voting',
    goal: 'Let tributes choose privately while the countdown runs.',
    bullets: [
      'Cornucopia: 50% base risk (+20 pts + Survival Tool Kit if alive); steep last-5-second penalty.',
      'Outskirts: 25% base risk (min 10% floor, +16 pts); moderate last-5-second penalty.',
      'Woods: 0% risk (+12 pts guaranteed). Timeout = automatic death (-2 pts).'
    ]
  },
  results: {
    title: 'Phase 1 — Poll Breakdown',
    goal: 'Comment on how the room split before revealing who fell.',
    bullets: [
      'Ask: "Why did so many of you play it safe / rush the center?"',
      'Click Reveal Consequences when ready.'
    ]
  },
  consequences: {
    title: 'Phase 1 — Consequences Revealed',
    goal: 'Highlight that falling is -5 marks (NOT eliminated — everyone keeps playing).',
    bullets: [
      'Cornucopia survivors secretly received a Survival Tool Kit.',
      'Scores stay visible only to each individual player. Next: Return to The Woods for Phase 2.'
    ]
  },
  p2_intro: {
    title: 'Phase 2 — Alliances vs Going Solo (Announcement)',
    goal: 'Read the Gamemaker announcement aloud dramatically.',
    bullets: [
      '"An ally could protect you, share resources and help you survive. But remember… there can only be one victor."',
      'Recommended timer: 60–90 seconds.'
    ]
  },
  p2_choice: {
    title: 'Phase 2 — Live Alliance Voting',
    goal: 'Track how many choose Alliance vs Solo.',
    bullets: [
      'Alliance seekers will be randomly paired into teams of 2 (or one team of 3 if odd).',
      'Solo players play the rest of the game independently.'
    ]
  },
  p2_alliances: {
    title: 'Phase 2 — Alliance Assignments',
    goal: 'Give newly formed teams 30 seconds to acknowledge their partner(s), then move into Phase 3.',
    bullets: [
      'Notice how quickly people start rooting for a partner they were just randomly assigned!'
    ]
  },
  p3_intro: {
    title: 'Phase 3 — Finding Water (Announcement)',
    goal: 'Do NOT reveal that the furthest source is cleanest before Decision 1.',
    bullets: [
      'Remind alliance teams to communicate — mismatched choices cost -3 pts each!',
      'Further travel = higher chance of ambush (-5); drinking unfiltered water = guaranteed sick (-2).'
    ]
  },
  p3_location: {
    title: 'Phase 3 — Decision 1 (Location)',
    goal: 'Observe who picks convenience (2m puddle) vs effort (25m stream).',
    bullets: ['Puddle: +10 | Pond: +13 | Stream: +16', 'Team mismatch on location = -3 pts each.']
  },
  p3_purify: {
    title: 'Phase 3 — Decision 2 (Drink vs Purify)',
    goal: 'Watch who saves time vs plays it safe.',
    bullets: ['Purify: +4 pts', 'Drink unfiltered: guaranteed sick (-2 pts)', 'Team member with Phase 1 Tool: +2 bonus to entire team!']
  },
  p3_outcome: {
    title: 'Phase 3 — Water Outcomes',
    goal: 'Review location %, purify %, and how many teams coordinated vs mismatched, then head into Phase 4.',
    bullets: ['Point out that walking further brought higher points AND higher travel risk.']
  },
  p4_intro: {
    title: "Phase 4 — Gamemakers' Twist (Announcement)",
    goal: 'Set up the turning point: Fire Disaster followed by The Feast.',
    bullets: ['Timeout = automatic death (-2 pts)!']
  },
  p4_event: {
    title: 'Phase 4 — Fire Disaster',
    goal: 'Watch who moves downhill (+4), climbs a tree (-3 / 60% death), or ditches gear (+5).',
    bullets: ['Next step triggers The Feast scenario.']
  },
  p4_twist: {
    title: 'Phase 4 — The Feast',
    goal: 'Watch who skips (+5), scouts (+1), or sprints for their pack (+3 & +1 vote, or 50% death -5).',
    bullets: ['Remind players: high reward comes with real risk!']
  },
  p4_outcome: {
    title: 'Phase 4 — Fire & Feast Outcomes',
    goal: 'Compare survival rates across Fire Disaster and The Feast, then launch the Psychology Takeaway!',
    bullets: [
      'Anyone who timed out automatically died (-2 pts).',
      'Great bridge into the talk: they just made rapid gain-framed (Feast/Cornucopia) and loss-framed (Fire/Ambush) choices under time pressure.'
    ]
  },
  p4_lesson: {
    title: 'Psychology Debrief — Decision Making Under Time Pressure',
    paperLink: {
      label: 'Young, Goodie, Hall, & Wu (2012, OBHDP) — PMC3375992',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3375992/'
    },
    speakerSlides: TIME_PRESSURE_SPEAKER_SLIDES,
    mainTakeaways: TIME_PRESSURE_MAIN_TAKEAWAYS
  },
  p5_intro: {
    title: 'Phase 5 — Win Over the Sponsors (Intro)',
    goal: 'Introduce the final persuasion challenge.',
    bullets: ['Tributes write a short pitch to convince the Capitol to sponsor them.']
  },
  p5_pitch: {
    title: 'Phase 5 — Sponsor Pitches',
    goal: 'Wait for pitches to come in, then set the voting duration and open anonymous voting.',
    bullets: ['Names will be hidden (Tribute A, B, C...) during voting so everyone votes purely on the pitch.']
  },
  p5_vote: {
    title: 'Phase 5 — Anonymous Sponsor Voting',
    goal: 'Track live votes cast (nobody can vote for themselves; not voting costs -4 pts).',
    bullets: ['1st: +5 pts | 2nd: +3 pts | 3rd: +1 pt (sponsor score only).']
  },
  p5_winner: {
    title: 'Phase 5 — Sponsor Winner Reveal',
    goal: 'Celebrate the Capitol Favourite Tribute, then crown the overall Victor across all 5 phases!',
    bullets: ['Click Crown the Victor & Final Leaderboard when ready.']
  },
  finale: {
    title: 'Grand Finale — Victor & Reflection',
    goal: 'Celebrate the Victor, expand score breakdowns on the leaderboard, and close with the reflection question.',
    bullets: [
      'Click any tribute row on the Final Leaderboard to show where they gained/lost points across all 5 phases.',
      'Ask 2–3 people: "What did the Games reveal about how you make decisions under time pressure?"'
    ]
  }
};

export default function PresenterNotes() {
  const [tributes, setTributes] = useState([]);
  const [timer, setTimer] = useState({ running: false, countdown: 30, duration: 30 });
  const [game, setGame] = useState(syncService.getGame());
  const [showResearchFacts, setShowResearchFacts] = useState(false);

  useEffect(() => {
    document.title = 'Gamemaker Private Notes | The Hunger Games';
    const unsubscribe = syncService.subscribe(
      (t) => setTributes(t),
      (tm) => setTimer(tm),
      (g) => setGame(g)
    );
    return () => unsubscribe();
  }, []);

  const phase = game?.phase || 'lobby';
  const notes = PHASE_NOTES[phase] || PHASE_NOTES.lobby;
  const sortedTributes = [...tributes].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  const isTakeawayPhase = phase === 'p4_lesson';
  const activeSlideIdx = game?.takeawaySlideIndex ?? 0;

  const handleToggleTimer = () => {
    syncService.controlTimer(timer.running ? 'pause' : 'start', timer.duration || 30);
  };

  const handleChangeTakeawaySlide = (idx) => {
    syncService.controlGame('set_takeaway_slide', undefined, { index: idx });
  };

  const handleToggleTakeawayHidden = () => {
    syncService.controlGame('toggle_takeaway_hidden');
  };

  return (
    <div className="min-h-screen bg-[#16062A] text-purple-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-orange-400">
              <BookOpen className="w-3.5 h-3.5" />
              Private Gamemaker Notes (Do Not Share This Window)
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-cinzel text-white mt-0.5">
              {notes.title}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {isTakeawayPhase && (
              <button
                type="button"
                onClick={handleToggleTakeawayHidden}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  game?.takeawayHidden
                    ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-400'
                    : 'bg-purple-900 hover:bg-purple-800 text-purple-100 border-purple-700'
                }`}
                title={game?.takeawayHidden ? 'Reveal takeaway screen to all players' : 'Hide takeaway screen from all players'}
              >
                {game?.takeawayHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{game?.takeawayHidden ? 'Show Takeaway' : 'Hide Takeaway'}</span>
              </button>
            )}
            <div className="px-3 py-1.5 rounded-xl bg-purple-900 border border-purple-700 flex items-center gap-2 font-mono text-sm font-black text-orange-300">
              <Timer className="w-4 h-4" />
              <span>{timer.countdown}s</span>
            </div>
            <button
              onClick={handleToggleTimer}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                timer.running ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {timer.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{timer.running ? 'Pause' : 'Resume'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Speaking & Teaching Notes */}
          <div className="lg:col-span-7 space-y-4">
            {notes.speakerSlides ? (
              <div className="space-y-4">
                {/* Slide Controls + Paper Link */}
                <div className="p-4 rounded-2xl bg-purple-950/90 border border-orange-400/40 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold text-orange-400">
                      Synced Presentation Controls
                    </div>
                    {notes.paperLink && (
                      <a
                        href={notes.paperLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-orange-200 hover:text-white underline mt-0.5"
                      >
                        <span>{notes.paperLink.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={activeSlideIdx <= 0}
                      onClick={() => handleChangeTakeawaySlide(activeSlideIdx - 1)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 border border-purple-700 text-xs font-bold disabled:opacity-30 inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>
                    <span className="text-xs font-mono font-bold text-orange-300">
                      Slide {activeSlideIdx + 1} / {notes.speakerSlides.length}
                    </span>
                    <button
                      type="button"
                      disabled={activeSlideIdx >= notes.speakerSlides.length - 1}
                      onClick={() => handleChangeTakeawaySlide(activeSlideIdx + 1)}
                      className="px-2.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold disabled:opacity-30 inline-flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* All 5 Slides with Active Slide Highlighted & Key Words Bolded/Underlined */}
                {notes.speakerSlides.map((slide, idx) => {
                  const isActive = idx === activeSlideIdx;
                  return (
                    <div
                      key={slide.title}
                      onClick={() => handleChangeTakeawaySlide(idx)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                        isActive
                          ? 'bg-purple-900/90 border-2 border-orange-400 shadow-lg'
                          : 'bg-purple-950/80 border-purple-800 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-black text-orange-300 font-cinzel">
                          {slide.title}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-mono font-bold uppercase shrink-0">
                            On Screen
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-purple-300 bg-purple-950/70 px-3 py-1.5 rounded-lg border border-purple-800/80">
                        <strong className="text-orange-200">Slide visual:</strong> {slide.visual}
                      </div>
                      <div className="space-y-2.5 text-xs sm:text-sm text-purple-100 leading-relaxed">
                        {slide.script.map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* 3 Main Takeaways */}
                {notes.mainTakeaways && (
                  <div className="p-5 rounded-2xl bg-purple-950/90 border border-orange-400/50 space-y-3">
                    <div className="text-xs font-mono uppercase font-bold text-orange-400">
                      3 Main Takeaways
                    </div>
                    <div className="space-y-2.5">
                      {notes.mainTakeaways.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-purple-900/70 border border-purple-800 text-xs text-purple-100 leading-relaxed">
                          <strong className="text-orange-300 block mb-0.5">{idx + 1}. {item.heading}:</strong>
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Standard Goal + Bullets Mode for Game Phases */
              <div className="p-5 rounded-2xl bg-purple-950/90 border border-purple-800 space-y-3">
                <div className="text-xs font-mono uppercase font-bold text-orange-400">
                  Goal for This Screen
                </div>
                <p className="text-sm text-purple-100 leading-relaxed font-semibold">
                  {notes.goal}
                </p>

                <ul className="space-y-2 pt-2 border-t border-purple-800/80 text-xs sm:text-sm text-purple-200">
                  {(notes.bullets || []).map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Live Private Tribute Monitor + Collapsible Research Quick Facts */}
          <div className="lg:col-span-5 space-y-4 self-start">
            <div className="p-5 rounded-2xl bg-purple-950/90 border border-purple-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase font-bold text-orange-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Live Tributes ({tributes.length}/15)
                </div>
                <span className="text-[11px] font-mono text-purple-400">Phase: {phase}</span>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {sortedTributes.map((t) => {
                  const dist = DISTRICTS.find(d => d.id === t.districtId) || DISTRICTS[0];
                  const p1 = game?.choices?.[t.id];
                  const p2 = game?.p2Choices?.[t.id];
                  const p3L = game?.p3Locations?.[t.id];
                  const p3A = game?.p3Actions?.[t.id];
                  const p4 = game?.p4Fire?.[t.id];
                  return (
                    <div key={t.id} className="p-3 rounded-xl bg-purple-900/60 border border-purple-800 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white truncate">
                          {t.realName} <span className="text-purple-400 font-normal">({dist.name})</span>
                        </span>
                        <span className="font-mono font-black text-orange-300 shrink-0">
                          {t.totalScore ?? 0} pts
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-purple-300">
                        {t.allianceName && <span className="px-1.5 py-0.5 rounded bg-purple-800">{t.allianceName}</span>}
                        {t.arenaTool && <span className="px-1.5 py-0.5 rounded bg-orange-900/70 text-orange-200">🛠️ Tool</span>}
                        {p1 && <span className="px-1.5 py-0.5 rounded bg-purple-800">P1: {p1.strategy} ({p1.responseTime}s)</span>}
                        {p2 && <span className="px-1.5 py-0.5 rounded bg-purple-800">P2: {p2.choice}</span>}
                        {p3L && <span className="px-1.5 py-0.5 rounded bg-purple-800">P3: {p3L}{p3A ? `/${p3A}` : ''}</span>}
                        {p4 && <span className="px-1.5 py-0.5 rounded bg-purple-800">P4: {p4}</span>}
                      </div>
                    </div>
                  );
                })}
                {sortedTributes.length === 0 && (
                  <p className="text-xs text-purple-400 italic text-center py-6">
                    No tributes joined yet.
                  </p>
                )}
              </div>
            </div>

            {/* Collapsible Research Quick Facts Box (Right Below Scores) */}
            <div className="rounded-2xl bg-purple-950/90 border border-orange-400/40 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowResearchFacts(!showResearchFacts)}
                className="w-full px-5 py-3.5 flex items-center justify-between gap-2 text-left hover:bg-purple-900/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <div className="text-xs font-mono uppercase font-bold text-orange-400">
                      Research Quick Facts
                    </div>
                    <div className="text-[11px] text-purple-300">
                      Sample size, experiment design &amp; stats (click to {showResearchFacts ? 'collapse' : 'expand'})
                    </div>
                  </div>
                </div>
                {showResearchFacts ? (
                  <ChevronUp className="w-4 h-4 text-orange-300 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-orange-300 shrink-0" />
                )}
              </button>

              {showResearchFacts && (
                <div className="px-5 pb-5 pt-2 border-t border-purple-800 space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs font-black font-cinzel text-white leading-snug">
                      {RESEARCH_QUICK_FACTS.title}
                    </div>
                    <div className="text-[11px] font-mono text-purple-300">
                      {RESEARCH_QUICK_FACTS.authors} • {RESEARCH_QUICK_FACTS.journal}
                    </div>
                    <a
                      href={RESEARCH_QUICK_FACTS.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-orange-300 hover:text-orange-200 underline"
                    >
                      <span>Open Full Paper (PMC)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-2 pt-1">
                    {RESEARCH_QUICK_FACTS.facts.map((item) => (
                      <div key={item.key} className="p-2.5 rounded-xl bg-purple-900/60 border border-purple-800/90 text-xs">
                        <span className="font-mono font-bold text-orange-300 uppercase text-[10px] block mb-0.5">
                          {item.key}
                        </span>
                        <span className="text-purple-100 leading-relaxed">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';
import { DISTRICTS } from '../data/hungerGamesData';
import { BookOpen, Users, Timer, Pause, Play, ExternalLink, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

const PHASE1_SPEAKER_SLIDES = [
  {
    title: 'Slide 1: Title & The Central Question (~45 seconds)',
    visual: 'Decision Making Under Time Pressure: A Prospect Theory Approach — Young, Goodie, Hall, & Wu (2012, OBHDP).',
    script: [
      '"We make choices under deadlines every day—from quick market trades and urgent project calls to emergency responses. Earlier decision research gave us two clashing stories about what deadlines do to risk: one camp argued time pressure makes people more cautious and risk-averse, while another—like Busemeyer’s sequential-comparison work—suggested people become more risk-seeking when expected value is positive, and more risk-averse when it’s negative."',
      '"In this 2012 study, Young, Goodie, Hall, and Wu tested how time pressure shapes risk by fitting participants’ certainty equivalents into a formal prospect theory model—separating how we value outcomes from how we weight probabilities."'
    ]
  },
  {
    title: 'Slide 2: Experimental Setup & Model (~60 seconds)',
    visual: 'Modified Georgia Gambling Task + Prospect Theory parameters: risk attractiveness, probability discriminability, and outcome utility.',
    script: [
      '"Across three experiments with undergraduate participants, the researchers compared an unlimited-time group against a time-pressure group—giving 10 seconds on the first screen of a narrowing-down task and 5 seconds on each follow-up screen. Time pressure worked: participants responded roughly twice as fast and violated the clock on only a small fraction of bets."',
      '"Using nonlinear mixed-effects modeling on certainty equivalents, the authors tracked three psychological mechanisms: risk attractiveness (elevation of probability weighting), probability discriminability (sensitivity to differences in probability), and outcome utility (how sharply value changes with payoff size). They tested gains-only bets using both random odds and U.S. state population confidence wagers, and then tested loss-only bets."'
    ]
  },
  {
    title: 'Slide 3: Gains Domain — Experiments 1 & 2 (~75 seconds)',
    visual: 'Gains-Only Bets (Experiments 1 & 2): Higher risk attractiveness under time pressure; no main-effect shift in probability discriminability or value curvature.',
    script: [
      '"In Experiment 1, participants faced gains-only bets across higher win probabilities—from 51% to 99%—with real-money payout potential. Under time pressure, risk attractiveness increased significantly, both overall and on random bets alone, while outcome utility and overall probability discriminability did not shift significantly at the main-effect level."',
      '"Experiment 2 broadened the probability range down below 50% using six-state population comparisons and hypothetical stakes. Again, time pressure increased overall risk attractiveness across the wider probability spectrum—showing the pattern holds across both real and hypothetical incentives, though with one twist: in the random condition without time pressure, participants showed higher probability discriminability than under time pressure."'
    ]
  },
  {
    title: 'Slide 4: Losses Domain — Experiment 3 (~60 seconds)',
    visual: 'Loss-Only Bets (Experiment 3): Steep risk-seeking in both groups; lower probability discriminability under time pressure.',
    script: [
      '"What happens when the framing flips to pure losses? In Experiment 3, participants estimated how much they’d pay to avoid loss-only gambles—backed by cash endowments and real loss risk."',
      '"Here, participants in both conditions showed strong risk-seeking behavior—reflected in elevated probability weighting curves and willingness to gamble rather than pay out—which may have created a ceiling effect that masked any extra shift in risk attractiveness. Crucially, however, time pressure significantly reduced probability discriminability, meaning stressed participants were less sensitive to differences across loss probabilities."'
    ]
  },
  {
    title: 'Slide 5: Limitations & Wrap-Up (~45 seconds)',
    visual: 'Key caveats: Hypothetical stakes in Exp. 2, narrowing/matching elicitation vs. direct choice, and a shared 3-station lab room.',
    script: [
      '"A few caveats matter when reading these numbers: Experiment 2 used hypothetical stakes, the task used a narrowing-down matching format rather than simple binary choice, and sessions ran in a shared three-workstation room where subtle social dynamics could play a role."',
      '"Overall, the paper shows that time pressure doesn’t just speed us up—it shifts specific cognitive levers depending on whether we’re looking at potential gains or potential losses."'
    ]
  }
];

const PHASE1_MAIN_TAKEAWAYS = [
  {
    heading: 'Deadlines boost risk attractiveness for gains',
    text: 'Across both narrow (51%–99%) and broad probability ranges—and with real or hypothetical stakes—time pressure made gains-framed risks look more attractive without changing outcome utility at the main-effect level.'
  },
  {
    heading: 'Deadlines blunt probability sensitivity for losses',
    text: 'In loss-framed gambles, extreme baseline risk-seeking appeared in both groups, while time pressure impaired how well participants discriminated between probabilities.'
  },
  {
    heading: 'Time pressure acts selectively rather than uniformly',
    text: 'Rather than simply making people universally more reckless or more cautious, deadlines affect distinct prospect-theory mechanisms differently across the gains and losses domains.'
  }
];

const PHASE3_SPEAKER_SLIDES = [
  {
    title: '1. Hook & Why Time Distorts Choice (~45 seconds)',
    visual: "Time's Influence: A Systematic Review of Biases in Intertemporal Decision-Making — Taş, Maknoon, & Rezaei (2026, Annual Review of Psychology).",
    script: [
      '"Think about a decision you made recently where a smaller reward or easier option right now competed with a bigger payoff later—putting off a workout, buying something on impulse, or underestimating how long a project would take. Classical economics assumes we discount the future at a steady, rational rate and stick to consistent preferences over time."',
      '"In their 2026 Annual Review of Psychology paper, \'Time\'s Influence: A Systematic Review of Biases in Intertemporal Decision-Making,\' Pelin Gülüm Taş, Yousef Maknoon, and Jafar Rezaei examine why real human choices drift off course. After screening bias taxonomies and reviewing 215 peer-reviewed empirical human studies across Web of Science and Scopus, they organize the literature around six time-related biases that warp how we perceive time, value outcomes, and make trade-offs."'
    ]
  },
  {
    title: '2. The Six Time-Related Biases (~2 minutes)',
    visual: 'Six biases across 215 studies: Present (78), Impact (37), Duration Neglect (25), Planning Fallacy (25), Projection (18), Recency (7).',
    script: [
      '"The first two biases center on how we weight now versus later and how we project today onto tomorrow. Present bias—the most studied in the review with 78 empirical papers—is our pull toward immediate rewards or relief over larger future gains. It shows up in credit card debt, delayed smoking cessation, lower uptake of preventive screenings, and reluctance to pay upfront for energy-efficient appliances or solar panels. Projection bias (18 studies) happens when we assume our current tastes, emotions, or physical conditions—like hunger, cold weather, or poor air quality—will carry unchanged into the future, or when we project our own preferences onto others, such as estimating a partner\'s end-of-life care wishes."',
      '"The next two biases involve how sequence and duration shape memory and evaluation. Recency bias (7 studies) gives outsized weight to the most recent information or events—like lowering risk tolerance after a market drop or basing crop insurance choices on recent weather. Duration neglect (25 studies) means we judge an experience largely by its most intense moment and its ending—the peak-end rule—rather than its total length. That affects voter reactions, travel memories, student interest, and even medical screenings, where adding a less painful final step can improve pain recall and return rates."',
      '"Finally, two biases distort how we forecast feelings and effort ahead. Impact bias (37 studies) leads us to overestimate how intensely and how long we will feel emotions in the future, driven by focalism—narrowly fixating on one event—and immune neglect, or underestimating our psychological coping and adaptation. And the planning fallacy (25 studies) leads us to underestimate the time, cost, effort, and risks of future tasks due to overoptimism."'
    ]
  },
  {
    title: '3. Interrelationships & Mitigation Strategies (~1 minute 15 seconds)',
    visual: 'Bias overlaps (loss aversion, salience, anchoring, optimism) + tailored mitigation toolkits.',
    script: [
      '"A major contribution of this review is mapping how these biases overlap with each other and with broader behavioral factors. Present bias frequently pairs with loss aversion or risk aversion; projection bias overlaps with salience and optimism bias; recency bias aligns with anchoring; impact bias interacts with hot-cold empathy gaps and recollection or hindsight biases; and the planning fallacy travels closely with optimism, memory, and anchoring biases—while standing apart from direct co-occurrence with the other five time-related biases in the reviewed studies."',
      '"Because these distortions carry real personal and societal costs, the authors catalog mitigation strategies tailored to each bias. For present and projection biases, precommitment devices, waiting or cooling-off periods, loss or future-date framing, episodic future thinking (mentally simulating concrete future scenarios), incentives, and joint decision-making help counter short-term pull. For recency bias and the planning fallacy, accountability, reversing evaluation order, unpacking tasks into smaller steps, backward planning, checking past reference data, and taking an outside third-person perspective add realism. For duration neglect and impact bias, reordering sequences, spacing evaluations, using surrogate experiences from people who went through similar events, considering multiple co-occurring events, and building emotional intelligence help broaden perspective."'
    ]
  },
  {
    title: '4. Research Gaps & Closing (~45 seconds)',
    visual: 'Descriptive vs. prescriptive gap + 3 Main Takeaways.',
    script: [
      '"At the same time, Taş, Maknoon, and Rezaei point out a clear imbalance in the literature: most studies are descriptive rather than prescriptive, and we still lack well-tested mitigation tools tailored to specific contexts or capable of separating overlapping biases. Future work needs stronger real-world experiments, clearer ways to distinguish interacting biases, and better policy and decision tools."',
      '"If you take away just three points from this review: first, six distinct time-related biases systematically bend intertemporal choices; second, they reshape everyday decisions in finance, health, environment, and planning—often alongside other biases; and third, targeted tools like waiting periods, mental simulation, backward planning, and outside perspectives can help, though prescriptive testing still has room to grow."'
    ]
  }
];

const PHASE3_MAIN_TAKEAWAYS = [
  {
    heading: 'Human choices violate constant discounting across six distinct time biases',
    text: 'Rather than weighting future costs and benefits smoothly over time, people bend decisions around immediate gratification (present bias), current states or weather (projection bias), recent events (recency bias), peaks and endings (duration neglect), distorted emotional forecasts (impact bias), and optimistic schedules (planning fallacy).'
  },
  {
    heading: 'Biases compound and distort high-stakes domains',
    text: 'Synthesizing 215 empirical studies, the review shows these biases shape personal debt, health screening and lifestyle habits, green technology adoption, voting, and project timelines—often interacting with broader factors like loss aversion, salience, anchoring, and optimism bias.'
  },
  {
    heading: 'Effective mitigation requires shifting friction, framing, and perspective—and the field needs more prescriptive testing',
    text: 'Tools like precommitment devices, cooling-off/waiting periods, episodic future thinking, backward planning, and outside perspectives help, yet the authors emphasize that current research is heavily descriptive and needs stronger real-world testing of tailored interventions.'
  }
];

const LESSON_PAPER_OPTIONS = {
  lesson: [
    '1. Time Pressure (Young, Goodie, Hall, & Wu, 2012)',
    '2. Risk Perception (Perlstein, 2023)',
    '3. Social Influence (Bergquist & Ekelund, 2025)'
  ],
  p2_lesson: [
    '1. Cooperation & Social Dilemmas (Lo Iacono et al., 2024)',
    '2. Social Identity & Group Loyalty (Imada et al., 2024)',
    '3. Trust (Composto et al., 2025)'
  ],
  p3_lesson: [
    '1. Present Bias (Taş, Maknoon & Rezaei, 2026)',
    '2. Risk Perception (Perlstein, 2023)',
    '3. Effort & Reward Value (Campbell, Wang & Inzlicht, 2025)'
  ],
  p4_lesson: [
    '1. Cognitive Flexibility (Egner & Siqi-Liu, 2024)',
    '2. Stress & Decision-Making (Doroc, Yadav & Murawski, 2025)',
    '3. Escalation of Commitment (2025 Review)'
  ],
  p5_lesson: [
    '1. Halo Effect (Mattavelli et al., 2026)',
    '2. Elaboration Likelihood Model (Petty, 2021)',
    '3. First Impressions (Swider et al., 2026)'
  ]
};

const PHASE_NOTES = {
  lobby: {
    title: 'Waiting Room / The Woods',
    goal: 'Wait for all tributes to join, confirm everyone appears on their pedestal, then start the next phase.',
    bullets: [
      'Share Screen 1 (your main Arena tab switched to Player View) so everyone sees the clean screen.',
      'Keep THIS Presenter Notes window on your private monitor or phone — it stays synced live automatically!'
    ],
    papers: []
  },
  intro: {
    title: 'Phase 1 — The Cornucopia (Intro)',
    goal: 'Build suspense without revealing the 3 options yet.',
    bullets: [
      'Remind tributes: every decision impacts how the rest of the Games turns out.',
      'Set the countdown seconds (30s works well for ~10 people) and start the round.'
    ],
    papers: []
  },
  choice: {
    title: 'Phase 1 — Live Voting',
    goal: 'Let tributes choose privately while the countdown runs.',
    bullets: [
      'Cornucopia: 50% base risk (+20 pts + Survival Tool Kit if alive); steep last-5-second penalty.',
      'Outskirts: 25% base risk (min 10% floor, +16 pts); moderate last-5-second penalty.',
      'Woods: 0% risk (+12 pts guaranteed). Timeout = automatic death (-2 pts).'
    ],
    papers: []
  },
  results: {
    title: 'Phase 1 — Poll Breakdown',
    goal: 'Comment on how the room split before revealing who fell.',
    bullets: [
      'Ask: "Why did so many of you play it safe / rush the center?"',
      'Click Reveal Consequences when ready.'
    ],
    papers: []
  },
  consequences: {
    title: 'Phase 1 — Consequences Revealed',
    goal: 'Highlight that falling is -5 marks (NOT eliminated — everyone keeps playing).',
    bullets: [
      'Cornucopia survivors secretly received a Survival Tool Kit.',
      'Scores stay visible only to each individual player.'
    ],
    papers: []
  },
  lesson: {
    title: 'Phase 1 Teaching Notes — Decision Making Under Time Pressure',
    paperLink: {
      label: 'Young, Goodie, Hall, & Wu (2012, OBHDP) — PMC3375992',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3375992/'
    },
    speakerSlides: PHASE1_SPEAKER_SLIDES,
    mainTakeaways: PHASE1_MAIN_TAKEAWAYS,
    papers: []
  },
  p2_intro: {
    title: 'Phase 2 — Alliances vs Going Solo (Announcement)',
    goal: 'Read the Gamemaker announcement aloud dramatically.',
    bullets: [
      '"An ally could protect you, share resources and help you survive. But remember… there can only be one victor."',
      'Recommended timer: 60–90 seconds.'
    ],
    papers: []
  },
  p2_choice: {
    title: 'Phase 2 — Live Alliance Voting',
    goal: 'Track how many choose Alliance vs Solo.',
    bullets: [
      'Alliance seekers will be randomly paired into teams of 2 (or one team of 3 if odd).',
      'Solo players play the rest of the game independently.'
    ],
    papers: []
  },
  p2_alliances: {
    title: 'Phase 2 — Alliance Assignments',
    goal: 'Give newly formed teams 30 seconds to acknowledge their partner(s).',
    bullets: [
      'Notice how quickly people start rooting for a partner they were just randomly assigned!'
    ],
    papers: []
  },
  p2_lesson: {
    title: 'Phase 2 Teaching Notes — Trust vs Independence',
    goal: 'Explain why trust expectations and group identity shape cooperation.',
    bullets: [
      'Participants weigh what a partner offers against the risk of betrayal or coordination failure.',
      'Even random group assignment immediately creates an in-group vs out-group dynamic.'
    ],
    papers: [
      {
        concept: 'Cooperation & social dilemmas',
        cite: 'Lo Iacono, Sonmez & Fairbrother (2024)',
        note: 'Preregistered experiment (n = 371): higher-trust contexts significantly encouraged collective solutions.',
        url: 'https://scholar.google.com/scholar?q=Lo+Iacono+Sonmez+Fairbrother+2024+effect+of+trusting+contexts+in+social+dilemmas'
      },
      {
        concept: 'Social identity & group loyalty',
        cite: 'Imada, Mifune & Shimizu (2024)',
        note: 'Explores psychological mechanisms behind ingroup favouritism in cooperation.',
        url: 'https://scholar.google.com/scholar?q=Imada+Mifune+Shimizu+2024+Psychological+mechanisms+underlying+ingroup+favouritism'
      },
      {
        concept: 'Trust',
        cite: 'Composto et al. (2025)',
        note: 'Changing norms of trust — how trust expectations shift under uncertainty and shared threats.',
        url: 'https://scholar.google.com/scholar?q=Composto+2025+Changing+norms+of+trust'
      }
    ]
  },
  p3_intro: {
    title: 'Phase 3 — Finding Water (Announcement)',
    goal: 'Do NOT reveal that the furthest source is cleanest before Decision 1.',
    bullets: [
      'Remind alliance teams to communicate — mismatched choices cost -3 pts each!',
      'Further travel = higher chance of ambush (-5); drinking unfiltered water = guaranteed sick (-2).'
    ],
    papers: []
  },
  p3_location: {
    title: 'Phase 3 — Decision 1 (Location)',
    goal: 'Observe who picks convenience (2m puddle) vs effort (25m stream).',
    bullets: ['Puddle: +10 | Pond: +13 | Stream: +16', 'Team mismatch on location = -3 pts each.'],
    papers: []
  },
  p3_purify: {
    title: 'Phase 3 — Decision 2 (Drink vs Purify)',
    goal: 'Watch who saves time vs plays it safe.',
    bullets: ['Purify: +4 pts', 'Drink unfiltered: guaranteed sick (-2 pts)', 'Team member with Phase 1 Tool: +2 bonus to entire team!'],
    papers: []
  },
  p3_outcome: {
    title: 'Phase 3 — Water Outcomes',
    goal: 'Review location %, purify %, and how many teams coordinated vs mismatched.',
    bullets: ['Point out that walking further brought higher points AND higher travel risk.'],
    papers: []
  },
  p3_lesson: {
    title: "Phase 3 Teaching Notes — The Psychology of Choice (Time's Influence)",
    paperLink: {
      label: 'Taş, Maknoon, & Rezaei (2026, Annual Review of Psychology)',
      url: 'https://www.annualreviews.org/content/journals/10.1146/annurev-psych-091924-040158'
    },
    speakerSlides: PHASE3_SPEAKER_SLIDES,
    mainTakeaways: PHASE3_MAIN_TAKEAWAYS,
    papers: []
  },
  p4_intro: {
    title: "Phase 4 — Gamemakers' Twist (Announcement)",
    goal: 'Set up the turning point: Fire Disaster followed by The Feast.',
    bullets: ['Timeout = automatic death (-2 pts)!'],
    papers: []
  },
  p4_event: {
    title: 'Phase 4 — Fire Disaster',
    goal: 'Watch who moves downhill (+4), climbs a tree (-3 / 60% death), or ditches gear (+5).',
    bullets: ['Next step triggers The Feast scenario.'],
    papers: []
  },
  p4_twist: {
    title: 'Phase 4 — The Feast',
    goal: 'Watch who skips (+5), scouts (+1), or sprints for their pack (+3 & +1 vote, or 50% death -5).',
    bullets: ['Remind players: high reward comes with real risk!'],
    papers: []
  },
  p4_outcome: {
    title: 'Phase 4 — Fire & Feast Outcomes',
    goal: 'Compare survival rates across Fire Disaster and The Feast.',
    bullets: ['Anyone who timed out automatically died (-2 pts).'],
    papers: []
  },
  p4_lesson: {
    title: 'Phase 4 Teaching Notes — Adapt or Fall Behind',
    goal: 'Teach cognitive flexibility, stress under pressure, and escalation of commitment.',
    bullets: [
      'Speaking Script: "One interesting psychological concept is escalation of commitment — people sometimes continue with a decision even when it is no longer working, simply because they have already invested in it."',
      '"Changing your mind is not a sign of weakness — sometimes it is a sign you recognised the situation has changed."'
    ],
    papers: [
      {
        concept: 'Cognitive flexibility',
        cite: 'Egner & Siqi-Liu (2024)',
        note: 'Task-switching research showing how we regulate readiness to shift strategies when circumstances change.',
        url: 'https://scholar.google.com/scholar?q=Egner+Siqi-Liu+2024+control+over+cognitive+flexibility+task-switching'
      },
      {
        concept: 'Stress & decision-making',
        cite: 'Doroc, Yadav & Murawski (2025)',
        note: 'Experimental evidence showing how acute stress impairs decision quality across complexity levels.',
        url: 'https://scholar.google.com/scholar?q=Doroc+Yadav+Murawski+2025+Acute+stress+impairs+decision-making'
      },
      {
        concept: 'Escalation of commitment',
        cite: 'Strategic Decision-Making Review (2025)',
        note: 'Reviews cognitive biases including escalation of commitment and loss aversion in strategic decisions.',
        url: 'https://scholar.google.com/scholar?q=A+review+of+cognitive+biases+in+strategic+decision+making+2025'
      }
    ]
  },
  p5_intro: {
    title: 'Phase 5 — Win Over the Sponsors (Intro)',
    goal: 'Introduce the final persuasion challenge.',
    bullets: ['Tributes write a short pitch to convince the Capitol to sponsor them.'],
    papers: []
  },
  p5_pitch: {
    title: 'Phase 5 — Sponsor Pitches',
    goal: 'Wait for pitches to come in, then set the voting duration and open anonymous voting.',
    bullets: ['Names will be hidden (Tribute A, B, C...) during voting so everyone votes purely on the pitch.'],
    papers: []
  },
  p5_vote: {
    title: 'Phase 5 — Anonymous Sponsor Voting',
    goal: 'Track live votes cast (nobody can vote for themselves; not voting costs -4 pts).',
    bullets: ['1st: +5 pts | 2nd: +3 pts | 3rd: +1 pt (sponsor score only).'],
    papers: []
  },
  p5_winner: {
    title: 'Phase 5 — Sponsor Winner Reveal',
    goal: 'Celebrate the Capitol Favourite Tribute before the final psychology slide.',
    bullets: ['Move to the learning slide, then crown the overall Victor across all 5 phases!'],
    papers: []
  },
  p5_lesson: {
    title: 'Phase 5 Teaching Notes — The Power of Perception',
    goal: 'Connect sponsor voting to Halo Effect, ELM, and First Impressions.',
    bullets: [
      'Speaking Script: "Think about who you voted for — did you choose the strongest argument, or the pitch that made the best impression?"',
      '"Being capable and being perceived as capable are not always the same thing."'
    ],
    papers: [
      {
        concept: 'Halo effect',
        cite: 'Mattavelli et al. (2026)',
        note: 'If Immoral Then Unable: Asymmetric generalizations in social judgment — how one trait colours our view of others.',
        url: 'https://scholar.google.com/scholar?q=Mattavelli+2026+If+Immoral+Then+Unable'
      },
      {
        concept: 'Elaboration Likelihood Model',
        cite: 'Petty (2021)',
        note: 'How arguments, credibility, message style, and audience factors shape persuasion.',
        url: 'https://scholar.google.com/scholar?q=Petty+2021+Persuasion+amidst+a+pandemic+Elaboration+Likelihood+Model'
      },
      {
        concept: 'First impressions',
        cite: 'Swider et al. (2026)',
        note: 'Meta-analysis of 204 samples across 145 studies on how first impressions form and influence outcomes at work.',
        url: 'https://scholar.google.com/scholar?q=Swider+2026+First+Impressions+at+Work+Meta-Analytic+Review'
      }
    ]
  },
  finale: {
    title: 'Grand Finale — Victor & Reflection',
    goal: 'Celebrate the Victor, expand score breakdowns on the leaderboard, and close with the reflection question.',
    bullets: [
      'Click any tribute row on the Final Leaderboard to show where they gained/lost points across all 5 phases.',
      'Ask 2–3 people: "What did the Games reveal about how you make decisions?"'
    ],
    papers: []
  }
};

export default function PresenterNotes() {
  const [tributes, setTributes] = useState([]);
  const [timer, setTimer] = useState({ running: false, countdown: 30, duration: 30 });
  const [game, setGame] = useState(syncService.getGame());

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
  const lessonPaperOptions = LESSON_PAPER_OPTIONS[phase] || null;
  const activeSlideIdx = game?.takeawaySlideIndex ?? 0;

  const handleToggleTimer = () => {
    syncService.controlTimer(timer.running ? 'pause' : 'start', timer.duration || 30);
  };

  const handleSelectPaper = (idx) => {
    syncService.controlGame('select_lesson_topic', undefined, { index: idx });
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
            {lessonPaperOptions && (
              <>
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
                <select
                  aria-label="Select presented paper"
                  value={game?.selectedLessonIndex ?? 0}
                  onChange={(e) => handleSelectPaper(parseInt(e.target.value, 10) || 0)}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-900 border border-orange-400/50 text-xs font-mono text-orange-200 focus:outline-none cursor-pointer"
                  title="Silently switch which paper is shown on the shared screen"
                >
                  {lessonPaperOptions.map((label, idx) => (
                    <option key={label} value={idx}>{label}</option>
                  ))}
                </select>
              </>
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
            {/* Multi-Slide Speaker Script Mode (Phase 1 Psychology Takeaway) */}
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

                {/* All 5 Slides with Active Slide Highlighted */}
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
                      <div className="space-y-2 text-xs sm:text-sm text-purple-100 leading-relaxed">
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
              /* Standard Goal + Bullets Mode for Other Phases */
              <div className="p-5 rounded-2xl bg-purple-950/90 border border-purple-800 space-y-3">
                <div className="text-xs font-mono uppercase font-bold text-orange-400">
                  Goal for This Screen
                </div>
                <p className="text-sm text-purple-100 leading-relaxed font-semibold">
                  {notes.goal}
                </p>

                <ul className="space-y-2 pt-2 border-t border-purple-800/80 text-xs sm:text-sm text-purple-200">
                  {notes.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {notes.papers.length > 0 && (
              <div className="p-5 rounded-2xl bg-purple-950/90 border border-purple-800 space-y-3">
                <div className="text-xs font-mono uppercase font-bold text-orange-400">
                  Research Papers &amp; Talking Points
                </div>
                <div className="space-y-3">
                  {notes.papers.map((p, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-purple-900/70 border border-purple-700/80 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-white uppercase">{p.concept}</span>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-orange-300 hover:text-orange-200 underline"
                        >
                          <span>{p.cite}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-purple-200 leading-relaxed">{p.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Private Tribute Monitor */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-purple-950/90 border border-purple-800 space-y-3 self-start">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase font-bold text-orange-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Live Tributes ({tributes.length}/15)
              </div>
              <span className="text-[11px] font-mono text-purple-400">Phase: {phase}</span>
            </div>

            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
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
        </div>
      </div>
    </div>
  );
}

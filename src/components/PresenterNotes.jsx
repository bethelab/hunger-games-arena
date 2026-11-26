import React, { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';
import { DISTRICTS } from '../data/hungerGamesData';
import { BookOpen, Users, Timer, Pause, Play, ExternalLink } from 'lucide-react';

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
      'Set the countdown seconds (30s works well for ~10 people) and sound the gong.'
    ],
    papers: []
  },
  choice: {
    title: 'Phase 1 — Live Voting',
    goal: 'Let tributes choose privately while the countdown runs.',
    bullets: [
      'Cornucopia: 50% base risk (+20 pts + Survival Tool Kit if alive); steep last-5-second penalty.',
      'Outskirts: 25% base risk (min 10% floor, +16 pts); moderate last-5-second penalty.',
      'Woods: 0% risk (+12 pts guaranteed).'
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
    title: 'Phase 1 Teaching Notes — Risk vs Reward',
    goal: 'Connect the Cornucopia choices to modern risk, social influence, and loss aversion research.',
    bullets: [
      'When tributes decide whether to rush the Cornucopia, they weigh rewards (+20 + Tool) against losses (-5).',
      'Under uncertainty and time pressure, what others appear to be doing pulls our choices — even when crowding raises danger.'
    ],
    papers: [
      {
        concept: 'Risk perception',
        cite: 'Perlstein (2023)',
        note: 'Systematic review showing risk judgments are shaped by social discussion and how people interpret danger.',
        url: 'https://scholar.google.com/scholar?q=Perlstein+2023+Risk+perception+and+interpersonal+discussion+on+risk'
      },
      {
        concept: 'Social influence',
        cite: 'Bergquist & Ekelund (2025)',
        note: 'Emotion regulation & normative influence under uncertainty — social norms pull hardest when outcomes are uncertain.',
        url: 'https://scholar.google.com/scholar?q=Bergquist+Ekelund+2025+role+of+emotion+regulation+in+normative+influence+under+uncertainty'
      },
      {
        concept: 'Loss aversion',
        cite: 'Li et al. (2024)',
        note: 'Psychological & neural representations of loss aversion in social conformity — fear of losing (-5) outweighs equivalent gains.',
        url: 'https://scholar.google.com/scholar?q=Li+2024+role+of+loss+aversion+in+social+conformity'
      }
    ]
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
    title: 'Phase 3 Teaching Notes — The Psychology of Choice',
    goal: 'Discuss present bias, risk perception, and how effort affects perceived value.',
    bullets: [
      'Present bias pulls us toward immediate convenience (puddle / drinking immediately).',
      'Effort increases perceived meaning, but working harder does not guarantee safety.'
    ],
    papers: [
      {
        concept: 'Present bias',
        cite: 'Taş, Maknoon & Rezaei (2026)',
        note: "Time's Influence: Systematic review of biases in intertemporal decision-making (immediate vs future rewards).",
        url: 'https://scholar.google.com/scholar?q=Tas+Maknoon+Rezaei+2026+Time+Influence+Intertemporal+Decision-Making'
      },
      {
        concept: 'Risk perception',
        cite: 'Perlstein (2023)',
        note: 'How people interpret and discuss uncertain risks — clear water looks safe even when hidden risks exist.',
        url: 'https://scholar.google.com/scholar?q=Perlstein+2023+Risk+perception+and+interpersonal+discussion+on+risk'
      },
      {
        concept: 'Effort & reward value',
        cite: 'Harmon-Jones et al. (2024) + Campbell, Wang & Inzlicht (2025)',
        note: 'Effort-reward valuation depends on perceived control (2024). Across 6 studies (n = 2,883), exerting effort increased perceived meaning — without being post-hoc justification (2025).',
        url: 'https://scholar.google.com/scholar?q=Campbell+Wang+Inzlicht+2025+Experimental+evidence+that+exerting+effort+increases+meaning'
      }
    ]
  },
  p4_intro: {
    title: "Phase 4 — Gamemakers' Twist (Announcement)",
    goal: 'Set up the turning point: "You are not in control of this arena. We are."',
    bullets: ['Not responding before time runs out costs -8 pts!'],
    papers: []
  },
  p4_event: {
    title: 'Phase 4 — Wall of Fire (Initial Move)',
    goal: 'Solo players see Stay / River; alliances also see Find Your Alliance.',
    bullets: ['Next step triggers a random twist (Fire / Weather / Alliance / Resources) with a 15-second rethink.'],
    papers: []
  },
  p4_twist: {
    title: 'Phase 4 — Random Twist (15s Rethink)',
    goal: 'Watch who sticks with their original plan vs pivots.',
    bullets: ['Both sticking and changing earn full adaptation points as long as they respond in time!'],
    papers: []
  },
  p4_outcome: {
    title: 'Phase 4 — Adaptation Outcomes',
    goal: 'Compare % who stuck vs % who changed plan.',
    bullets: ['Anyone who froze and timed out lost -8 pts.'],
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
    goal: 'Wait for pitches to come in, then open anonymous voting.',
    bullets: ['Names will be hidden (Tribute A, B, C...) during voting so everyone votes purely on the pitch.'],
    papers: []
  },
  p5_vote: {
    title: 'Phase 5 — Anonymous Sponsor Voting',
    goal: 'Track live votes cast (nobody can vote for themselves).',
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

  const handleToggleTimer = () => {
    syncService.controlTimer(timer.running ? 'pause' : 'start', timer.duration || 30);
  };

  return (
    <div className="min-h-screen bg-[#1E1030] text-purple-50 p-4 sm:p-6">
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

          <div className="flex items-center gap-2.5">
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
          <div className="lg:col-span-5 p-5 rounded-2xl bg-purple-950/90 border border-purple-800 space-y-3">
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
                const p4 = game?.p4Initial?.[t.id];
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
                      {p4 && <span className="px-1.5 py-0.5 rounded bg-purple-800">P4: {p4.move}</span>}
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

import React from 'react';
import { Lightbulb, RotateCcw, ExternalLink } from 'lucide-react';

const PHASE2_THEORIES = [
  {
    letter: 'A',
    title: "The Prisoner's Dilemma",
    subtitle: 'Cooperation vs self-interest',
    citation: 'Flood & Dresher (1950); Tucker',
    paperUrl: 'https://plato.stanford.edu/entries/prisoner-dilemma/',
    summary:
      'Explores a situation where two people can achieve a better collective outcome by cooperating, but each has an individual incentive to betray the other.',
    bullets: [
      'If both cooperate, both benefit.',
      'If one betrays the other, the betrayer may gain an advantage.',
      'If both betray each other, both may end up worse off.'
    ],
    lesson: "What is best for an individual isn't always what's best for the group."
  },
  {
    letter: 'B',
    title: 'Social exchange theory',
    subtitle: "What's in it for me?",
    citation: 'Thibaut & Kelley, 1959',
    paperUrl: 'https://doi.org/10.4324/9781315135007',
    summary:
      'Explores how people evaluate relationships based partly on rewards, costs and alternatives.',
    bullets: [
      'What can this person offer me?',
      'What will I have to give up?',
      'Can I trust them?',
      'Would I be better off alone?'
    ],
    lesson: 'Relationships often involve an ongoing evaluation of benefits, costs and expectations.'
  },
  {
    letter: 'C',
    title: 'Social identity theory',
    subtitle: 'The power of belonging',
    citation: 'Tajfel & Turner, 1979',
    paperUrl: 'https://psycnet.apa.org/record/1980-50576-001',
    summary:
      'Shows that people categorise themselves and others into groups, and that group membership can influence how they see and treat people.',
    bullets: [
      'Forming an alliance creates an in-group.',
      'Other tributes become outsiders.',
      'People may favour their own alliance, even when they barely know its members.'
    ],
    lesson: 'Simply feeling that we belong to a group can influence our behaviour.'
  }
];

export default function Phase2Lesson({ isGamemaker, onBackToWoods }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-6 sm:p-10 space-y-7">
        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono-capitol uppercase">
            <Lightbulb className="w-3.5 h-3.5" />
            Phase 2 Takeaway
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-cinzel text-purple-950 tracking-wide uppercase">
            TRUST, ALLIANCES &amp; GROUPS
          </h2>
          <p className="text-sm sm:text-base font-medium text-purple-700">
            What does psychology tell us about cooperating vs. going solo?
          </p>
        </div>

        {/* 3 Theory Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PHASE2_THEORIES.map((theory) => (
            <div
              key={theory.letter}
              className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-black font-mono-capitol uppercase text-orange-600">
                    {theory.letter}. {theory.subtitle}
                  </span>
                  <h3 className="text-base font-black font-cinzel text-purple-950 mt-0.5">
                    {theory.title}
                  </h3>
                </div>

                <p className="text-xs text-purple-800 leading-relaxed">
                  {theory.summary}
                </p>

                <ul className="space-y-1 text-xs text-purple-900">
                  {theory.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-purple-100">
                <div className="p-2.5 rounded-xl bg-white border border-orange-200 text-xs text-purple-950">
                  <span className="font-bold text-orange-700">Lesson: </span>
                  {theory.lesson}
                </div>

                <a
                  href={theory.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono-capitol font-bold text-orange-700 hover:text-purple-900 underline underline-offset-2 transition-colors"
                >
                  <span>{theory.citation}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Gamemaker Return / Tribute Wait */}
        {isGamemaker ? (
          <div className="text-center pt-1">
            <button
              onClick={onBackToWoods}
              className="px-7 py-3 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Return to The Woods
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-purple-500 font-mono-capitol">
            Waiting for Gamemaker to continue...
          </div>
        )}
      </div>
    </div>
  );
}

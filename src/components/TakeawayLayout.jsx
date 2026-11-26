import React from 'react';
import { BookOpen, ExternalLink, PauseCircle } from 'lucide-react';

export default function TakeawayLayout({
  phaseLabel,
  title,
  subtitle,
  closingLine,
  papers,
  selectedIndex = 0,
  isGamemaker,
  onSelectTopic,
  presenterNote,
  extraBottom,
  actionButton
}) {
  const safeIndex = Math.max(0, Math.min(papers.length - 1, selectedIndex || 0));
  const featured = papers[safeIndex];
  const subPapers = papers
    .map((p, idx) => ({ ...p, originalIndex: idx }))
    .filter((_, idx) => idx !== safeIndex);

  return (
    <div className="flex-1 bg-slate-100/95 border-t-4 border-teal-600 px-4 py-6 sm:py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-5">
        {/* Clear Visual Separator Banner: NOT part of gameplay */}
        <div className="rounded-2xl bg-slate-900 text-slate-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-teal-300">
            <PauseCircle className="w-4 h-4 shrink-0" />
            <span>Game Paused • Psychology Takeaway</span>
          </div>
          <span className="text-[11px] font-mono text-slate-300">
            Learning Moment — No Voting or Scoring
          </span>
        </div>

        {/* Main Editorial Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold font-mono uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              {phaseLabel}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-slate-900 tracking-wide uppercase">
              {title}
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Gamemaker Topic Selector: Pick 1 of the 3 papers to present */}
          {isGamemaker && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500 text-center">
                Gamemaker: Choose Which Paper to Present (Updates Everyone&apos;s Screen)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {papers.map((p, idx) => {
                  const active = idx === safeIndex;
                  return (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => onSelectTopic && onSelectTopic(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left border ${
                        active
                          ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      <span className="font-mono opacity-75 mr-1">{idx + 1}.</span>
                      {p.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MAIN FEATURED PAPER (1 Spotlight Paper) */}
          {featured && (
            <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/40 p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {featured.illustration && (
                  <div className="w-32 shrink-0 bg-white rounded-2xl border border-slate-200 p-3 flex items-center justify-center shadow-sm">
                    {featured.illustration}
                  </div>
                )}

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700">
                    Featured Research Concept
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-cinzel text-slate-900">
                    {featured.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {featured.description}
                  </p>
                  <div className="pt-1">
                    <a
                      href={featured.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 hover:text-slate-900 underline underline-offset-2 transition-colors"
                    >
                      <span>{featured.citation}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {isGamemaker && featured.presenterDetail && (
                <div className="p-3.5 rounded-xl bg-white border border-teal-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-teal-800 uppercase font-mono text-[10px] block mb-1">
                    Presenter Talking Point
                  </span>
                  {featured.presenterDetail}
                </div>
              )}
            </div>
          )}

          {/* OTHER 2 PAPERS AS COMPACT SUB-PAPERS */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Related Sub-Papers
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {subPapers.map((sp) => (
                <div
                  key={sp.title}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{sp.title}</span>
                    {isGamemaker && onSelectTopic && (
                      <button
                        type="button"
                        onClick={() => onSelectTopic(sp.originalIndex)}
                        className="text-[10px] font-mono font-bold text-teal-700 hover:underline shrink-0"
                      >
                        Feature
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{sp.description}</p>
                  <a
                    href={sp.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500 hover:text-teal-700 underline underline-offset-2"
                  >
                    <span>{sp.citation}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {closingLine && (
            <p className="text-center text-xs sm:text-sm font-bold text-slate-800 font-mono pt-1">
              {closingLine}
            </p>
          )}

          {isGamemaker && presenterNote && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800 leading-relaxed">
              <span className="font-bold text-amber-800 uppercase font-mono text-[10px] block mb-1">
                Gamemaker Context
              </span>
              {presenterNote}
            </div>
          )}

          {extraBottom}

          {/* Action / Wait Footer */}
          <div className="pt-2 border-t border-slate-100 text-center">
            {isGamemaker ? (
              actionButton
            ) : (
              <span className="text-xs text-slate-500 font-mono">
                Game resumes when the Gamemaker continues...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

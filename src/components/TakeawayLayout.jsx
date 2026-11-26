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
    <div className="flex-1 bg-[#FFF7ED] border-t-4 border-orange-500 px-4 py-6 sm:py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-5">
        {/* Deep Purple Banner: Game Paused */}
        <div className="rounded-2xl bg-purple-950 text-orange-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-orange-300">
            <PauseCircle className="w-4 h-4 shrink-0" />
            <span>Game Paused • Psychology Takeaway</span>
          </div>
          <span className="text-[11px] font-mono text-purple-200">
            Learning Moment (Not Scored)
          </span>
        </div>

        {/* Main Card (Warm Orange & Purple Palette) */}
        <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-lg p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5 border-b border-orange-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-[11px] font-bold font-mono uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              {phaseLabel}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-purple-950 tracking-wide uppercase">
              {title}
            </h2>
            <p className="text-sm text-purple-700 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Gamemaker Topic Selector: Pick 1 of the 3 papers to present */}
          {isGamemaker && (
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-3 space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-orange-800 text-center">
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
                          ? 'bg-orange-600 text-white border-orange-700 shadow-sm'
                          : 'bg-white text-purple-900 border-orange-200 hover:border-orange-400'
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

          {/* MAIN FEATURED PAPER */}
          {featured && (
            <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/50 p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {featured.illustration && (
                  <div className="w-32 shrink-0 bg-white rounded-2xl border border-orange-200 p-3 flex items-center justify-center shadow-sm">
                    {featured.illustration}
                  </div>
                )}

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700">
                    Featured Research
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-cinzel text-purple-950">
                    {featured.title}
                  </h3>
                  <p className="text-sm sm:text-base text-purple-900 leading-relaxed">
                    {featured.description}
                  </p>
                  <div className="pt-1">
                    <a
                      href={featured.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-orange-700 hover:text-purple-950 underline underline-offset-2 transition-colors"
                    >
                      <span>{featured.citation}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {isGamemaker && featured.presenterDetail && (
                <div className="p-3.5 rounded-xl bg-white border border-orange-200 text-xs text-purple-900 leading-relaxed">
                  <span className="font-bold text-orange-700 uppercase font-mono text-[10px] block mb-1">
                    Presenter Talking Point
                  </span>
                  {featured.presenterDetail}
                </div>
              )}
            </div>
          )}

          {/* OTHER 2 PAPERS AS COMPACT SUB-PAPERS */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600">
              Related Sub-Papers
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {subPapers.map((sp) => (
                <div
                  key={sp.title}
                  className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-purple-950">{sp.title}</span>
                    {isGamemaker && onSelectTopic && (
                      <button
                        type="button"
                        onClick={() => onSelectTopic(sp.originalIndex)}
                        className="text-[10px] font-mono font-bold text-orange-700 hover:underline shrink-0"
                      >
                        Feature
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-purple-800 leading-snug">{sp.description}</p>
                  <a
                    href={sp.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-600 hover:text-orange-700 underline underline-offset-2"
                  >
                    <span>{sp.citation}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {closingLine && (
            <p className="text-center text-xs sm:text-sm font-bold text-purple-900 font-mono pt-1">
              {closingLine}
            </p>
          )}

          {isGamemaker && presenterNote && (
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
              <span className="font-bold text-purple-800 uppercase font-mono text-[10px] block mb-1">
                Gamemaker Context
              </span>
              {presenterNote}
            </div>
          )}

          {extraBottom}

          {/* Action / Wait Footer */}
          <div className="pt-2 border-t border-orange-100 text-center">
            {isGamemaker ? (
              actionButton
            ) : (
              <span className="text-xs text-purple-500 font-mono">
                Game resumes when the Gamemaker continues...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

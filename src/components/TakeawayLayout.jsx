import React, { useEffect } from 'react';
import { BookOpen, ExternalLink, PauseCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TakeawayLayout({
  phaseLabel,
  title,
  subtitle,
  closingLine,
  papers,
  selectedIndex = 0,
  takeawaySlideIndex = 0,
  isGamemaker,
  onSelectTopic,
  onChangeTakeawaySlide,
  presenterNote,
  extraBottom,
  actionButton
}) {
  const safeIndex = Math.max(0, Math.min(papers.length - 1, selectedIndex || 0));
  const featured = papers[safeIndex];
  const slides = featured?.slides || null;
  const totalSlides = slides ? slides.length : 0;
  const safeSlideIndex = slides
    ? Math.max(0, Math.min(totalSlides - 1, takeawaySlideIndex || 0))
    : 0;
  const activeSlide = slides ? slides[safeSlideIndex] : null;

  useEffect(() => {
    if (!isGamemaker || !slides || !onChangeTakeawaySlide) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' && safeSlideIndex < totalSlides - 1) {
        onChangeTakeawaySlide(safeSlideIndex + 1);
      } else if (e.key === 'ArrowLeft' && safeSlideIndex > 0) {
        onChangeTakeawaySlide(safeSlideIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isGamemaker, slides, safeSlideIndex, totalSlides, onChangeTakeawaySlide]);

  return (
    <div className="flex-1 bg-[#FFF7ED] border-t-4 border-orange-500 px-4 py-6 sm:py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-5">
        {/* Deep Purple Banner: Game Paused + Discreet Gamemaker-Only Paper Dropdown */}
        <div className="rounded-2xl bg-purple-950 text-orange-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-orange-300">
            <PauseCircle className="w-4 h-4 shrink-0" />
            <span>Game Paused • Psychology Takeaway</span>
          </div>

          <div className="flex items-center gap-3">
            {isGamemaker && papers.length > 1 && onSelectTopic && (
              <select
                aria-label="Select research paper"
                value={safeIndex}
                onChange={(e) => onSelectTopic(parseInt(e.target.value, 10) || 0)}
                className="text-[11px] font-mono bg-purple-900/90 text-purple-100 border border-purple-700 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400 cursor-pointer max-w-[200px] truncate"
                title="Switch active paper (hidden in Player View)"
              >
                {papers.map((p, idx) => (
                  <option key={p.title} value={idx}>
                    {idx + 1}. {p.shortTitle || p.title}
                  </option>
                ))}
              </select>
            )}
            <span className="text-[11px] font-mono text-purple-200">
              Learning Moment (Not Scored)
            </span>
          </div>
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

          {/* ================= MULTI-SLIDE PRESENTATION MODE ================= */}
          {featured && activeSlide ? (
            <div className="space-y-4">
              {/* Paper Title & Citation Link Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-orange-50/70 border border-orange-200">
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black font-cinzel text-purple-950">
                    {featured.title}
                  </div>
                  <a
                    href={featured.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-orange-700 hover:text-purple-950 underline underline-offset-2"
                  >
                    <span>{featured.citation}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                {/* Slide Counter & Progress Dots */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    {slides.map((s, idx) => (
                      <button
                        key={s.heading}
                        type="button"
                        disabled={!isGamemaker}
                        onClick={() => isGamemaker && onChangeTakeawaySlide && onChangeTakeawaySlide(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === safeSlideIndex
                            ? 'w-5 bg-orange-600'
                            : 'w-2 bg-orange-200 hover:bg-orange-400'
                        } ${isGamemaker ? 'cursor-pointer' : 'cursor-default'}`}
                        title={s.heading}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-purple-900 bg-white border border-orange-200 px-2 py-0.5 rounded-lg">
                    {safeSlideIndex + 1} / {totalSlides}
                  </span>
                </div>
              </div>

              {/* Slide Stage with Left/Right Arrows for Gamemaker */}
              <div className="flex items-center gap-2 sm:gap-3">
                {isGamemaker && (
                  <button
                    type="button"
                    disabled={safeSlideIndex === 0}
                    onClick={() => onChangeTakeawaySlide && onChangeTakeawaySlide(safeSlideIndex - 1)}
                    className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-purple-900 hover:bg-orange-100 hover:border-orange-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all shrink-0"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                <div className="flex-1 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-[#FFFBF5] to-orange-50/40 p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-orange-200 text-[10px] font-mono font-bold uppercase">
                      {activeSlide.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black font-cinzel text-purple-950 leading-snug">
                    {activeSlide.heading}
                  </h3>

                  {activeSlide.content}
                </div>

                {isGamemaker && (
                  <button
                    type="button"
                    disabled={safeSlideIndex >= totalSlides - 1}
                    onClick={() => onChangeTakeawaySlide && onChangeTakeawaySlide(safeSlideIndex + 1)}
                    className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-purple-900 hover:bg-orange-100 hover:border-orange-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all shrink-0"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ================= SINGLE-CARD FEATURED PAPER MODE ================= */
            featured && (
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
            )
          )}

          {closingLine && (
            <p className="text-center text-xs sm:text-sm font-bold text-purple-900 font-mono pt-1">
              {closingLine}
            </p>
          )}

          {isGamemaker && presenterNote && !activeSlide && (
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

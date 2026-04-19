"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  FileText,
  ImageIcon,
  LayoutTemplate,
  Minimize2,
  X
} from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import type { LessonSlide } from "@/lib/lesson-slides";

type Props = {
  slides: LessonSlide[];
  lessonTitle: string;
};

function SlideStage({
  activeSlide,
  lessonTitle,
  progressLabel,
  downloading,
  onDownload,
  showFullscreenAction,
  fullscreen,
  onToggleFullscreen
}: {
  activeSlide: LessonSlide;
  lessonTitle: string;
  progressLabel: string;
  downloading: boolean;
  onDownload: () => void;
  showFullscreenAction?: boolean;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative aspect-video",
        activeSlide.imageUrl ? "bg-slate-900" : "bg-[linear-gradient(145deg,_rgba(15,23,42,0.95),_rgba(22,78,99,0.82))]"
      )}
    >
      {activeSlide.imageUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeSlide.imageUrl})` }}
            role="img"
            aria-label={activeSlide.title || lessonTitle}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.18)_28%,rgba(2,6,23,0.5)_62%,rgba(2,6,23,0.9)_100%)]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_28%),linear-gradient(145deg,_rgba(15,23,42,0.96),_rgba(17,24,39,0.92))]" />
      )}

      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur-sm">
        Slide {progressLabel}
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-2">
        {activeSlide.imageUrl ? (
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5" />
            {downloading ? "..." : "Download"}
          </button>
        ) : null}
        {showFullscreenAction ? (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:bg-black/50"
          >
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Expand className="h-3.5 w-3.5" />}
            {fullscreen ? "Esci" : "Fullscreen"}
          </button>
        ) : null}
      </div>

      <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
        <div className="max-w-3xl rounded-[1.7rem] border border-white/10 bg-slate-950/52 p-5 backdrop-blur-md md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-2xl font-semibold leading-tight text-white md:text-4xl">
                {activeSlide.title || lessonTitle}
              </h3>
              {activeSlide.body ? (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base md:leading-8">
                  {activeSlide.body}
                </p>
              ) : (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base md:leading-8">
                  Questa slide usa il visual come contenuto principale. Quando aggiungerai più testo, comparirà qui in modo ordinato.
                </p>
              )}
            </div>

            {!activeSlide.imageUrl ? (
              <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 md:block">
                <ImageIcon className="h-5 w-5" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LessonSlideDeck({ slides, lessonTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const activeSlide = slides[activeIndex];
  const totalSlides = slides.length;

  const progressLabel = useMemo(
    () => `${String(activeIndex + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`,
    [activeIndex, totalSlides]
  );

  useEffect(() => {
    if (!fullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
      if (event.key === "ArrowRight") setActiveIndex((current) => Math.min(totalSlides - 1, current + 1));
      if (event.key === "ArrowLeft") setActiveIndex((current) => Math.max(0, current - 1));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fullscreen, totalSlides]);

  if (!activeSlide) return null;

  async function handleDownload() {
    if (!activeSlide.imageUrl || downloading) return;

    const filenameBase = slugify(activeSlide.title || lessonTitle || `slide-${activeIndex + 1}`) || "slide";
    const filename = `${filenameBase}-${String(activeIndex + 1).padStart(2, "0")}.jpg`;

    try {
      setDownloading(true);
      const response = await fetch(activeSlide.imageUrl);
      if (!response.ok) throw new Error("download-failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(activeSlide.imageUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <section className="rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,_rgba(17,94,89,0.18),_transparent_45%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(15,23,42,0.88))] p-5 text-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.65)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
              <LayoutTemplate className="h-3.5 w-3.5" />
              Deck della lezione
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold">Sfoglia le slide in un player dedicato</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Ogni slide si apre in un formato 16:9 stabile, con immagine in evidenza, download diretto e modalità presentazione fullscreen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {totalSlides} slide disponibili
            </div>
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-50"
            >
              <Expand className="h-4 w-4" />
              Modalità fullscreen
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-black/20 shadow-[0_24px_50px_-32px_rgba(15,23,42,0.72)]">
            <SlideStage
              activeSlide={activeSlide}
              lessonTitle={lessonTitle}
              progressLabel={progressLabel}
              downloading={downloading}
              onDownload={handleDownload}
              showFullscreenAction
              onToggleFullscreen={() => setFullscreen(true)}
            />

            <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/70 px-4 py-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Precedente
              </button>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{progressLabel}</div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setActiveIndex((current) => Math.min(totalSlides - 1, current + 1))}
                disabled={activeIndex === totalSlides - 1}
              >
                Successiva
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {slides.map((slide, index) => {
              const active = index === activeIndex;

              return (
                <button
                  key={`${lessonTitle}-slide-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-full rounded-[1.5rem] border p-4 text-left transition",
                    active
                      ? "border-emerald-300/30 bg-white/10 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.5)]"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/45 text-emerald-200">
                      {slide.imageUrl ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Slide {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {slide.title || `Slide ${String(index + 1).padStart(2, "0")}`}
                      </div>
                      <div className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
                        {slide.body || "Visual o contenuto sintetico disponibile in questa slide."}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {fullscreen ? (
        <div className="fixed inset-0 z-[120] bg-[rgba(2,6,23,0.94)] p-4 backdrop-blur-md md:p-8">
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  Modalità presentazione
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{lessonTitle}</div>
              </div>

              <div className="flex items-center gap-3">
                {activeSlide.imageUrl ? (
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download className="h-4 w-4" />
                    {downloading ? "Download..." : "Scarica slide"}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <X className="h-4 w-4" />
                  Chiudi
                </button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
                <SlideStage
                  activeSlide={activeSlide}
                  lessonTitle={lessonTitle}
                  progressLabel={progressLabel}
                  downloading={downloading}
                  onDownload={handleDownload}
                  showFullscreenAction
                  fullscreen
                  onToggleFullscreen={() => setFullscreen(false)}
                />
              </div>

              <div className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
                <div className="border-b border-white/10 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Sequenza slide
                </div>
                <div className="space-y-3 overflow-y-auto p-4">
                  {slides.map((slide, index) => {
                    const active = index === activeIndex;

                    return (
                      <button
                        key={`fullscreen-${lessonTitle}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "w-full rounded-[1.4rem] border p-4 text-left transition",
                          active
                            ? "border-emerald-300/30 bg-white/10 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.5)]"
                            : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                        )}
                      >
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Slide {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white">
                          {slide.title || `Slide ${String(index + 1).padStart(2, "0")}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Precedente
              </button>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{progressLabel}</div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setActiveIndex((current) => Math.min(totalSlides - 1, current + 1))}
                disabled={activeIndex === totalSlides - 1}
              >
                Successiva
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

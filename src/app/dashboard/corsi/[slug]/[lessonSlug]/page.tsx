import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Download,
  Layers3,
  LayoutTemplate,
  PlayCircle,
  Sparkles
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { ProgressToggle } from "@/components/course/progress-toggle";
import { LessonSlideDeck } from "@/components/course/lesson-slide-deck";
import { ButtonLink } from "@/components/ui/button";
import { parseLessonSlides } from "@/lib/lesson-slides";
import { cn } from "@/lib/utils";

const lessonTypeLabels = {
  VIDEO: "Video lezione",
  ARTICLE: "Lezione testuale",
  DOWNLOAD: "Materiale scaricabile",
  QUIZ: "Quiz"
} as const;

function getLessonPresentationLabel({
  lessonType,
  hasRealVideo,
  hasSlides
}: {
  lessonType: keyof typeof lessonTypeLabels;
  hasRealVideo: boolean;
  hasSlides: boolean;
}) {
  if (lessonType === "VIDEO" && !hasRealVideo && hasSlides) return "Slide della lezione";
  return lessonTypeLabels[lessonType];
}

type Props = {
  params: Promise<{ slug: string; lessonSlug: string }>;
};

export default async function LessonPage({ params }: Props) {
  const user = await requireUser();
  const { slug, lessonSlug } = await params;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      course: { slug }
    },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  progress: {
                    where: { userId: user.id }
                  }
                },
                orderBy: { sortOrder: "asc" }
              }
            },
            orderBy: { sortOrder: "asc" }
          }
        }
      }
    }
  });

  if (!enrollment) notFound();

  const lessonEntries = enrollment.course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson) => ({
      lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      moduleIndex
    }))
  );

  const currentIndex = lessonEntries.findIndex((entry) => entry.lesson.slug === lessonSlug);
  if (currentIndex === -1) notFound();

  const currentEntry = lessonEntries[currentIndex];
  const currentLesson = currentEntry.lesson;
  const previousLesson = currentIndex > 0 ? lessonEntries[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessonEntries.length - 1 ? lessonEntries[currentIndex + 1] : null;
  const completed = currentLesson.progress[0]?.completed || false;
  const lessonSlides = parseLessonSlides(currentLesson.slides);
  const hasSlides = lessonSlides.length > 0;
  const hasRealVideo = Boolean(currentLesson.videoUrl?.trim());
  const contentBlocks = currentLesson.content
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
  const completedLessons = lessonEntries.filter((entry) => entry.lesson.progress[0]?.completed).length;
  const overallProgress = lessonEntries.length ? Math.round((completedLessons / lessonEntries.length) * 100) : 0;
  const currentStep = currentIndex + 1;
  const heroImage = enrollment.course.coverImage || lessonSlides[0]?.imageUrl || null;
  const richContentCount = [hasRealVideo, hasSlides, currentLesson.downloadUrl, currentLesson.content.trim()].filter(Boolean).length;
  const currentPresentationLabel = getLessonPresentationLabel({
    lessonType: currentLesson.lessonType,
    hasRealVideo,
    hasSlides
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#061018_0%,#0b1522_18%,#eef3f7_18%,#f8fafc_100%)]">
      <Container className="space-y-8 py-6 md:space-y-10 md:py-8">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 text-white shadow-[0_42px_120px_-58px_rgba(2,6,23,0.9)]">
          <div className="relative">
            {heroImage ? (
              <div className="absolute inset-0">
                <div
                  className="h-full w-full bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${heroImage})` }}
                  role="img"
                  aria-label={currentLesson.title}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.82)_52%,rgba(2,6,23,0.68)_100%)]" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.28),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_26%),linear-gradient(145deg,_#020617_0%,_#0f172a_100%)]" />
            )}

            <div className="relative grid gap-8 p-6 md:p-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/corsi/${enrollment.course.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/[0.14]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Torna al programma
                  </Link>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    {hasSlides && !hasRealVideo ? "Slide mode" : "Lesson mode"}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                    {currentEntry.moduleTitle} · Lezione {String(currentStep).padStart(2, "0")}
                  </div>
                  <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                    {currentLesson.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
                    {currentLesson.summary || "Studia in un ambiente più immersivo: contenuti in evidenza, materiali chiari e un ritmo che ti tiene dentro la lezione."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-slate-100">
                    <BookOpen className="h-4 w-4 text-emerald-200" />
                    {currentPresentationLabel}
                  </span>
                  {currentLesson.durationLabel ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-slate-100">
                      <Clock3 className="h-4 w-4 text-slate-300" />
                      {currentLesson.durationLabel}
                    </span>
                  ) : null}
                  {hasSlides ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-slate-100">
                      <LayoutTemplate className="h-4 w-4 text-cyan-200" />
                      {lessonSlides.length} {lessonSlides.length === 1 ? "slide" : "slide"}
                    </span>
                  ) : null}
                  {currentLesson.downloadUrl ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-slate-100">
                      <Download className="h-4 w-4 text-amber-200" />
                      Allegato disponibile
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {previousLesson ? (
                    <ButtonLink href={`/dashboard/corsi/${enrollment.course.slug}/${previousLesson.lesson.slug}`} variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Precedente
                    </ButtonLink>
                  ) : null}
                  {nextLesson ? (
                    <ButtonLink href={`/dashboard/corsi/${enrollment.course.slug}/${nextLesson.lesson.slug}`} className="bg-white text-slate-950 hover:bg-emerald-50">
                      Lezione successiva
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </ButtonLink>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-md">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">Stato sessione</div>
                <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                  <span>Step del corso</span>
                  <span className="font-semibold text-white">
                    {currentStep}/{lessonEntries.length}
                  </span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-200" style={{ width: `${overallProgress}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.05] p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Avanz.</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{overallProgress}%</div>
                  </div>
                  <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.05] p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Contenuti</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{richContentCount}</div>
                  </div>
                </div>
                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4">
                  <ProgressToggle lessonId={currentLesson.id} completed={completed} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <article className="rounded-[2.2rem] border border-slate-200/80 bg-white p-6 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.26)] md:p-8">
            {currentLesson.lessonType === "VIDEO" && hasRealVideo ? (
              <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_34%),linear-gradient(145deg,_#0f172a_0%,_#111827_100%)] p-6 text-white shadow-[0_26px_60px_-40px_rgba(15,23,42,0.7)] md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Video della lezione
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold">Apri il contenuto principale e studia con un layout pulito</h2>
                    <p className="mt-3 text-sm leading-8 text-slate-300">
                      Il video resta in evidenza all&apos;inizio della lezione, così l&apos;accesso al contenuto principale è immediato anche da mobile.
                    </p>
                  </div>

                  <a
                    href={currentLesson.videoUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-50"
                  >
                    Apri il video
                  </a>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-950/50 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.8)]">
                  <div
                    className="relative aspect-video bg-cover bg-center"
                    style={
                      heroImage
                        ? { backgroundImage: `url(${heroImage})` }
                        : {
                            backgroundImage:
                              "radial-gradient(circle at top left, rgba(45,212,191,0.18), transparent 25%), linear-gradient(145deg, #0b1120 0%, #111827 100%)"
                          }
                    }
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.22)_0%,rgba(2,6,23,0.55)_58%,rgba(2,6,23,0.82)_100%)]" />

                    <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                      Area player
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
                        <PlayCircle className="h-11 w-11" />
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <div className="rounded-[1.35rem] border border-white/10 bg-black/45 p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-4 text-sm text-white">
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{currentLesson.title}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                              Qui comparirà il video caricato
                            </div>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
                            {currentLesson.durationLabel || "Durata lezione"}
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[32%] rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-200" />
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <span>00:00</span>
                            <span>Player demo</span>
                            <span>{currentLesson.durationLabel || "22:00"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {currentLesson.lessonType === "VIDEO" && !hasRealVideo && hasSlides ? (
              <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_34%),linear-gradient(145deg,_#0f172a_0%,_#111827_100%)] p-6 text-white shadow-[0_26px_60px_-40px_rgba(15,23,42,0.7)] md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      <LayoutTemplate className="h-3.5 w-3.5" />
                      Slide della lezione
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold">Questa lezione si apre direttamente con le slide</h2>
                    <p className="mt-3 text-sm leading-8 text-slate-300">
                      Non c&apos;è un video caricato per questa lezione: il contenuto principale è qui sotto, già pronto da sfogliare in modo chiaro anche da mobile.
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200">
                    {lessonSlides.length} {lessonSlides.length === 1 ? "slide disponibile" : "slide disponibili"}
                  </div>
                </div>
              </section>
            ) : null}

            {hasSlides ? (
              <div className={cn(hasRealVideo ? "mt-8" : "")}>
                <LessonSlideDeck slides={lessonSlides} lessonTitle={currentLesson.title} />
              </div>
            ) : null}

              <section className={cn("space-y-6", hasRealVideo || hasSlides ? "mt-8" : "")}>
                <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50/90 p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                      <Layers3 className="h-4 w-4 text-brand-700" />
                      Contenuto della lezione
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                      <BookOpen className="h-4 w-4 text-brand-700" />
                      {currentEntry.moduleTitle}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      {completed ? "Lezione già completata" : "Ancora da completare"}
                    </span>
                  </div>
                </div>

                {contentBlocks.map((block, index) => (
                  <div
                    key={`${currentLesson.id}-${index}`}
                    className="rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(145deg,_#ffffff_0%,_#f8fafc_100%)] p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.15)] md:p-8"
                  >
                    <p className="text-[17px] leading-9 text-slate-700 md:text-[18px]">{block}</p>
                  </div>
                ))}
              </section>

            {currentLesson.downloadUrl ? (
                <div className="mt-4 rounded-[1.8rem] border border-emerald-100 bg-emerald-50/90 p-5 shadow-[0_16px_36px_-30px_rgba(16,185,129,0.18)] md:p-6">
                <div className="flex items-start gap-3">
                  <Download className="mt-0.5 h-5 w-5 text-emerald-700" />
                  <div>
                    <div className="font-semibold text-slate-900">Materiale scaricabile</div>
                    <a
                      href={currentLesson.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-sm font-medium text-emerald-700"
                    >
                      Scarica l&apos;allegato
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
            </article>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.22)]">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Panoramica corso</div>
              <div className="mt-4 space-y-4">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Corso</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">{enrollment.course.title}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Step</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">
                      {currentStep}/{lessonEntries.length}
                    </div>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Avanz.</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">{overallProgress}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.22)]">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Lezioni del corso</div>
              <div className="mt-4 space-y-3">
                {lessonEntries.map((entry, index) => {
                  const entryCompleted = entry.lesson.progress[0]?.completed || false;

                  return (
                    <Link
                      key={entry.lesson.id}
                      href={`/dashboard/corsi/${enrollment.course.slug}/${entry.lesson.slug}`}
                      className={cn(
                        "block rounded-[1.6rem] border px-4 py-4 transition",
                        entry.lesson.id === currentLesson.id
                          ? "border-slate-950 bg-slate-950 text-white shadow-[0_26px_60px_-38px_rgba(15,23,42,0.72)]"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] opacity-70">
                          Lezione {String(index + 1).padStart(2, "0")}
                        </div>
                        {entryCompleted ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : null}
                      </div>
                      <div className="mt-2 text-sm font-semibold leading-6">{entry.lesson.title}</div>
                      <div className="mt-1 text-xs opacity-80">{entry.moduleTitle}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Download,
  FileText,
  LayoutTemplate,
  PlayCircle,
  Sparkles
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ProgressToggle } from "@/components/course/progress-toggle";
import { ButtonLink } from "@/components/ui/button";
import { parseLessonSlides } from "@/lib/lesson-slides";

const lessonTypeLabels = {
  VIDEO: "Video",
  ARTICLE: "Testo",
  DOWNLOAD: "Download",
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
  if (lessonType === "VIDEO" && !hasRealVideo && hasSlides) return "Slide";
  return lessonTypeLabels[lessonType];
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CourseLearningPage({ params }: Props) {
  const user = await requireUser();
  const { slug } = await params;

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
    module.lessons.map((lesson, lessonIndex) => ({
      lesson,
      module,
      moduleIndex,
      lessonIndex,
      completed: lesson.progress[0]?.completed || false
    }))
  );

  const firstLesson = lessonEntries[0]?.lesson;
  const nextLessonEntry = lessonEntries.find((entry) => !entry.completed) || lessonEntries[0];
  const totalLessons = enrollment.course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = lessonEntries.filter((entry) => entry.completed).length;
  const totalModules = enrollment.course.modules.length;
  const heroImage = enrollment.course.coverImage || enrollment.course.gallery[0] || null;

  return (
    <>
      <PageHero
        badge="Area corso"
        title={enrollment.course.title}
        description="Un hub di corso più ampio, più leggibile e molto più piacevole prima di entrare nelle lezioni vere e proprie."
      />

      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar pathname="/dashboard/corsi" />

        <div className="space-y-8">
          <section className="overflow-hidden rounded-[2.4rem] border border-slate-200/80 bg-white shadow-[0_28px_70px_-46px_rgba(15,23,42,0.16)]">
            <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="p-6 md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  Course hub
                </div>

                <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                  Riprendi il corso con chiarezza.
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  Qui trovi subito il prossimo passo, l&apos;avanzamento e l&apos;accesso alle lezioni. Meno rumore, più ordine.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Avanzamento</div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{enrollment.progressPercent}%</div>
                  </div>
                  <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Moduli</div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{totalModules}</div>
                  </div>
                  <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Lezioni</div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{completedLessons}/{totalLessons}</div>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Prossimo step</div>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                    {nextLessonEntry ? nextLessonEntry.lesson.title : "Corso completato"}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    {nextLessonEntry
                      ? `Modulo ${String(nextLessonEntry.moduleIndex + 1).padStart(2, "0")} · ${nextLessonEntry.module.title}`
                      : "Hai completato tutte le lezioni disponibili. Puoi rientrare in qualsiasi momento per ripassare."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {nextLessonEntry ? (
                      <ButtonLink href={`/dashboard/corsi/${enrollment.course.slug}/${nextLessonEntry.lesson.slug}`}>
                        {completedLessons > 0 ? "Continua il percorso" : "Inizia il percorso"}
                      </ButtonLink>
                    ) : null}
                    {firstLesson ? (
                      <ButtonLink href={`/dashboard/corsi/${enrollment.course.slug}/${firstLesson.slug}`} variant="outline">
                        Apri la prima lezione
                      </ButtonLink>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-slate-950 xl:border-l xl:border-t-0">
                <div
                  className="relative min-h-[280px] h-full bg-cover bg-center"
                  style={
                    heroImage
                      ? { backgroundImage: `url(${heroImage})` }
                      : {
                          backgroundImage:
                            "radial-gradient(circle at top left, rgba(45,212,191,0.22), transparent 24%), linear-gradient(145deg, #020617 0%, #0f172a 100%)"
                        }
                  }
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15)_0%,rgba(2,6,23,0.45)_48%,rgba(2,6,23,0.88)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="rounded-[1.6rem] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-md">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">Panoramica</div>
                      <div className="mt-3 text-2xl font-semibold">{enrollment.course.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            {enrollment.course.modules.map((module, index) => {
              const moduleEntries = lessonEntries.filter((entry) => entry.module.id === module.id);
              const completedInModule = moduleEntries.filter((entry) => entry.completed).length;
              const moduleProgress = moduleEntries.length ? Math.round((completedInModule / moduleEntries.length) * 100) : 0;

              return (
                <div key={module.id} className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_44px_-36px_rgba(15,23,42,0.16)]">
                  <div className="border-b border-[#17343d] bg-[linear-gradient(135deg,#0b2027_0%,#12323a_58%,#0f2a32_100%)] px-6 py-6 md:px-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/90">
                          Modulo {String(index + 1).padStart(2, "0")}
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{module.title}</h2>
                        {module.description ? (
                          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-100/80">{module.description}</p>
                        ) : null}
                      </div>

                      <div className="flex min-w-[240px] items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-sm">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-sm text-slate-100/85">
                            <span>Avanzamento</span>
                            <span className="font-semibold text-white">{moduleProgress}%</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                            <div className="h-full rounded-full bg-emerald-300" style={{ width: `${moduleProgress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const completed = lesson.progress[0]?.completed || false;
                      const lessonSlides = parseLessonSlides(lesson.slides);
                      const hasSlides = lessonSlides.length > 0;
                      const hasRealVideo = Boolean(lesson.videoUrl?.trim());
                      const lessonHref = `/dashboard/corsi/${enrollment.course.slug}/${lesson.slug}`;

                      return (
                        <div key={lesson.id} className="px-5 py-5 transition hover:bg-slate-50/80 md:px-6">
                          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                  Lezione {String(lessonIndex + 1).padStart(2, "0")}
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                                  {lesson.lessonType === "VIDEO" && hasRealVideo ? (
                                    <PlayCircle className="h-3.5 w-3.5" />
                                  ) : hasSlides ? (
                                    <LayoutTemplate className="h-3.5 w-3.5" />
                                  ) : (
                                    <FileText className="h-3.5 w-3.5" />
                                  )}
                                  {getLessonPresentationLabel({
                                    lessonType: lesson.lessonType,
                                    hasRealVideo,
                                    hasSlides
                                  })}
                                </span>
                                {lessonSlides.length ? (
                                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                                    <LayoutTemplate className="h-3.5 w-3.5" />
                                    {lessonSlides.length} slide
                                  </span>
                                ) : null}
                                {lesson.downloadUrl ? (
                                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                                    <Download className="h-3.5 w-3.5" />
                                    Allegato
                                  </span>
                                ) : null}
                                {completed ? (
                                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-900">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Completata
                                  </span>
                                ) : null}
                              </div>

                              <Link href={lessonHref} className="group mt-4 block">
                                <h3 className="max-w-3xl text-lg font-semibold leading-tight text-slate-950 transition group-hover:text-brand-900 md:text-[1.35rem]">
                                  {lesson.title}
                                </h3>
                                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-[15px]">
                                  {(lesson.summary || lesson.content.slice(0, 190)).trim()}...
                                </p>
                              </Link>
                            </div>

                            <div className="flex flex-col items-start gap-3 xl:min-w-[220px] xl:items-end">
                              <ButtonLink href={lessonHref} className="w-full justify-center xl:w-auto">
                                <PlayCircle className="mr-2 h-4 w-4" />
                                {hasSlides && !hasRealVideo ? "Apri slide" : "Apri lezione"}
                              </ButtonLink>
                              <div className="rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
                                <ProgressToggle lessonId={lesson.id} completed={completed} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </Container>
    </>
  );
}

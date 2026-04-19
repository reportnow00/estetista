import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, LockKeyhole, PlayCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { FeaturedCourseCarousel } from "@/components/home/featured-course-carousel";
import { comingSoonCourses } from "@/components/ui/coming-soon-course-card";
import { cn, formatPrice } from "@/lib/utils";
import type { Course, CourseTeacher, Teacher } from "@prisma/client";

const lockedAccentStyles = {
  brand: {
    panel:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.26),transparent_30%),linear-gradient(180deg,rgba(17,24,39,0.24)_0%,rgba(3,7,18,0.18)_22%,rgba(3,7,18,0.88)_100%),linear-gradient(145deg,#0b1220_0%,#0f2d43_46%,#08131f_100%)]",
    glow: "bg-cyan-300/24"
  },
  emerald: {
    panel:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(52,211,153,0.24),transparent_30%),linear-gradient(180deg,rgba(17,24,39,0.24)_0%,rgba(3,7,18,0.18)_22%,rgba(3,7,18,0.88)_100%),linear-gradient(145deg,#081119_0%,#143042_46%,#081018_100%)]",
    glow: "bg-emerald-300/24"
  }
} as const;

const certificationBullets = [
  "Percorso con impostazione tecnica coerente con il lavoro sul campo",
  "Attestato finale e materiali di supporto inclusi",
  "Indicazioni chiare su validita professionale e spendibilita del percorso",
  "Contenuti aggiornati e organizzati in modo semplice da consultare"
] as const;

type FeaturedCourse = Course & {
  teachers: (CourseTeacher & { teacher: Teacher })[];
};

export function FeaturedCourseSection({ course }: { course: FeaturedCourse | null }) {
  const catalogItems = course
    ? [
        {
          id: course.id,
          kind: "live" as const,
          title: course.title,
          subtitle: course.shortDescription,
          href: `/corsi/${course.slug}`,
          image:
            course.coverImage ||
            "https://images.unsplash.com/photo-1518611012118-2969c6370238?q=80&w=1400&auto=format&fit=crop",
          priceLabel: formatPrice(course.salePriceCents ?? course.fullPriceCents),
          badge: course.badges[0] || "Corso live"
        },
        ...comingSoonCourses.map((item) => ({
          id: item.id,
          kind: "locked" as const,
          title: item.title,
          subtitle: item.description,
          eyebrow: item.eyebrow,
          accent: item.accent
        }))
      ]
    : comingSoonCourses.map((item) => ({
        id: item.id,
        kind: "locked" as const,
        title: item.title,
        subtitle: item.description,
        eyebrow: item.eyebrow,
        accent: item.accent
      }));

  return (
    <section className="relative -mt-10 overflow-hidden bg-[#070b12] pb-18 text-white sm:-mt-12 sm:pb-22 lg:-mt-16">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0)_0%,#070b12_16%,#070b12_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_18%),radial-gradient(circle_at_90%_18%,rgba(16,185,129,0.12),transparent_20%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] opacity-10" />

      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_35px_90px_-48px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="inline-flex items-center rounded-full border border-cyan-300/12 bg-cyan-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Certificazioni e validita
            </div>
            <h2 className="mt-5 max-w-[13ch] font-display text-3xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-[3rem]">
              Un percorso pensato per essere utile, non solo bello da mostrare.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              Trovi informazioni chiare su attestato finale, validita professionale e applicazione pratica del percorso
              nel lavoro di tutti i giorni.
            </p>

            <ul className="mt-7 space-y-3.5">
              {certificationBullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-200 sm:text-[15px]">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/12 text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08)_0%,rgba(125,211,252,0.08)_48%,rgba(255,255,255,0.04)_100%)] p-5 shadow-[0_35px_90px_-48px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-7 lg:p-8">
            <div className="mx-auto max-w-[29rem] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(241,245,249,0.94)_100%)] p-4 shadow-[0_24px_70px_-38px_rgba(148,163,184,0.45)] sm:p-6">
              <div className="rounded-[1.8rem] border-[8px] border-slate-800 bg-white px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-8 sm:py-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-slate-900">
                  <Award className="h-8 w-8" />
                </div>
                <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">
                  Attestato finale
                </div>
                <div className="mt-3 font-display text-[2rem] font-bold leading-[1.02] text-slate-950 sm:text-[2.4rem]">
                  Personal Trainer
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Un esempio del materiale finale che accompagna il tuo percorso formativo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <FeaturedCourseCarousel>
          {catalogItems.map((item) =>
              item.kind === "live" ? (
                <article
                  key={item.id}
                  className="group relative min-h-[430px] w-[76vw] min-w-[270px] max-w-[320px] snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_35px_90px_-42px_rgba(0,0,0,0.9)] sm:w-[330px] sm:min-w-[330px]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.08)_0%,rgba(5,7,12,0.22)_30%,rgba(5,7,12,0.76)_72%,rgba(5,7,12,0.94)_100%)]" />

                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-[#ff5a1f] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-20px_rgba(255,90,31,0.85)]">
                      Live
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                      {item.badge}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md transition duration-300 group-hover:scale-110">
                      <PlayCircle className="h-9 w-9" />
                    </div>
                  </div>

                  <div className="absolute inset-x-4 bottom-4">
                    <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,25,0.16),rgba(4,8,18,0.78))] p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] backdrop-blur-[18px]">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        Accesso immediato
                      </div>
                      <h3 className="mt-3 font-display text-[2.1rem] font-black leading-[0.94] tracking-[-0.05em] text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">{item.subtitle}</p>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                            Investimento
                          </div>
                          <div className="mt-1 text-xl font-black tracking-[-0.04em] text-white">
                            {item.priceLabel}
                          </div>
                        </div>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-50"
                        >
                          Apri corso
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                <article
                  key={item.id}
                  className="group relative min-h-[430px] w-[76vw] min-w-[270px] max-w-[320px] snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_35px_90px_-42px_rgba(0,0,0,0.9)] sm:w-[330px] sm:min-w-[330px]"
                >
                  <div className={cn("absolute inset-0", lockedAccentStyles[item.accent].panel)} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.08)_0%,rgba(5,7,12,0.24)_34%,rgba(5,7,12,0.82)_74%,rgba(5,7,12,0.96)_100%)]" />
                  <div
                    className={cn(
                      "absolute right-[-12%] top-[16%] h-36 w-36 rounded-full blur-3xl transition duration-500 group-hover:scale-110",
                      lockedAccentStyles[item.accent].glow
                    )}
                  />

                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-white/12 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      Bloccato
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/24 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
                      {item.eyebrow}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-black/28 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
                      <LockKeyhole className="h-8 w-8 text-white/90" />
                    </div>
                  </div>

                  <div className="absolute inset-x-4 bottom-4">
                    <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,25,0.12),rgba(4,8,18,0.82))] p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] backdrop-blur-[18px]">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Accesso riservato
                      </div>
                      <h3 className="mt-3 font-display text-[2rem] font-black leading-[0.94] tracking-[-0.05em] text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">{item.subtitle}</p>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                          Sblocco futuro
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                          Coming soon
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
          )}
        </FeaturedCourseCarousel>

        {!course ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-slate-300">
            Nessun corso pubblicato al momento.
          </div>
        ) : null}
      </Container>
    </section>
  );
}

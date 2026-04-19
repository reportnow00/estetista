import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, PlayCircle, Sparkles } from "lucide-react";
import { getPublishedCourses } from "@/lib/data";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { FeaturedCourseCarousel } from "@/components/home/featured-course-carousel";
import { comingSoonCourses } from "@/components/ui/coming-soon-course-card";
import { cn, formatPrice } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Catalogo corsi | Professione Fitness Academy",
  description:
    "Scopri il corso Personal Trainer disponibile ora e i prossimi corsi fitness pensati per chi vuole lavorare nel settore con competenze reali.",
  path: "/corsi",
  keywords: [
    "catalogo corsi fitness",
    "corso personal trainer",
    "corsi fitness online",
    "formazione personal trainer"
  ]
});

const guideLinks = [
  { href: "/diventare-personal-trainer", label: "Come diventare Personal Trainer" },
  { href: "/personal-trainer-cosa-studiare", label: "Cosa studiare per iniziare" },
  { href: "/quanto-guadagna-un-personal-trainer", label: "Quanto guadagna un Personal Trainer" }
];

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

export default async function CoursesPage() {
  const courses = await getPublishedCourses();
  const latestCourse =
    courses.length > 0
      ? [...courses].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
      : null;
  const catalogItems = [
    ...courses.map((course) => ({
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
    })),
    ...comingSoonCourses.map((item) => ({
      id: item.id,
      kind: "locked" as const,
      title: item.title,
      subtitle: item.description,
      eyebrow: item.eyebrow,
      accent: item.accent
    }))
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Corsi", item: "/corsi" }
        ])}
      />

      <div className="min-h-screen bg-[#05070b] text-white">
        <section className="relative overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(20,184,166,0.12),transparent_18%),linear-gradient(180deg,#071018_0%,#05070b_52%,#04060a_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-15" />

          <Container className="relative z-10">
            <div className="flex flex-col gap-8">
              <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
                <div className="max-w-4xl">
                  <div className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">
                    Catalogo corsi
                  </div>
                  <h1 className="mt-4 max-w-[10ch] font-display text-4xl font-black leading-[0.94] tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                    Esplora i percorsi disponibili.
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                    Qui trovi il corso Personal Trainer già disponibile e i prossimi corsi fitness in arrivo, così puoi capire subito quale formazione è più adatta ai tuoi obiettivi professionali.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {guideLinks.map((guide) => (
                      <Link
                        key={guide.href}
                        href={guide.href}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
                      >
                        {guide.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </div>

                {latestCourse ? (
                  <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_35px_90px_-48px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                    <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
                      <div className="relative min-h-[260px] overflow-hidden sm:min-h-[320px]">
                        <Image
                          src={
                            latestCourse.coverImage ||
                            "https://images.unsplash.com/photo-1518611012118-2969c6370238?q=80&w=1400&auto=format&fit=crop"
                          }
                          alt={latestCourse.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.02)_0%,rgba(3,7,18,0.28)_42%,rgba(3,7,18,0.84)_100%)]" />
                        <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#ff5a1f] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-20px_rgba(255,90,31,0.85)]">
                          Ultimo inserito
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center sm:hidden">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md">
                            <PlayCircle className="h-7 w-7" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between p-5 sm:p-6">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            In evidenza nella hero
                          </div>
                          <h2 className="mt-3 font-display text-3xl font-black leading-[0.95] tracking-[-0.05em] text-white">
                            {latestCourse.title}
                          </h2>
                          <p className="mt-4 text-sm leading-7 text-slate-300">
                            {latestCourse.shortDescription}
                          </p>
                        </div>

                        <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                              Investimento
                            </div>
                            <div className="mt-1 text-[2rem] font-black leading-none tracking-[-0.05em] text-white">
                              {formatPrice(latestCourse.salePriceCents ?? latestCourse.fullPriceCents)}
                            </div>
                          </div>

                          <Link
                            href={`/corsi/${latestCourse.slug}`}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-50"
                          >
                            Apri corso
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-white/8 pt-8">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Disponibili ora
                  </div>
                  <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                    Sfoglia la libreria corsi
                  </h2>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                    Accesso immediato dopo il checkout
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                    Da desktop puoi usare anche le frecce laterali
                  </div>
                </div>
              </div>

              {catalogItems.length > 0 ? (
                <FeaturedCourseCarousel className="mt-0">
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
                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">
                              {item.subtitle}
                            </p>

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
                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">
                              {item.subtitle}
                            </p>

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
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-slate-300">
                  Nessun corso pubblicato al momento.
                </div>
              )}
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

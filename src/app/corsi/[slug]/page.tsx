import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowRight, Award, BookOpen, Briefcase, Clock3, GraduationCap, LockKeyhole, MessageCircleMore, PlayCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
import { isStripeKeyConfigured } from "@/lib/env";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Accordion } from "@/components/ui/accordion";
import { CheckoutButton } from "@/components/course/checkout-button";
import { JsonLd } from "@/components/ui/json-ld";
import { formatPrice } from "@/lib/utils";
import { RatingStars } from "@/components/ui/rating-stars";
import { FeaturedCourseCarousel } from "@/components/home/featured-course-carousel";
import { comingSoonCourses } from "@/components/ui/coming-soon-course-card";
import { prisma } from "@/lib/prisma";
import { getPublishedCourseSlugs } from "@/lib/data";
import { isStaticExport } from "@/lib/runtime";

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

type Props = {
  params: Promise<{ slug: string }>;
};

async function loadCourse(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      modules: {
        include: {
          lessons: {
            orderBy: { sortOrder: "asc" }
          }
        },
        orderBy: { sortOrder: "asc" }
      },
      teachers: {
        include: { teacher: true },
        orderBy: { sortOrder: "asc" }
      },
      faqs: {
        where: { published: true },
        orderBy: { sortOrder: "asc" }
      },
      reviews: {
        where: { published: true },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }]
      },
      seo: true
    }
  });
}

export async function generateStaticParams() {
  const entries = await getPublishedCourseSlugs();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = await loadCourse(slug);
  if (!course) return {};

  return buildMetadata({
    title: course.seo?.metaTitle || `${course.title} | Professione Fitness Academy`,
    description: course.seo?.metaDescription || course.shortDescription,
    path: `/corsi/${course.slug}`,
    image: course.seo?.ogImage || course.coverImage || undefined,
    canonicalUrl: course.seo?.canonicalUrl || undefined,
    noindex: course.seo?.noindex || false
  });
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = await loadCourse(slug);
  if (!course || !course.published) notFound();
  const stripeReady = !isStaticExport() && isStripeKeyConfigured("STRIPE_SECRET_KEY");

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    provider: {
      "@type": "Organization",
      name: "Professione Fitness Academy"
    }
  };

  return (
    <>
      <JsonLd data={courseJsonLd} />
      {course.faqs.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: course.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          }}
        />
      ) : null}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Corsi", item: "/corsi" },
          { name: course.title, item: `/corsi/${course.slug}` }
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Corsi", href: "/corsi" },
          { label: course.title }
        ]}
      />

      <section className="bg-[radial-gradient(circle_at_top,_rgba(240,249,255,0.8),_transparent_38%),linear-gradient(to_bottom,_#ffffff,_#f8fafc)] pt-12 pb-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_380px]">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                {course.badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 text-xl leading-8 text-slate-600">{course.subtitle}</p>

              <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[2rem] border border-slate-200/80 shadow-[0_28px_70px_-40px_rgba(15,23,42,0.35)]">
                <Image
                  src={course.coverImage || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
              </div>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <InfoCard icon={<Clock3 className="h-5 w-5" />} title="Durata" text={course.durationLabel} />
                <InfoCard
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Modalita"
                  text={course.mode === "HYBRID" ? "Ibrido" : course.mode === "ONLINE" ? "Online" : "In presenza"}
                />
                <InfoCard
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="Livello"
                  text={
                    course.level === "FOUNDATION"
                      ? "Base"
                      : course.level === "INTERMEDIATE"
                        ? "Intermedio"
                        : course.level === "ADVANCED"
                          ? "Avanzato"
                          : "Specialistico"
                  }
                />
                <InfoCard icon={<Award className="h-5 w-5" />} title="Certificazione" text={course.certification} />
              </div>

              <section className="mt-12 rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] backdrop-blur-sm">
                <h2 className="font-display text-3xl font-bold text-slate-900">Cosa ottieni</h2>
                <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-700">
                  {course.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </section>

              <section className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
                <h2 className="font-display text-3xl font-bold text-slate-900">Perché questo percorso è costruito così</h2>
                <div className="mt-4 space-y-5 text-base leading-8 text-slate-700">
                  {course.longDescription
                    .split(/\n\n+/)
                    .map((paragraph) => paragraph.trim())
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={`${course.id}-long-${index}`}>{paragraph}</p>
                    ))}
                </div>
              </section>

              <section className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.2)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Trasparenza</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Prima del checkout puoi leggere programma, docenti, FAQ e struttura del percorso.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.2)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Esperienza di studio</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Studi con ordine, segui le lezioni per moduli e mantieni sempre chiaro il punto del percorso in cui ti trovi.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.2)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Supporto</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Se vuoi capire se questo corso Personal Trainer è adatto al tuo livello di partenza, puoi contattarci prima di iscriverti.
                  </p>
                </div>
              </section>

              <section className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
                <h2 className="font-display text-3xl font-bold text-slate-900">A chi e rivolto</h2>
                <p className="mt-4 text-base leading-8 text-slate-700">{course.audience}</p>
              </section>

              <section className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
                <h2 className="font-display text-3xl font-bold text-slate-900">Programma dettagliato</h2>
                <div className="mt-6 space-y-5">
                  {course.modules.map((module, index) => (
                    <div key={module.id} className="rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/60 p-6">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                        Modulo {String(index + 1).padStart(2, "0")}
                      </div>
                      <h3 className="mt-2 text-2xl font-bold text-slate-900">{module.title}</h3>
                      {module.description ? <p className="mt-3 text-sm leading-7 text-slate-600">{module.description}</p> : null}
                      <ul className="mt-4 space-y-3">
                        {module.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm text-slate-700"
                          >
                            <span>{lesson.title}</span>
                            <span className="text-slate-500">{lesson.durationLabel || "Lezione"}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
                <h2 className="font-display text-3xl font-bold text-slate-900">Docenti</h2>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {course.teachers.map(({ teacher }) => (
                    <div key={teacher.id} className="rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/60 p-6">
                      <div className="flex items-center gap-3 text-brand-700">
                        <Users className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-[0.18em]">{teacher.role}</span>
                      </div>
                      <h3 className="mt-3 text-2xl font-bold text-slate-900">{teacher.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{teacher.shortBio || teacher.bio}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
                <h2 className="font-display text-3xl font-bold text-slate-900">Sbocchi professionali</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {course.careerOutcomes.map((outcome) => (
                    <div key={outcome} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 px-5 py-4 text-slate-700">
                      <Briefcase className="mb-3 h-5 w-5 text-brand-700" />
                      {outcome}
                    </div>
                  ))}
                </div>
              </section>

              {course.reviews.length > 0 ? (
                <section className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
                  <h2 className="font-display text-3xl font-bold text-slate-900">Recensioni collegate</h2>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {course.reviews.map((review) => (
                      <div key={review.id} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-6">
                        <RatingStars value={review.rating} />
                        <p className="mt-4 text-sm leading-7 text-slate-700">{review.body}</p>
                        <div className="mt-4 font-semibold text-slate-900">{review.authorName}</div>
                        <div className="text-sm text-brand-700">{review.authorRole}</div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {course.faqs.length > 0 ? (
                <section className="mt-8 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)]">
                  <h2 className="font-display text-3xl font-bold text-slate-900">FAQ del corso</h2>
                  <div className="mt-6">
                    <Accordion items={course.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
                  </div>
                </section>
              ) : null}

              <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#09111a_0%,#081019_100%)] p-6 text-white shadow-[0_28px_80px_-42px_rgba(15,23,42,0.5)] md:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Nuovi corsi in arrivo
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-[2.4rem]">
                      Continua a esplorare i prossimi corsi pensati per chi vuole crescere nel fitness.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                      Dopo questo corso troverai anche i prossimi percorsi in arrivo, già visibili per aiutarti a capire come potrai continuare la tua formazione nel fitness.
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Percorsi teaser
                    </div>
                    <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      Swipe su mobile, frecce su desktop
                    </div>
                  </div>
                </div>

                <FeaturedCourseCarousel className="mt-6">
                  {comingSoonCourses.map((item) => (
                    <article
                      key={item.id}
                      className="group relative min-h-[430px] w-[76vw] min-w-[270px] max-w-[320px] snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_35px_90px_-42px_rgba(0,0,0,0.9)] sm:w-[330px] sm:min-w-[330px]"
                    >
                      <div className={`absolute inset-0 ${lockedAccentStyles[item.accent].panel}`} />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.08)_0%,rgba(5,7,12,0.24)_34%,rgba(5,7,12,0.82)_74%,rgba(5,7,12,0.96)_100%)]" />
                      <div
                        className={`absolute right-[-12%] top-[16%] h-36 w-36 rounded-full blur-3xl transition duration-500 group-hover:scale-110 ${lockedAccentStyles[item.accent].glow}`}
                      />

                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/24 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                          <Clock3 className="h-3.5 w-3.5" />
                          Coming soon
                        </span>
                        <div className="rounded-full border border-white/10 bg-white/10 p-2 text-white backdrop-blur-sm">
                          <LockKeyhole className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-black/28 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
                          <PlayCircle className="h-8 w-8" />
                        </div>
                      </div>

                      <div className="absolute inset-x-4 bottom-4">
                        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,25,0.12),rgba(4,8,18,0.82))] p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] backdrop-blur-[18px]">
                          <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                              {item.eyebrow}
                            </span>
                            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                              In sviluppo
                            </span>
                          </div>

                          <h3 className="mt-4 font-display text-[2rem] font-black leading-[0.94] tracking-[-0.05em] text-white">
                            {item.title}
                          </h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">
                            {item.description}
                          </p>

                          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                            Sblocco futuro
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </FeaturedCourseCarousel>
              </section>
            </div>

            <aside className="h-fit rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.32)] backdrop-blur-sm lg:sticky lg:top-28">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Quota corso</div>
              <div className="mt-3 text-4xl font-black text-slate-900">
                {formatPrice(course.salePriceCents ?? course.fullPriceCents)}
              </div>
              {course.salePriceCents ? (
                <div className="mt-1 text-sm text-slate-500 line-through">{formatPrice(course.fullPriceCents)}</div>
              ) : null}
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Acquisto sicuro con accesso riservato all&apos;area corso, lezioni organizzate per moduli e avanzamento personale sempre visibile.
              </p>
              <div className="mt-6">
                <CheckoutButton courseId={course.id} nextPath={`/corsi/${course.slug}`} stripeReady={stripeReady} />
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                  <ShieldCheck className="h-4 w-4 text-brand-700" />
                  Area utente dedicata
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                  <BookOpen className="h-4 w-4 text-brand-700" />
                  Lezioni organizzate per moduli
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                  <Award className="h-4 w-4 text-brand-700" />
                  Progress tracking personale
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                  <Users className="h-4 w-4 text-brand-700" />
                  Accesso riservato agli iscritti
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                  <Briefcase className="h-4 w-4 text-brand-700" />
                  Dati fatturazione raccolti nel checkout Stripe
                </li>
              </ul>

              <div className="mt-6 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Hai un dubbio prima di acquistare?</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Se vuoi chiarire tempi di studio, contenuti del corso o compatibilità con i tuoi obiettivi professionali, puoi scriverci prima di procedere.
                </p>
                <Link href="/contatti" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-800">
                  <MessageCircleMore className="h-4 w-4" />
                  Contatta l'academy
                </Link>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-brand-100 bg-brand-50/70 p-5">
                <div className="text-sm font-semibold text-slate-900">Esplora altri percorsi</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Nel catalogo trovi i percorsi già disponibili e puoi confrontare modalità, livello e obiettivi prima di scegliere.
                </p>
                <Link href="/corsi" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-800">
                  Torna al catalogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  title,
  text
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.28)]">
      <div className="mb-3 text-brand-700">{icon}</div>
      <div className="text-sm uppercase tracking-[0.18em] text-slate-500">{title}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{text}</div>
    </div>
  );
}

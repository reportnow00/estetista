import Image from "next/image";
import { ArrowRight, CheckCircle2, Play, ShieldCheck, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { Course, SiteSettings } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

export function HeroSection({
  settings,
  course
}: {
  settings: SiteSettings | null;
  course: Course | null;
}) {
  const title = settings?.heroTitle || "Trasforma la tua passione per il fitness in una professione seria.";
  const subtitle =
    settings?.heroSubtitle ||
    "Corso online per Personal Trainer con programma consultabile prima dell'acquisto, accesso riservato e un percorso costruito per accompagnarti verso il lavoro reale.";
  const courseTitle = course?.title || "Diventa un Personal Trainer";
  const coursePrice = course ? formatPrice(course.salePriceCents ?? course.fullPriceCents) : "990,00 EUR";
  const primaryHref = settings?.heroPrimaryCtaHref || "/corsi/diventa-un-personal-trainer";
  const secondaryHref = settings?.heroSecondaryCtaHref || "/diventare-personal-trainer";
  const heroImage =
    course?.coverImage ||
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative overflow-hidden bg-[#05070b] py-16 text-white sm:py-20 lg:min-h-[96vh] lg:py-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_20%),radial-gradient(circle_at_78%_16%,rgba(20,184,166,0.14),transparent_18%),linear-gradient(180deg,#071018_0%,#04060a_42%,#020305_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:68px_68px] opacity-20" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(2,4,8,0.78))]" />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:min-h-[96vh] lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Badge className="mb-6 border border-white/10 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-emerald-300 backdrop-blur-md">
              Iscrizioni aperte · Corso Personal Trainer
            </Badge>

            <h1 className="max-w-[10ch] font-display text-[clamp(3.2rem,11vw,7rem)] font-black leading-[0.9] tracking-[-0.065em] text-white">
              La tua passione. La tua professione.
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-lg sm:leading-8">
              <span className="text-white">{title}</span>{" "}
              <span className="text-slate-400">{subtitle}</span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <ButtonLink href={primaryHref} size="lg" className="bg-white text-slate-950 hover:bg-emerald-50">
                {settings?.heroPrimaryCtaLabel || "Scopri il corso principale"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href={secondaryHref}
                variant="outline"
                size="lg"
                className="border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              >
                {settings?.heroSecondaryCtaLabel || "Scopri il programma"}
              </ButtonLink>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Accesso 24/7</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">Studia quando vuoi e riparti sempre dal punto giusto.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Prima del checkout</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">Programma, FAQ e docenti visibili prima dell'acquisto.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Percorso serio</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">Un'offerta pensata per trasformare studio e metodo in lavoro reale.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-[34rem]">
              <div className="absolute -inset-2 rounded-[2.6rem] bg-emerald-400/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_40px_100px_-42px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] bg-[#02060c]">
                  <Image src={heroImage} alt={courseTitle} fill className="object-cover object-center" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,12,0.06)_0%,rgba(2,6,12,0.16)_28%,rgba(2,6,12,0.52)_58%,rgba(2,6,12,0.92)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.1),transparent_24%)]" />

                  <div className="absolute left-5 top-5 flex items-center gap-2">
                    <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
                      Corso master
                    </div>
                  </div>

                  <div className="absolute right-5 top-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-black/32 shadow-[0_25px_50px_-25px_rgba(0,0,0,0.75)] backdrop-blur-md">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                        <Play className="ml-0.5 h-4 w-4 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-x-5 bottom-5">
                    <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.4),rgba(3,7,18,0.76))] p-5 shadow-[0_30px_60px_-32px_rgba(0,0,0,0.9)] backdrop-blur-[24px]">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                        Formazione professionale
                      </div>
                      <h2 className="mt-3 max-w-[12ch] font-display text-[2.25rem] font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-[2.7rem]">
                        {courseTitle}
                      </h2>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Metodo</div>
                          <div className="mt-2 text-lg font-semibold leading-7 text-white">Struttura ordinata e credibile</div>
                        </div>
                        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Accesso</div>
                          <div className="mt-2 text-lg font-semibold leading-7 text-white">Area riservata dopo l'acquisto</div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            Investimento unico
                          </div>
                          <div className="mt-2 text-[2.4rem] font-black leading-none tracking-[-0.05em] text-white sm:text-[3rem]">
                            {coursePrice}
                          </div>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                          Accesso riservato
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

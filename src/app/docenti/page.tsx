import Image from "next/image";
import Link from "next/link";
import type { Teacher } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { resolveDbWithFallback } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Docenti | Professione Fitness Academy",
  description:
    "Conosci i docenti di Professione Fitness Academy, le loro competenze e il contributo che portano al tuo percorso formativo."
});

const pillars = [
  {
    label: "Metodo",
    text: "Ogni docente viene scelto per la capacita di trasformare esperienza e teoria in lezioni chiare, spendibili e ordinate."
  },
  {
    label: "Esperienza",
    text: "Il valore non sta nel nome in copertina, ma nella profondita con cui ogni professionista porta pratica reale dentro il percorso."
  },
  {
    label: "Presenza",
    text: "Chi studia deve percepire una faculty leggibile, riconoscibile e credibile. Questa pagina serve esattamente a quello."
  }
];

function teacherImage(teacher: Teacher) {
  return (
    teacher.image ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
  );
}

function featuredBlurb(index: number) {
  if (index === 0) {
    return "Presenza forte, taglio pratico e una comunicazione che rende i contenuti immediatamente piu leggibili.";
  }

  if (index === 1) {
    return "Un profilo che alza il livello della faculty e rende il percorso piu credibile agli occhi di chi deve scegliere bene.";
  }

  return "Una voce autorevole dentro la faculty, utile a costruire una formazione chiara, moderna e spendibile.";
}

export default async function TeachersPage() {
  const teachers = await resolveDbWithFallback(
    () =>
      prisma.teacher.findMany({
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
      }),
    [],
    "getTeachersPageData"
  );

  const featuredTeachers = teachers.slice(0, 2);

  return (
    <main className="min-h-screen bg-[#080f12] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(66,184,205,0.24),transparent_28%),linear-gradient(135deg,#081014_0%,#102126_55%,#091114_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.78)_72%,rgba(0,0,0,0.94)_100%)]" />
        <Container className="relative py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-300">
                Faculty
              </span>
              <h1 className="mt-6 font-display text-5xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                I docenti come se fossero il cast principale.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
                Questa pagina parla solo di faculty: volti, ruoli, credibilita e contributo didattico dei
                professionisti che tengono in piedi il percorso.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/corsi"
                  className="inline-flex items-center justify-center rounded-md bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  Vai ai corsi
                </Link>
                <Link
                  href="/chi-siamo"
                  className="inline-flex items-center justify-center rounded-md border border-white/16 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  Scopri l'academy
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {pillars.map((pillar) => (
                <article
                  key={pillar.label}
                  className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur shadow-[0_24px_90px_-50px_rgba(0,0,0,0.85)]"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-300">
                    {pillar.label}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/72">{pillar.text}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {featuredTeachers.length > 0 ? (
        <section className="border-b border-white/8 bg-[#0d171a] py-16">
          <Container>
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">In primo piano</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Volti che reggono la scena</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {featuredTeachers.map((teacher, index) => (
                <article
                  key={teacher.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#132024] shadow-[0_30px_100px_-50px_rgba(33,155,178,0.3)]"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_18%,rgba(0,0,0,0.38)_62%,rgba(0,0,0,0.7)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(66,184,205,0.18),transparent_40%)]" />
                  <div className="relative grid min-h-[420px] lg:grid-cols-[0.82fr_1.18fr]">
                    <div className="relative min-h-[320px]">
                      <Image src={teacherImage(teacher)} alt={teacher.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="flex flex-col justify-end p-8 md:p-10">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-300">Featured faculty</div>
                      <h3 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.03em] text-white">
                        {teacher.name}
                      </h3>
                      <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-white/55">
                        {teacher.role}
                      </p>
                      <p className="mt-6 max-w-xl text-base leading-8 text-white/72">
                        {teacher.shortBio || teacher.bio}
                      </p>
                      <p className="mt-5 text-sm leading-7 text-white/55">{featuredBlurb(index)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-20">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">Catalogo faculty</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                Schede docente in chiave poster
              </h2>
            </div>
            <p className="hidden max-w-md text-right text-sm leading-7 text-white/45 md:block">
              Hover, contrasti forti e card scure per un impatto piu vicino al linguaggio visuale delle piattaforme streaming.
            </p>
          </div>

          {teachers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {teachers.map((teacher) => (
                <article
                  key={teacher.id}
                  className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#122025] transition duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-[0_30px_100px_-55px_rgba(33,155,178,0.42)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={teacherImage(teacher)}
                      alt={teacher.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_5%,rgba(0,0,0,0.18)_34%,rgba(0,0,0,0.94)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-300">Faculty card</p>
                      <h3 className="mt-3 font-display text-2xl font-bold text-white">{teacher.name}</h3>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                        {teacher.role}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/8 p-5">
                    <p className="text-sm leading-7 text-white/72">{teacher.shortBio || teacher.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.8rem] border border-white/10 bg-[#122025] p-8 text-white/72">
              Nessun docente disponibile al momento.
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

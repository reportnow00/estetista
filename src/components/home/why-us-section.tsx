import Image from "next/image";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const items = [
  {
    eyebrow: "Metodo",
    title: "Un percorso chiaro da seguire",
    description: "Moduli ordinati, lezioni ben strutturate e una progressione pensata per farti studiare con più sicurezza."
  },
  {
    eyebrow: "Esperienza",
    title: "Area corso semplice e curata",
    description: "Accedi ai contenuti quando vuoi, segui i progressi e ritrova subito il punto da cui ripartire."
  },
  {
    eyebrow: "Docenti",
    title: "Professionisti con esperienza reale",
    description: "Incontri figure che lavorano sul campo e portano dentro il percorso un taglio concreto, non teorico."
  },
  {
    eyebrow: "Obiettivo",
    title: "Competenze utili nel lavoro",
    description: "L'obiettivo non è riempirti di parole, ma aiutarti a costruire basi solide e più credibili nel fitness."
  }
];

const highlights = ["Programma chiaro", "Accesso riservato", "Taglio professionale"];

export function WhyUsSection() {
  return (
    <section className="relative overflow-hidden bg-[#07111f] py-20 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.14),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_55%)]" />
      <Container>
        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="flex h-full flex-col">
            <Badge className="mb-5 w-fit border border-white/10 bg-white/8 text-emerald-200 backdrop-blur-sm">
              Perché scegliere noi
            </Badge>
            <h2 className="max-w-xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Una formazione pensata per aiutarti a crescere davvero nel fitness.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Se stai cercando un percorso serio, qui trovi contenuti ordinati, docenti credibili e un&apos;esperienza di studio costruita per accompagnarti con più chiarezza dall&apos;inizio alla fine.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.8)] backdrop-blur-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">Per te</div>
                <div className="mt-3 text-3xl font-black text-white">Più ordine</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Capisci meglio cosa studiare, come seguire i moduli e come trasformare lo studio in metodo.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-emerald-400/18 bg-emerald-400/8 p-6 shadow-[0_30px_80px_-48px_rgba(16,185,129,0.45)] backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.26em]">Risultato</span>
                </div>
                <p className="mt-4 text-xl font-semibold leading-8 text-white">
                  Studi in un ambiente più chiaro, più professionale e più facile da vivere anche ogni giorno.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[2.15rem] border border-white/10 bg-white/5 p-3 shadow-[0_36px_90px_-48px_rgba(2,6,23,0.9)] lg:col-span-2">
              <div className="relative min-h-[340px] overflow-hidden rounded-[1.7rem] md:min-h-[420px]">
                <Image
                  src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1200&auto=format&fit=crop"
                  alt="Allenamento professionale in academy"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/16 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 max-w-xl rounded-[1.5rem] border border-white/12 bg-slate-950/62 p-5 backdrop-blur-md">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-300">
                    Professione Fitness Academy
                  </div>
                  <p className="mt-3 text-xl font-semibold leading-8 text-white">
                    Un percorso che ti accompagna con chiarezza, metodo e una struttura professionale pensata per durare.
                  </p>
                </div>
              </div>
            </div>

            {items.map((item, index) => (
              <div
                key={item.title}
                className={`rounded-[1.75rem] border p-6 shadow-[0_26px_70px_-46px_rgba(2,6,23,0.82)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 ${
                  index === 1
                    ? "border-emerald-400/18 bg-emerald-400/10"
                    : "border-white/10 bg-white/6"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                    {item.eyebrow}
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

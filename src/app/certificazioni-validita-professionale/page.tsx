import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";

const focusCards = [
  {
    eyebrow: "Chiarezza",
    title: "Attestati e materiali finali raccontati senza confusione.",
    description:
      "Questa pagina serve a chiarire cosa viene rilasciato alla fine del percorso, come leggere correttamente la documentazione finale e quale standard comunicativo adottiamo."
  },
  {
    eyebrow: "Spendibilita",
    title: "Il valore professionale nasce dal percorso, non da formule urlate.",
    description:
      "La spendibilita si costruisce con struttura didattica, qualita dei contenuti, accesso ordinato ai materiali e coerenza tra quello che promettiamo e quello che consegniamo."
  },
  {
    eyebrow: "Struttura",
    title: "Metodo, ordine e documentazione finale nello stesso standard.",
    description:
      "Quando un percorso e progettato bene, anche il modo in cui si conclude deve essere chiaro: accesso, avanzamento, attestato e presentazione professionale fanno parte della stessa esperienza."
  }
];

const trustSignals = [
  "Attestato finale descritto in modo preciso, senza scorciatoie linguistiche.",
  "Materiali conclusivi e standard del percorso spiegati prima dell'iscrizione.",
  "Posizionamento della formazione raccontato con tono serio e verificabile.",
  "Accesso alla piattaforma e struttura didattica presentati con chiarezza."
];

const bingeRows = [
  {
    title: "Cosa guardare prima di iscriverti",
    items: [
      {
        name: "Programma",
        text: "I contenuti devono raccontare un percorso completo, non un elenco generico di argomenti."
      },
      {
        name: "Documenti finali",
        text: "La documentazione finale deve essere presentata bene, senza promettere piu di cio che viene realmente rilasciato."
      },
      {
        name: "Coerenza",
        text: "Quello che leggi nella pagina vendita deve coincidere con cio che trovi davvero dentro il percorso."
      }
    ]
  },
  {
    title: "Perche questa pagina aumenta la fiducia",
    items: [
      {
        name: "Aspettative corrette",
        text: "Quando tutto e chiaro, compri con piu sicurezza e meno attrito."
      },
      {
        name: "Standard percepito",
        text: "Una academy curata non ha bisogno di alzare la voce: basta presentare bene processo, materiali e livello di ordine."
      },
      {
        name: "Fiducia",
        text: "Trasparenza e design lavorano insieme: se la pagina e pulita, il brand appare piu affidabile e piu maturo."
      }
    ]
  }
];

export const metadata = buildMetadata({
  title: "Certificazioni e validita professionale | Professione Fitness Academy",
  description:
    "Pagina istituzionale dedicata alla validita professionale, alla struttura del percorso e al modo corretto di presentare attestati e certificazioni."
});

export default function CertificationsPage() {
  return (
    <main className="bg-[#081014] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(66,184,205,0.24),transparent_32%),linear-gradient(135deg,#081014_0%,#112126_48%,#091114_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.76)_70%,rgba(0,0,0,0.95)_100%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)] lg:block" />
        <Container className="relative grid gap-12 py-24 md:py-32 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-300">
              Validita professionale
            </span>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Certificazioni spiegate come una produzione premium.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
              Nessun effetto fumo. Qui trovi il modo corretto di leggere valore del percorso, materiali finali,
              attestato e posizionamento professionale della formazione.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/corsi"
                className="inline-flex items-center justify-center rounded-md bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Esplora i corsi
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center rounded-md border border-white/16 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/16"
              >
                Leggi le FAQ
              </Link>
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">Focus</p>
                <p className="mt-2 font-display text-2xl font-bold">Come leggere bene validita e attestato</p>
              </div>
              <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
                Essential
              </span>
            </div>
            <div className="space-y-4">
              {trustSignals.map((signal) => (
                <div key={signal} className="rounded-2xl border border-white/8 bg-black/30 px-4 py-4 text-sm leading-7 text-white/74">
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/8 bg-[#0d171a] py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {focusCards.map((card, index) => (
              <article
                key={card.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7 shadow-[0_28px_90px_-50px_rgba(33,155,178,0.36)] transition duration-300 hover:-translate-y-1 hover:border-brand-500/40"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(66,184,205,0.18),transparent_42%)] opacity-80" />
                <div className="relative">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-300">
                    0{index + 1} {card.eyebrow}
                  </span>
                  <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white">{card.title}</h2>
                  <p className="mt-5 text-sm leading-7 text-white/72">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#081014] py-20">
        <Container className="space-y-14">
          {bingeRows.map((row) => (
            <div key={row.title}>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">Row</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{row.title}</h2>
                </div>
                <div className="hidden text-sm text-white/45 md:block">Scorri mentalmente i criteri giusti</div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {row.items.map((item) => (
                  <article
                    key={item.name}
                    className="rounded-[1.6rem] border border-white/10 bg-[#122025] p-6 transition hover:border-brand-500/30 hover:bg-[#16292f]"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-300">{item.name}</div>
                    <p className="mt-4 text-base leading-8 text-white/72">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
    </main>
  );
}

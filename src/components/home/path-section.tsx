import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    number: "01",
    title: "Valuti il percorso",
    description: "Leggi programma, docenti, modalità e sbocchi con chiarezza, senza perderti in pagine inutili."
  },
  {
    number: "02",
    title: "Acquisti una sola volta",
    description: "Checkout semplice, niente ricorrenze e accesso sbloccato appena il pagamento viene confermato."
  },
  {
    number: "03",
    title: "Studi e avanzi",
    description: "Dashboard ordinata, lezioni per moduli, progress tracking e contenuti accessibili solo agli iscritti."
  },
  {
    number: "04",
    title: "Costruisci il tuo profilo",
    description: "Il percorso ti accompagna verso una presenza professionale più solida, credibile e pronta per il mercato."
  }
];

export function PathSection() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <SectionHeading
          badge="Come funziona"
          title="Dal primo click all'ingresso nella tua area corso."
          description="Ogni passaggio è pensato per essere lineare: informazioni chiare, acquisto semplice e accesso immediato ai contenuti."
          center
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative rounded-[2rem] border border-slate-200/80 bg-white p-7 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_-42px_rgba(15,23,42,0.28)]"
            >
              {index < steps.length - 1 ? (
                <div className="pointer-events-none absolute right-[-12px] top-12 hidden h-px w-6 bg-brand-200 lg:block" />
              ) : null}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-950 text-lg font-bold text-white shadow-[0_18px_34px_-20px_rgba(15,23,42,0.5)]">
                {step.number}
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

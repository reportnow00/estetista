import { Award, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const bullets = [
  "Percorso con impostazione tecnica coerente con il lavoro sul campo",
  "Attestato finale e materiali di supporto inclusi",
  "Indicazioni chiare su validità professionale e spendibilità del percorso",
  "Contenuti aggiornati e organizzati in modo semplice da consultare"
];

export function CertificationSection() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeading
              badge="Certificazioni e validità"
              title="Un percorso pensato per essere utile, non solo bello da mostrare."
              description="Trovi informazioni chiare su attestato finale, validità professionale e applicazione pratica del percorso nel lavoro di tutti i giorni."
            />
            <ul className="mt-8 space-y-4">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,#f8fafc,rgba(240,249,255,0.95))] p-8 shadow-[0_26px_70px_-42px_rgba(15,23,42,0.22)]">
            <div className="mx-auto max-w-sm rounded-[2rem] border-[10px] border-slate-800 bg-white p-8 text-center shadow-[0_30px_70px_-38px_rgba(15,23,42,0.35)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-900">
                <Award className="h-8 w-8" />
              </div>
              <div className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Attestato finale
              </div>
              <div className="mt-3 font-display text-3xl font-bold text-slate-900">Personal Trainer</div>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Un esempio del materiale finale che accompagna il tuo percorso formativo.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

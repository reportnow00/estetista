import { Award, Briefcase, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/ui/container";

const items = [
  {
    icon: Award,
    eyebrow: "Percorso",
    title: "Una base seria si riconosce da come rende tutto più chiaro.",
    text: "Programma ordinato, obiettivi chiari e una costruzione pensata per accompagnarti verso il lavoro reale."
  },
  {
    icon: Users,
    eyebrow: "Docenti",
    title: "Chi insegna e perché conta",
    text: "Sai chi interviene nel percorso, quali temi tratta e quale esperienza concreta porta nella formazione."
  },
  {
    icon: Briefcase,
    eyebrow: "Competenze",
    title: "Spendibilità concreta",
    text: "L'academy è impostata per trasformare lo studio in competenze più utili, chiare e comunicabili sul mercato."
  },
  {
    icon: ShieldCheck,
    eyebrow: "Esperienza",
    title: "Checkout e area riservata",
    text: "Accesso protetto, dashboard personale, progress tracking e supporto pre-iscrizione dentro un'esperienza lineare."
  },
  {
    icon: CheckCircle2,
    eyebrow: "Acquisto",
    title: "Nessuna ambiguità",
    text: "Una tantum, accesso immediato al percorso e una logica di iscrizione semplice, leggibile e trasparente."
  }
];

export function TrustStrip() {
  const [lead, ...rest] = items;
  const LeadIcon = lead.icon;

  return (
    <section className="relative overflow-hidden bg-[#07111f] py-14 text-white sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_24%),radial-gradient(circle_at_78%_24%,rgba(16,185,129,0.14),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_46%)]" />
      <div className="absolute left-[8%] top-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute right-[8%] bottom-12 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />

      <Container>
        <div className="relative grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_40px_100px_-52px_rgba(2,6,23,0.88)] backdrop-blur-md sm:rounded-[2.4rem] sm:p-7 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-emerald-200 sm:h-14 sm:w-14">
                <LeadIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200/90 sm:text-[11px]">
                  {lead.eyebrow}
                </div>
                <h3 className="mt-4 max-w-[13ch] font-display text-[clamp(2rem,6vw,4.2rem)] font-bold leading-[0.92] tracking-[-0.05em] text-white">
                  {lead.title}
                </h3>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{lead.text}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/18 px-4 py-4 backdrop-blur-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">Impostazione</div>
                <div className="mt-2 text-lg font-semibold leading-7 text-white">Programma leggibile e progressivo</div>
              </div>
              <div className="rounded-[1.5rem] border border-emerald-300/12 bg-emerald-300/[0.06] px-4 py-4 backdrop-blur-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/70 sm:text-[11px]">Obiettivo</div>
                <div className="mt-2 text-lg font-semibold leading-7 text-white">Competenze più vicine al lavoro reale</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {rest.map((item, index) => {
              const Icon = item.icon;
              const elevated = index === 1 || index === 3;

              return (
                <div
                  key={item.title}
                  className={[
                    "rounded-[1.8rem] border p-5 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.36)] transition duration-300 hover:-translate-y-1",
                    elevated
                      ? "border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbf8_100%)] xl:translate-y-6"
                      : "border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-950 text-white shadow-[0_18px_34px_-22px_rgba(15,23,42,0.55)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[11px]">
                      {item.eyebrow}
                    </div>
                  </div>
                  <h4 className="mt-5 max-w-[15ch] text-[1.35rem] font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950">
                    {item.title}
                  </h4>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

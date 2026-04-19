import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-900 px-8 py-14 text-center text-white shadow-[0_36px_90px_-44px_rgba(15,23,42,0.45)] sm:px-12 lg:px-20">
          <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-8 bottom-0 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Pronto a costruire il tuo primo passo nel fitness professionale?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-100">
            Se vuoi trasformare la tua passione per il fitness in un lavoro serio, questo è il momento giusto per iniziare con un percorso chiaro e concreto.
          </p>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Programma consultabile prima dell'acquisto</span>
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Accesso riservato e progress tracking</span>
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Supporto pre-iscrizione via contatto diretto</span>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink href="/corsi/diventa-un-personal-trainer" variant="secondary" size="lg">
              Vai al corso
            </ButtonLink>
            <ButtonLink
              href="/contatti"
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              Contatta l&apos;academy
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

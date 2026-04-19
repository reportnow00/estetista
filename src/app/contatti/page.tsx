import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { submitContactAction } from "@/actions/contact";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, ButtonLink } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Contatti | Professione Fitness Academy",
  description:
    "Contatta Professione Fitness Academy per ricevere informazioni sul corso, sul percorso formativo e sulle modalita di accesso."
});

type Props = {
  searchParams?: Promise<{ sent?: string; error?: string }>;
};

export default async function ContactsPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const isSent = params.sent === "1";
  const error = params.error;

  return (
    <>
      <PageHero
        badge="Contatti"
        title="Parliamo del percorso giusto per te"
        description="Se vuoi capire meglio il corso, i tempi di studio o il profilo professionale in uscita, scrivici. Ti rispondiamo con indicazioni chiare e senza pressioni."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.2)]">
            <h2 className="font-display text-3xl font-bold text-slate-900">Contatti academy</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Usiamo questo canale per richieste sul corso, orientamento iniziale e supporto pre-iscrizione.
            </p>
            <ul className="mt-6 space-y-4 text-slate-700">
              <li>
                Email:{" "}
                <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-brand-800 hover:text-brand-700">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                Telefono:{" "}
                <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="font-medium text-brand-800 hover:text-brand-700">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>Sede operativa: {siteConfig.contact.location}</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${siteConfig.contact.email}`} variant="outline">
                Scrivici via email
              </ButtonLink>
              <ButtonLink href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} variant="outline">
                Chiamaci
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand-100 bg-brand-50/70 p-8 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.16)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Perche contattarci</div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              <li>Ricevi una risposta reale sul percorso piu adatto al tuo livello di partenza.</li>
              <li>Chiarisci dubbi su contenuti, accesso alla piattaforma e spendibilita del corso.</li>
              <li>Capisci se questo percorso e coerente con i tuoi obiettivi professionali nel fitness.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.16)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Prima dell'iscrizione</div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              <li>Puoi verificare programma, docenti, FAQ e struttura dell'area corso prima di acquistare.</li>
              <li>Se hai dubbi pratici, puoi usare questo canale per ricevere un orientamento chiaro e non commerciale.</li>
              <li>Le richieste arrivano direttamente all'academy e non a un form lasciato senza risposta.</li>
            </ul>
          </div>
        </div>

        <form action={submitContactAction} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.22)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900">Richiedi informazioni</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Compila il form e ti risponderemo con indicazioni pratiche, senza messaggi automatici impersonali.
              </p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Risposta umana
            </div>
          </div>

          {isSent ? (
            <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-900">
              Richiesta inviata correttamente. Ti risponderemo il prima possibile.
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-900">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input name="name" placeholder="Nome e cognome" required />
            <Input name="email" placeholder="Email" type="email" required />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <Input name="phone" placeholder="Telefono (opzionale)" />
            <Input name="subject" placeholder="Oggetto della richiesta" required />
          </div>
          <div className="mt-4">
            <Textarea name="message" placeholder="Scrivi il tuo messaggio..." required />
          </div>
          <div className="mt-4 text-xs leading-6 text-slate-500">
            Inviando il form accetti di essere ricontattato in merito alla tua richiesta. Nessuno spam, solo informazioni utili sul percorso.
          </div>
          <Button type="submit" className="mt-6">
            Invia richiesta
          </Button>
        </form>
      </Container>
    </>
  );
}

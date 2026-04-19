import { articleJsonLd, buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { GuideSidebar } from "@/components/seo/guide-sidebar";

export const metadata = buildMetadata({
  title: "Come trovare clienti da Personal Trainer | Guida pratica",
  description:
    "Scopri come trovare clienti da personal trainer con una proposta chiara, posizionamento credibile e azioni concrete online e offline.",
  path: "/come-trovare-clienti-personal-trainer",
  type: "article",
  section: "Guide",
  authors: ["Redazione Professione Fitness Academy"],
  keywords: [
    "come trovare clienti personal trainer",
    "clienti personal trainer",
    "marketing personal trainer",
    "personal trainer freelance clienti"
  ]
});

const sections = [
  {
    title: "Perche molti trainer faticano a trovare clienti",
    text: "Il problema spesso non e tecnico, ma di chiarezza. Se il servizio non e presentato bene, se la proposta e generica o se il profilo non trasmette fiducia, anche un bravo trainer puo fare fatica a trasformare l'interesse in richieste reali."
  },
  {
    title: "La proposta deve essere leggibile",
    text: "Per trovare clienti da personal trainer devi essere chiaro su chi aiuti, in che modo lavori e quale risultato prometti in modo realistico. Piacere a tutti quasi sempre significa non risultare memorabile per nessuno."
  },
  {
    title: "Canali utili online e offline",
    text: "Il passaparola resta forte, ma conta anche la tua presenza digitale. Profilo social ordinato, bio chiara, contenuti semplici e collaborazioni con contesti locali possono creare le prime opportunita senza forzature commerciali."
  },
  {
    title: "Competenze e fiducia vanno insieme",
    text: "Acquisire clienti e mantenerli non dipende solo dalla promozione. Dipende da come lavori, da come comunichi e da quanto il tuo metodo appare coerente. Una buona formazione aiuta anche in questo passaggio."
  }
];

export default function FindClientsGuidePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Guide", item: "/blog" },
          { name: "Come trovare clienti da Personal Trainer", item: "/come-trovare-clienti-personal-trainer" }
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: "Come trovare clienti da Personal Trainer",
          description:
            "Scopri come trovare clienti da personal trainer con una proposta chiara, posizionamento credibile e azioni concrete online e offline.",
          path: "/come-trovare-clienti-personal-trainer",
          authorName: "Redazione Professione Fitness Academy",
          section: "Guide"
        })}
      />
      <PageHero
        badge="Guida business"
        title="Come trovare clienti da Personal Trainer senza sembrare improvvisato."
        description="Una guida pratica per lavorare su proposta, presenza professionale e fiducia percepita, online e offline."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="rounded-[2rem] border border-slate-200 bg-white p-8">
              <h2 className="font-display text-3xl font-bold text-slate-900">{section.title}</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">{section.text}</p>
            </div>
          ))}
        </div>
        <GuideSidebar currentPath="/come-trovare-clienti-personal-trainer" />
      </Container>
    </>
  );
}

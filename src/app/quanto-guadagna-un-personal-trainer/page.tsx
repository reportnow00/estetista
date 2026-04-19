import { articleJsonLd, buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { GuideSidebar } from "@/components/seo/guide-sidebar";

export const metadata = buildMetadata({
  title: "Quanto guadagna un Personal Trainer | Guida 2026",
  description:
    "Scopri quanto guadagna un personal trainer in palestra, da freelance o con studio proprio e quali fattori incidono davvero sui compensi.",
  path: "/quanto-guadagna-un-personal-trainer",
  type: "article",
  section: "Guide",
  authors: ["Redazione Professione Fitness Academy"],
  keywords: [
    "quanto guadagna un personal trainer",
    "stipendio personal trainer",
    "guadagni personal trainer freelance",
    "lavoro personal trainer"
  ]
});

const sections = [
  {
    title: "Quanto guadagna un personal trainer in media",
    text: "La risposta dipende dal contesto. Un personal trainer puo lavorare in palestra, come freelance oppure in formule ibride. Guadagni, continuita e margine cambiano molto in base a esperienza, posizionamento, tipo di clienti e capacita di presentare il servizio in modo professionale."
  },
  {
    title: "Differenza tra palestra e lavoro freelance",
    text: "In palestra spesso il vantaggio e entrare in un contesto gia strutturato, con flusso di persone e possibilita di costruire esperienza. Il freelance, invece, puo offrire margini piu alti, ma richiede piu competenze su proposta, acquisizione clienti e continuita commerciale."
  },
  {
    title: "Cosa incide davvero sui guadagni",
    text: "Non conta solo il numero di ore lavorate. Contano la qualita del servizio, il posizionamento, la chiarezza della proposta, il livello dei clienti che segui e la tua capacita di trasformare le competenze in fiducia percepita."
  },
  {
    title: "Perche la formazione cambia il valore professionale",
    text: "Un corso ben costruito non promette guadagni facili, ma ti aiuta a diventare piu credibile. Tecnica, programmazione, relazione col cliente e presentazione professionale sono gli elementi che rendono un trainer piu solido nel tempo."
  }
];

export default function PersonalTrainerIncomePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Guide", item: "/blog" },
          { name: "Quanto guadagna un Personal Trainer", item: "/quanto-guadagna-un-personal-trainer" }
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: "Quanto guadagna un Personal Trainer",
          description:
            "Scopri quanto guadagna un personal trainer in palestra, da freelance o con studio proprio e quali fattori incidono davvero sui compensi.",
          path: "/quanto-guadagna-un-personal-trainer",
          authorName: "Redazione Professione Fitness Academy",
          section: "Guide"
        })}
      />
      <PageHero
        badge="Guida carriera"
        title="Quanto guadagna un Personal Trainer e da cosa dipende davvero."
        description="Una guida chiara per capire come leggere compensi, opportunita e differenze tra palestra, freelance e percorsi piu strutturati."
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
        <GuideSidebar currentPath="/quanto-guadagna-un-personal-trainer" />
      </Container>
    </>
  );
}

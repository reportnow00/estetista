import { articleJsonLd, buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { GuideSidebar } from "@/components/seo/guide-sidebar";

export const metadata = buildMetadata({
  title: "Come diventare Personal Trainer | Guida completa",
  description:
    "Guida completa su come diventare Personal Trainer: competenze da sviluppare, cosa studiare, come scegliere il corso giusto e come iniziare a lavorare nel fitness.",
  path: "/diventare-personal-trainer",
  type: "article",
  section: "Guide",
  authors: ["Redazione Professione Fitness Academy"],
  keywords: [
    "come diventare personal trainer",
    "corso personal trainer",
    "personal trainer cosa studiare",
    "lavorare nel fitness"
  ]
});

const sections = [
  {
    title: "Da dove partire se vuoi diventare Personal Trainer",
    text: "Il primo passo non è cercare un titolo qualsiasi, ma capire quale percorso formativo ti aiuta davvero a costruire competenze spendibili: valutazione iniziale, relazione col cliente, programmazione, tecnica degli esercizi e basi di nutrizione applicata."
  },
  {
    title: "Cosa deve insegnarti un corso serio",
    text: "Un buon corso deve essere chiaro su struttura, docenti, modalità di studio, materiale didattico e sbocchi. Deve spiegarti cosa saprai fare dopo, non limitarsi a promettere una certificazione."
  },
  {
    title: "Come iniziare a lavorare nel fitness",
    text: "Una volta completato il percorso, conta la capacità di presentarti in modo professionale: posizionamento, proposta di valore, relazione con i clienti, linguaggio corretto e metodo di lavoro."
  },
  {
    title: "Perché il metodo conta più delle scorciatoie",
    text: "Nel fitness la credibilità si costruisce nel tempo. Scegliere una formazione ordinata e utile ti aiuta a evitare scorciatoie poco chiare e a costruire basi che puoi davvero usare nel lavoro."
  }
];

export default function BecomePersonalTrainerPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Guide", item: "/blog" },
          { name: "Come diventare Personal Trainer", item: "/diventare-personal-trainer" }
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: "Come diventare Personal Trainer",
          description:
            "Guida completa su come diventare Personal Trainer: competenze da sviluppare, cosa studiare, come scegliere il corso giusto e come iniziare a lavorare nel fitness.",
          path: "/diventare-personal-trainer",
          authorName: "Redazione Professione Fitness Academy",
          section: "Guide"
        })}
      />
      <PageHero
        badge="Guida professionale"
        title="Come diventare Personal Trainer in modo più chiaro e più concreto."
        description="Qui trovi una guida semplice per capire da dove partire, cosa imparare e come scegliere un percorso davvero utile per lavorare nel fitness."
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
        <GuideSidebar currentPath="/diventare-personal-trainer" />
      </Container>
    </>
  );
}

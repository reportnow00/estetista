import { articleJsonLd, buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { GuideSidebar } from "@/components/seo/guide-sidebar";

export const metadata = buildMetadata({
  title: "Personal Trainer: cosa studiare per iniziare bene",
  description:
    "Vuoi capire cosa studiare per diventare personal trainer? Leggi le competenze chiave, le materie utili e come scegliere un percorso davvero spendibile.",
  path: "/personal-trainer-cosa-studiare",
  type: "article",
  section: "Guide",
  authors: ["Redazione Professione Fitness Academy"],
  keywords: [
    "personal trainer cosa studiare",
    "materie personal trainer",
    "come studiare per diventare personal trainer",
    "corso personal trainer"
  ]
});

const sections = [
  {
    title: "Le materie piu importanti per un personal trainer",
    text: "Chi vuole diventare personal trainer dovrebbe studiare anatomia di base, movimento, tecnica degli esercizi, programmazione dell'allenamento, relazione con il cliente e principi di nutrizione applicata. Queste aree costruiscono una base operativa piu solida del semplice entusiasmo."
  },
  {
    title: "Perche non basta conoscere gli esercizi",
    text: "Sapere come si esegue un esercizio e utile, ma non sufficiente. Conta saper osservare il cliente, capire gli obiettivi, costruire una progressione, comunicare bene e mantenere coerenza nel metodo di lavoro."
  },
  {
    title: "Come scegliere un percorso di studio serio",
    text: "Quando valuti cosa studiare per diventare personal trainer, scegli percorsi che mostrano programma, docenti, modalita di studio e competenze in uscita. Evita formule troppo vaghe o focalizzate solo sul titolo finale."
  },
  {
    title: "Dallo studio alla spendibilita professionale",
    text: "Il passaggio piu importante e trasformare quello che studi in valore percepito. Per questo servono sia contenuti tecnici sia una formazione che ti aiuti a presentarti in modo professionale davanti ai clienti."
  }
];

export default function PersonalTrainerStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Guide", item: "/blog" },
          { name: "Personal Trainer: cosa studiare", item: "/personal-trainer-cosa-studiare" }
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: "Personal Trainer: cosa studiare",
          description:
            "Vuoi capire cosa studiare per diventare personal trainer? Leggi le competenze chiave, le materie utili e come scegliere un percorso davvero spendibile.",
          path: "/personal-trainer-cosa-studiare",
          authorName: "Redazione Professione Fitness Academy",
          section: "Guide"
        })}
      />
      <PageHero
        badge="Guida formazione"
        title="Personal Trainer: cosa studiare per costruire basi serie."
        description="Una panoramica chiara sulle competenze da sviluppare se vuoi entrare nel fitness con piu metodo, piu ordine e piu credibilita."
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
        <GuideSidebar currentPath="/personal-trainer-cosa-studiare" />
      </Container>
    </>
  );
}

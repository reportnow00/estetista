import { articleJsonLd, buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { GuideSidebar } from "@/components/seo/guide-sidebar";

export const metadata = buildMetadata({
  title: "Corso Personal Trainer riconosciuto CONI: cosa verificare davvero",
  description:
    "Cerchi un corso personal trainer riconosciuto CONI? Ecco cosa controllare davvero tra programma, docenti, attestato finale e spendibilita professionale.",
  path: "/corso-personal-trainer-riconosciuto-coni",
  type: "article",
  section: "Guide",
  authors: ["Redazione Professione Fitness Academy"],
  keywords: [
    "corso personal trainer riconosciuto coni",
    "corso personal trainer coni",
    "riconoscimento corso fitness",
    "certificazione personal trainer"
  ]
});

const sections = [
  {
    title: "Cosa significa davvero cercare un corso personal trainer riconosciuto CONI",
    text: "Questa query nasce spesso da un bisogno reale di chiarezza. Chi cerca un corso personal trainer riconosciuto CONI vuole capire se il percorso sia serio, spendibile e presentabile nel mercato del fitness."
  },
  {
    title: "Le verifiche da fare prima di iscriverti",
    text: "Prima di scegliere, controlla sempre programma, docenti, attestato finale, modalita di studio, struttura della piattaforma e trasparenza delle informazioni. Una pagina chiara vale piu di molte promesse generiche."
  },
  {
    title: "Riconoscimento e utilita professionale non sono la stessa cosa",
    text: "Un percorso puo essere percepito come solido anche grazie alla qualita con cui insegna. Nel lavoro quotidiano conta la capacita di valutare il cliente, comunicare bene, costruire una proposta e presentarsi in modo credibile."
  },
  {
    title: "Come leggere il valore del percorso in modo piu maturo",
    text: "Invece di fermarti allo slogan, chiediti cosa saprai fare dopo, come saranno organizzati i contenuti e se il percorso ti aiuta davvero a costruire una base operativa seria."
  }
];

export default function RecognizedCourseGuidePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Guide", item: "/blog" },
          { name: "Corso Personal Trainer riconosciuto CONI", item: "/corso-personal-trainer-riconosciuto-coni" }
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: "Corso Personal Trainer riconosciuto CONI",
          description:
            "Cerchi un corso personal trainer riconosciuto CONI? Ecco cosa controllare davvero tra programma, docenti, attestato finale e spendibilita professionale.",
          path: "/corso-personal-trainer-riconosciuto-coni",
          authorName: "Redazione Professione Fitness Academy",
          section: "Guide"
        })}
      />
      <PageHero
        badge="Guida certificazioni"
        title="Corso Personal Trainer riconosciuto CONI: come valutarlo con lucidita."
        description="Una guida editoriale per leggere meglio questa ricerca e capire quali segnali contano davvero quando scegli un percorso."
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
        <GuideSidebar currentPath="/corso-personal-trainer-riconosciuto-coni" />
      </Container>
    </>
  );
}

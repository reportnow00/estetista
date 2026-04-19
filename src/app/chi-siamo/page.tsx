import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";

export const metadata = buildMetadata({
  title: "Chi siamo | Professione Fitness Academy",
  description:
    "Scopri chi siamo, come lavoriamo e perché il nostro corso Personal Trainer è pensato per chi vuole entrare davvero nel mondo del fitness."
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="Chi siamo"
        title="Formazione fitness pensata per chi vuole trasformare una passione in lavoro."
        description="Non vendiamo promesse generiche: costruiamo un corso Personal Trainer con programma chiaro, contenuti utili e un taglio concreto per chi vuole lavorare nel fitness."
      />
      <Container className="grid gap-8 py-16 md:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <h2 className="font-display text-3xl font-bold text-slate-900">Posizionamento</h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            Professione Fitness Academy nasce per aiutarti a diventare Personal Trainer con una formazione fitness più chiara, più credibile e più utile per iniziare a lavorare davvero.
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <h2 className="font-display text-3xl font-bold text-slate-900">Metodo</h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            Ogni corso è costruito per accompagnarti passo dopo passo: programma chiaro, docenti qualificati, lezioni accessibili e indicazioni pratiche su come usare ciò che impari nel lavoro con i clienti.
          </p>
        </div>
      </Container>
    </>
  );
}

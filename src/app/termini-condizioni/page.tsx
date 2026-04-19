import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";

export const metadata = buildMetadata({
  title: "Termini e condizioni | Professione Fitness Academy",
  description: "Pagina legale Termini e condizioni della piattaforma Professione Fitness Academy."
});

export default function Page() {
  return (
    <>
      <PageHero
        badge="Legale"
        title="Termini e condizioni"
        description="Bozza iniziale pronta da rifinire con consulente legale e policy manager."
      />
      <Container className="py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-base leading-8 text-slate-700">
          Questa è una base iniziale. Prima del deploy pubblico è consigliato adattare testi, contitolari, contatti, finalità del trattamento, cookie effettivamente usati, termini di vendita, diritto di recesso e riferimenti societari.
        </div>
      </Container>
    </>
  );
}

import { getStaticFaqs } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/ui/json-ld";

export const metadata = buildMetadata({
  title: "FAQ | Professione Fitness Academy",
  description:
    "Domande frequenti sul corso Personal Trainer: costi, accesso alle lezioni, pagamenti, tempi di studio e informazioni utili prima dell'iscrizione."
});

export default async function FaqPage() {
  const faqs = await getStaticFaqs("faq");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer }
          }))
        }}
      />
      <PageHero
        badge="FAQ"
        title="Domande frequenti sul corso Personal Trainer"
        description="Qui trovi risposte chiare alle domande più comuni prima di iscriverti: costo del corso, accesso alle lezioni, pagamento, tempi di studio e modalità di fruizione."
      />
      <Container className="max-w-4xl py-16">
        <Accordion items={faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
      </Container>
    </>
  );
}

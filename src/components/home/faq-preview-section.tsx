import type { FAQ } from "@prisma/client";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";

export function FaqPreviewSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="bg-slate-50 py-20">
      <Container className="max-w-4xl">
        <SectionHeading
          badge="FAQ"
          title="Domande frequenti pensate per chiarire, non per riempire spazio."
          description="Trovi risposte rapide su corso, pagamenti, accesso ai contenuti e funzionamento dell'area riservata."
          center
        />
        <div className="mt-10">
          <Accordion items={faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
        </div>
      </Container>
    </section>
  );
}

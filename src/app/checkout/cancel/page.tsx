import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";

export const metadata = buildMetadata({
  title: "Pagamento annullato | Professione Fitness Academy",
  description: "Pagina di annullamento del checkout Stripe.",
  noindex: true
});

export default function CheckoutCancelPage() {
  return (
    <>
      <PageHero
        badge="Checkout annullato"
        title="Pagamento non completato"
        description="Nessun corso e stato sbloccato. Puoi tornare alla pagina del percorso e riprovare quando vuoi."
      />
      <Container className="py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <Link href="/corsi/diventa-un-personal-trainer" className="font-semibold text-brand-800">
            Torna al corso
          </Link>
        </div>
      </Container>
    </>
  );
}

import Link from "next/link";
import { CheckCircle2, Clock3, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { formatDate, formatPrice } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Pagamento completato | Professione Fitness Academy",
  description: "Stato del pagamento e attivazione del corso acquistato.",
  noindex: true
});

type Props = {
  searchParams?: Promise<{ session_id?: string }>;
};

function buildContent(status?: "PENDING" | "PAID" | "FAILED" | "CANCELED" | "REFUNDED") {
  if (status === "PAID") {
    return {
      badge: "Pagamento confermato",
      title: "Accesso attivato correttamente",
      description:
        "Il pagamento e stato confermato e il corso e disponibile nella tua area riservata.",
      icon: CheckCircle2,
      iconClassName: "text-emerald-500",
      statusLabel: "Confermato"
    };
  }

  if (status === "FAILED" || status === "CANCELED" || status === "REFUNDED") {
    return {
      badge: "Verifica ordine",
      title: "C'e stato un problema nella conferma dell'ordine",
      description:
        "Se hai completato il pagamento ma non vedi ancora il corso, contattaci e verificheremo subito l'attivazione.",
      icon: AlertCircle,
      iconClassName: "text-amber-500",
      statusLabel: "Da verificare"
    };
  }

  return {
    badge: "Pagamento in verifica",
    title: "Stiamo confermando il tuo acquisto",
    description:
      "Il pagamento e stato ricevuto. In pochi istanti il corso comparira nella tua area riservata.",
    icon: Clock3,
    iconClassName: "text-sky-500",
    statusLabel: "In lavorazione"
  };
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const sessionId = params.session_id;
  const session = await getSession();

  const ownedOrder = sessionId && session
    ? await prisma.order.findFirst({
        where: {
          stripeCheckoutId: sessionId,
          userId: session.userId
        },
        select: {
          id: true,
          status: true,
          amountCents: true,
          paymentCompletedAt: true,
          stripeHostedInvoiceUrl: true,
          stripeInvoiceNumber: true,
          stripeInvoicePdfUrl: true,
          createdAt: true,
          course: {
            select: {
              title: true,
              slug: true
            }
          }
        }
      })
    : null;

  const content = buildContent(ownedOrder?.status);
  const StatusIcon = content.icon;

  return (
    <>
      <PageHero badge={content.badge} title={content.title} description={content.description} />
      <Container className="py-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-slate-50 p-3">
                <StatusIcon className={`h-7 w-7 ${content.iconClassName}`} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Stato ordine
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                  {content.statusLabel}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-slate-600">
                  {ownedOrder
                    ? `Ordine ${ownedOrder.id.slice(-8).toUpperCase()} relativo al corso ${ownedOrder.course.title}.`
                    : "Non siamo ancora riusciti a collegare la sessione di pagamento a un ordine interno."}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard/corsi"
                className="inline-flex items-center justify-center rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Vai a I miei corsi
              </Link>
              {ownedOrder?.course.slug ? (
                <Link
                  href={`/dashboard/corsi/${ownedOrder.course.slug}`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Apri il corso
                </Link>
              ) : null}
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center rounded-full border border-transparent px-2 py-3 text-sm font-semibold text-brand-800 transition hover:text-brand-900"
              >
                Hai bisogno di aiuto?
              </Link>
            </div>

            {ownedOrder?.stripeHostedInvoiceUrl || ownedOrder?.stripeInvoicePdfUrl ? (
              <div className="mt-8 rounded-[1.8rem] border border-emerald-100 bg-emerald-50/80 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Documento pagamento
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {ownedOrder.stripeInvoiceNumber
                    ? `Stripe ha generato la fattura ${ownedOrder.stripeInvoiceNumber}.`
                    : "Stripe ha generato il documento collegato al pagamento."}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {ownedOrder.stripeHostedInvoiceUrl ? (
                    <Link
                      href={ownedOrder.stripeHostedInvoiceUrl}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Apri fattura
                    </Link>
                  ) : null}
                  {ownedOrder.stripeInvoicePdfUrl ? (
                    <Link
                      href={ownedOrder.stripeInvoicePdfUrl}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Scarica PDF
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-slate-50/90 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Riepilogo
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Corso
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {ownedOrder?.course.title ?? "Pagamento in verifica"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Importo
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {ownedOrder ? formatPrice(ownedOrder.amountCents) : "In aggiornamento"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Conferma
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {ownedOrder?.paymentCompletedAt
                    ? formatDate(ownedOrder.paymentCompletedAt)
                    : ownedOrder
                      ? "Stiamo completando la registrazione del pagamento."
                      : "Se hai appena pagato, attendi qualche secondo e aggiorna la pagina."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

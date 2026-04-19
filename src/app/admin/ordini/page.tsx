import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { formatStoredStripeAddress } from "@/lib/stripe";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    include: { course: true, user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <PageHero
        badge="Admin | Ordini"
        title="Ordini e pagamenti"
        description="Vista ordini collegata ai pagamenti Stripe, con snapshot cliente e riferimenti invoice."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/ordini" />
        <div className="space-y-4">
          {orders.map((order) => {
            const billingAddress = formatStoredStripeAddress(order.billingAddressJson);

            return (
              <div key={order.id} className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {order.user.name} | {order.course.title}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {formatDate(order.createdAt)} | {formatPrice(order.amountCents)}
                    </div>
                    {(order.billingName ||
                      order.billingEmail ||
                      order.billingTaxId ||
                      order.stripeInvoiceNumber) ? (
                      <div className="mt-4 space-y-1 text-sm text-slate-600">
                        {order.billingName ? <div>Intestazione: {order.billingName}</div> : null}
                        {order.billingEmail ? (
                          <div>Email fatturazione: {order.billingEmail}</div>
                        ) : null}
                        {order.billingTaxId ? (
                          <div>
                            Tax ID: {order.billingTaxId}
                            {order.billingTaxIdType ? ` (${order.billingTaxIdType})` : ""}
                          </div>
                        ) : null}
                        {billingAddress ? <div>Indirizzo: {billingAddress}</div> : null}
                        {order.stripeInvoiceNumber ? (
                          <div>Fattura Stripe: {order.stripeInvoiceNumber}</div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-3 text-right">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
                      {order.status}
                    </div>
                    {order.stripeHostedInvoiceUrl ? (
                      <a
                        href={order.stripeHostedInvoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-50"
                      >
                        Apri fattura
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
}

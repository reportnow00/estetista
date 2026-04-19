import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isStripeKeyConfigured, requireSecretEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getStripeClient, serializeStripeAddress } from "@/lib/stripe";

async function resolveOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
  const fallbackIds = [session.metadata?.orderId, session.client_reference_id].filter(
    (value): value is string => typeof value === "string" && value.length > 0
  );

  if (fallbackIds.length > 0) {
    const uniqueIds = [...new Set(fallbackIds)];
    const orderById = await prisma.order.findFirst({
      where: { id: { in: uniqueIds } },
      select: {
        id: true,
        userId: true,
        courseId: true,
        status: true
      }
    });

    if (orderById) {
      return orderById;
    }
  }

  return prisma.order.findUnique({
    where: { stripeCheckoutId: session.id },
    select: {
      id: true,
      userId: true,
      courseId: true,
      status: true
    }
  });
}

async function resolveInvoiceSnapshot(stripe: Stripe, session: Stripe.Checkout.Session) {
  const expandedInvoice =
    session.invoice && typeof session.invoice !== "string" ? session.invoice : null;
  const invoiceId = typeof session.invoice === "string" ? session.invoice : expandedInvoice?.id || null;

  if (!invoiceId) {
    return null;
  }

  const invoice = expandedInvoice ?? (await stripe.invoices.retrieve(invoiceId));

  return {
    stripeHostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    stripeInvoiceId: invoice.id,
    stripeInvoiceNumber: invoice.number ?? null,
    stripeInvoicePdfUrl: invoice.invoice_pdf ?? null
  };
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  const logContext = { route: "stripe-webhook" };

  if (!signature || !isStripeKeyConfigured("STRIPE_WEBHOOK_SECRET")) {
    console.error("[PFA][StripeWebhook] Configurazione mancante", logContext);
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 400 });
  }

  const stripe = getStripeClient();
  const webhookSecret = requireSecretEnv("STRIPE_WEBHOOK_SECRET");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[PFA][StripeWebhook] Firma non valida", { ...logContext, error });
    return NextResponse.json({ error: "Firma webhook non valida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadataOrderId = session.metadata?.orderId;
    const metadataCourseId = session.metadata?.courseId;
    const metadataUserId = session.metadata?.userId;

    if (session.payment_status !== "paid") {
      console.warn("[PFA][StripeWebhook] Checkout completato senza pagamento confermato", {
        ...logContext,
        eventId: event.id,
        sessionId: session.id,
        paymentStatus: session.payment_status
      });
      return NextResponse.json({ received: true });
    }

    const order = await resolveOrderFromCheckoutSession(session);
    const invoiceSnapshot = await resolveInvoiceSnapshot(stripe, session);

    if (!order) {
      console.error("[PFA][StripeWebhook] Nessun ordine trovato per la sessione completata", {
        ...logContext,
        eventId: event.id,
        sessionId: session.id,
        metadataOrderId,
        clientReferenceId: session.client_reference_id
      });
      return NextResponse.json({ received: true });
    }

    const resolvedCourseId = metadataCourseId ?? order.courseId;
    const resolvedUserId = metadataUserId ?? order.userId;

    if (resolvedCourseId !== order.courseId || resolvedUserId !== order.userId) {
      console.error("[PFA][StripeWebhook] Metadata incoerenti rispetto all'ordine", {
        ...logContext,
        eventId: event.id,
        sessionId: session.id,
        orderId: order.id,
        orderCourseId: order.courseId,
        orderUserId: order.userId,
        metadataCourseId,
        metadataUserId
      });
      return NextResponse.json({ received: true });
    }

    const customerDetails = session.customer_details;
    const primaryTaxId = customerDetails?.tax_ids?.[0];

    const alreadyLogged = await prisma.purchaseEventLog.findUnique({
      where: { stripeEventId: event.id }
    });

    if (alreadyLogged) {
      console.info("[PFA][StripeWebhook] Evento duplicato ignorato", {
        ...logContext,
        eventId: event.id,
        orderId: order.id
      });
      return NextResponse.json({ received: true });
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.purchaseEventLog.create({
          data: {
            orderId: order.id,
            stripeEventId: event.id,
            eventType: event.type,
            payloadJson: JSON.stringify(session)
          }
        });

        await tx.order.update({
          where: { id: order.id },
          data: {
            billingAddressJson: serializeStripeAddress(customerDetails?.address),
            billingEmail: customerDetails?.email ?? null,
            billingName: customerDetails?.name ?? null,
            billingPhone: customerDetails?.phone ?? null,
            billingTaxExempt: customerDetails?.tax_exempt ?? null,
            billingTaxId: primaryTaxId?.value ?? null,
            billingTaxIdType: primaryTaxId?.type ?? null,
            status: "PAID",
            stripeCheckoutId: session.id,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            stripeEventId: event.id,
            stripeHostedInvoiceUrl: invoiceSnapshot?.stripeHostedInvoiceUrl ?? null,
            stripeInvoiceId: invoiceSnapshot?.stripeInvoiceId ?? null,
            stripeInvoiceNumber: invoiceSnapshot?.stripeInvoiceNumber ?? null,
            stripeInvoicePdfUrl: invoiceSnapshot?.stripeInvoicePdfUrl ?? null,
            stripePaymentIntent:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            paymentCompletedAt: new Date()
          }
        });

        if (typeof session.customer === "string") {
          await tx.user.update({
            where: { id: order.userId },
            data: { stripeCustomerId: session.customer }
          });
        }

        await tx.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: order.userId,
              courseId: order.courseId
            }
          },
          update: {
            orderId: order.id,
            status: "ACTIVE"
          },
          create: {
            userId: order.userId,
            courseId: order.courseId,
            orderId: order.id,
            status: "ACTIVE"
          }
        });
      });
    } catch (error) {
      console.error("[PFA][StripeWebhook] Errore nella riconciliazione del pagamento", {
        ...logContext,
        eventId: event.id,
        sessionId: session.id,
        orderId: order.id,
        error
      });
      return NextResponse.json({ error: "Webhook non processato" }, { status: 500 });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const order = await resolveOrderFromCheckoutSession(session);

    if (order) {
      await prisma.order.updateMany({
        where: { id: order.id, status: "PENDING" },
        data: { status: "CANCELED" }
      });
    } else {
      console.warn("[PFA][StripeWebhook] checkout.session.expired senza ordine riconciliabile", {
        ...logContext,
        eventId: event.id,
        sessionId: session.id
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.warn("[PFA][StripeWebhook] Payment intent fallito", {
      ...logContext,
      eventId: event.id,
      paymentIntent: intent.id
    });
  }

  return NextResponse.json({ received: true });
}

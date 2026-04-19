import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripeCheckoutConfig, isStripeKeyConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getStripeCheckoutLocale, getStripeClient } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: "courseId mancante" }, { status: 400 });
  }

  if (!isStripeKeyConfigured("STRIPE_SECRET_KEY")) {
    return NextResponse.json(
      { error: "Stripe non e ancora configurato. Collega le chiavi reali per attivare il checkout." },
      { status: 503 }
    );
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!course || !course.published) {
    return NextResponse.json({ error: "Corso non disponibile" }, { status: 404 });
  }

  const alreadyEnrolled = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.userId,
        courseId: course.id
      }
    }
  });

  if (alreadyEnrolled) {
    return NextResponse.json({ error: "Hai gia acquistato questo corso." }, { status: 409 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, stripeCustomerId: true }
  });

  if (!currentUser) {
    console.error("[PFA][StripeCheckout] Sessione valida ma utente non trovato", {
      userId: session.userId,
      courseId
    });
    return NextResponse.json({ error: "Sessione non valida, accedi di nuovo." }, { status: 401 });
  }

  const amount = course.salePriceCents ?? course.fullPriceCents;
  const stripe = getStripeClient();
  const checkoutConfig = getStripeCheckoutConfig();

  let order = await prisma.order.findFirst({
    where: {
      userId: currentUser.id,
      courseId: course.id,
      status: "PENDING"
    },
    orderBy: { createdAt: "desc" }
  });

  if (order?.stripeCheckoutId) {
    try {
      const existingCheckout = await stripe.checkout.sessions.retrieve(order.stripeCheckoutId);

      if (existingCheckout.payment_status === "paid") {
        return NextResponse.json(
          { error: "Pagamento gia inviato. Stiamo confermando l'accesso al corso." },
          { status: 409 }
        );
      }

      if (existingCheckout.status === "open" && existingCheckout.url) {
        return NextResponse.json({ url: existingCheckout.url, reused: true });
      }

      if (existingCheckout.status === "expired") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "CANCELED" }
        });
        order = null;
      }
    } catch (error) {
      console.warn("[PFA][StripeCheckout] Impossibile recuperare una sessione esistente", {
        orderId: order?.id,
        stripeCheckoutId: order?.stripeCheckoutId,
        error
      });
    }
  }

  if (!order) {
    order = await prisma.order.create({
      data: {
        userId: currentUser.id,
        courseId: course.id,
        amountCents: amount,
        status: "PENDING"
      }
    });
  }

  const activeOrder = order;

  try {
    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      phone_number_collection: { enabled: checkoutConfig.phoneNumberCollectionEnabled },
      tax_id_collection: {
        enabled: checkoutConfig.taxIdCollectionEnabled,
        required: checkoutConfig.taxIdCollectionEnabled ? "if_supported" : undefined
      },
      invoice_creation: checkoutConfig.invoiceCreationEnabled
        ? {
            enabled: true,
            invoice_data: {
              description: `Accesso al corso ${course.title}`,
              footer: checkoutConfig.invoiceFooter || undefined,
              metadata: {
                orderId: activeOrder.id,
                courseId: course.id,
                userId: currentUser.id
              }
            }
          }
        : { enabled: false },
      locale: getStripeCheckoutLocale(),
      success_url: absoluteUrl(`/checkout/success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absoluteUrl("/checkout/cancel"),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: course.title,
              description: course.shortDescription
            }
          }
        }
      ],
      metadata: {
        orderId: activeOrder.id,
        courseId: course.id,
        userId: currentUser.id
      },
      client_reference_id: activeOrder.id
    };

    if (checkoutConfig.automaticTaxEnabled) {
      checkoutParams.automatic_tax = { enabled: true };
    }

    if (currentUser.stripeCustomerId) {
      checkoutParams.customer = currentUser.stripeCustomerId;
      checkoutParams.customer_update = {
        address: "auto",
        name: "auto"
      };
    } else {
      checkoutParams.customer_creation = "always";
      checkoutParams.customer_email = currentUser.email;
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams, {
      idempotencyKey: `checkout_${activeOrder.id}`
    });

    if (!checkoutSession.url) {
      console.error("[PFA][StripeCheckout] Sessione creata senza URL", {
        orderId: activeOrder.id,
        courseId: course.id
      });
      await prisma.order.update({
        where: { id: activeOrder.id },
        data: { status: "FAILED" }
      });
      return NextResponse.json({ error: "Checkout temporaneamente non disponibile" }, { status: 500 });
    }

    await prisma.order.update({
      where: { id: activeOrder.id },
      data: {
        billingEmail: currentUser.email,
        stripeCheckoutId: checkoutSession.id,
        stripeCustomerId:
          typeof checkoutSession.customer === "string" ? checkoutSession.customer : activeOrder.stripeCustomerId
      }
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[PFA][StripeCheckout] Creazione checkout fallita", {
      orderId: activeOrder.id,
      courseId: course.id,
      error
    });

    await prisma.order.update({
      where: { id: activeOrder.id },
      data: { status: "FAILED" }
    });

    return NextResponse.json({ error: "Impossibile avviare il checkout" }, { status: 500 });
  }
}

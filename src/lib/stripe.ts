import Stripe from "stripe";
import { getOptionalEnv, requireSecretEnv } from "@/lib/env";

export function getStripeClient() {
  const secretKey = requireSecretEnv("STRIPE_SECRET_KEY");

  return new Stripe(secretKey);
}

export function getStripeCheckoutLocale(): Stripe.Checkout.SessionCreateParams.Locale {
  const locale = getOptionalEnv("STRIPE_CHECKOUT_LOCALE");

  if (locale === "it" || locale === "en") {
    return locale;
  }

  return "it";
}

export function serializeStripeAddress(address?: Stripe.Address | null) {
  if (!address) return null;

  const normalizedAddress = {
    city: address.city ?? null,
    country: address.country ?? null,
    line1: address.line1 ?? null,
    line2: address.line2 ?? null,
    postal_code: address.postal_code ?? null,
    state: address.state ?? null
  };

  if (!Object.values(normalizedAddress).some(Boolean)) {
    return null;
  }

  return JSON.stringify(normalizedAddress);
}

export function formatStoredStripeAddress(addressJson?: string | null) {
  if (!addressJson) return null;

  try {
    const address = JSON.parse(addressJson) as Record<string, string | null>;
    const parts = [
      address.line1,
      address.line2,
      [address.postal_code, address.city].filter(Boolean).join(" ").trim() || null,
      address.state,
      address.country
    ].filter((value): value is string => Boolean(value));

    return parts.length > 0 ? parts.join(", ") : null;
  } catch {
    return null;
  }
}

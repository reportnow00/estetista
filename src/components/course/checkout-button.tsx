"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/env";

type Props = {
  courseId: string;
  nextPath?: string;
  stripeReady?: boolean;
};

export function CheckoutButton({ courseId, nextPath = "/corsi", stripeReady = true }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!stripeReady) {
      alert("Checkout in preparazione: collega prima le chiavi reali di Stripe.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(withBasePath("/api/stripe/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId })
      });

      if (response.status === 401) {
        window.location.href = withBasePath(`/login?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Impossibile avviare il checkout.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={handleCheckout}
        className="w-full"
        size="lg"
        disabled={loading || !stripeReady}
      >
        {loading
          ? "Reindirizzamento..."
          : stripeReady
            ? "Acquista ora"
            : "Checkout in preparazione"}
      </Button>
      <p className="text-xs leading-6 text-slate-500">
        {stripeReady
          ? "Stripe raccogliera in modo sicuro email, indirizzo di fatturazione, telefono e tax ID se supportato."
          : "Il flusso e gia predisposto, ma servono ancora le chiavi reali del tuo account Stripe per attivarlo."}
      </p>
    </div>
  );
}

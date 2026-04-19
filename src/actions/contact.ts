"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { sendContactRequestEmail } from "@/lib/mailer";
import { enforceRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(4),
  message: z.string().trim().min(20)
});

export async function submitContactAction(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    redirect("/contatti?error=Controlla%20nome,%20email%20e%20messaggio.");
  }

  try {
    await enforceRateLimit({
      action: "contact",
      identifier: parsed.data.email,
      limit: 4,
      windowMs: 1000 * 60 * 30
    });
    await sendContactRequestEmail(parsed.data);
    redirect("/contatti?sent=1");
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      redirect("/contatti?error=Hai%20inviato%20troppe%20richieste.%20Riprova%20piu%20tardi.");
    }
    console.error("[PFA] Invio richiesta contatto fallito:", error);
    redirect("/contatti?error=Impossibile%20inviare%20la%20richiesta.%20Riprova%20tra%20poco.");
  }
}

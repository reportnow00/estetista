import { getAppUrl, getOptionalEnv, hasResendEmailConfig } from "@/lib/env";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function canSendTransactionalEmail() {
  return hasResendEmailConfig();
}

export async function sendPasswordResetEmail({
  to,
  resetLink,
  userName
}: {
  to: string;
  resetLink: string;
  userName: string;
}) {
  const apiKey = getOptionalEnv("RESEND_API_KEY");
  const emailFrom = getOptionalEnv("EMAIL_FROM");
  const appName = getOptionalEnv("APP_NAME") || "Professione Fitness Academy";
  const appUrl = getAppUrl();

  if (!apiKey || !emailFrom) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[PFA] Link reset password:", resetLink);
      return;
    }

    throw new Error("Provider email non configurato");
  }

  const safeName = escapeHtml(userName);
  const safeLink = escapeHtml(resetLink);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [to],
      subject: `${appName} | Reimposta la tua password`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto;padding:24px">
          <h1 style="margin:0 0 16px;font-size:28px">Reimposta la tua password</h1>
          <p>Ciao ${safeName},</p>
          <p>abbiamo ricevuto una richiesta di reset password per il tuo account su ${escapeHtml(appName)}.</p>
          <p style="margin:24px 0">
            <a href="${safeLink}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">
              Scegli una nuova password
            </a>
          </p>
          <p>Se il pulsante non funziona, copia e incolla questo link nel browser:</p>
          <p><a href="${safeLink}">${safeLink}</a></p>
          <p>Il link resta valido per 2 ore.</p>
          <p style="color:#475569;font-size:14px">Se non hai richiesto tu il reset, puoi ignorare questa email.</p>
          <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0" />
          <p style="color:#64748b;font-size:13px;margin:0">${escapeHtml(appName)} · <a href="${escapeHtml(appUrl)}">${escapeHtml(appUrl)}</a></p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Invio email fallito (${response.status}): ${errorBody}`);
  }
}

export async function sendContactRequestEmail({
  name,
  email,
  phone,
  subject,
  message
}: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const apiKey = getOptionalEnv("RESEND_API_KEY");
  const emailFrom = getOptionalEnv("EMAIL_FROM");
  const recipient = getOptionalEnv("CONTACT_EMAIL_TO") || "info@professionefitnessacademy.it";
  const appName = getOptionalEnv("APP_NAME") || "Professione Fitness Academy";
  const appUrl = getAppUrl();

  if (!apiKey || !emailFrom) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[PFA] Richiesta contatto:", { name, email, phone, subject, message });
      return;
    }

    throw new Error("Provider email non configurato");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "");
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [recipient],
      reply_to: email,
      subject: `${appName} | Nuova richiesta contatto`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:720px;margin:0 auto;padding:24px">
          <h1 style="margin:0 0 16px;font-size:28px">Nuova richiesta contatto</h1>
          <p><strong>Nome:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          ${safePhone ? `<p><strong>Telefono:</strong> ${safePhone}</p>` : ""}
          <p><strong>Oggetto:</strong> ${safeSubject}</p>
          <div style="margin-top:24px;padding:18px 20px;border-radius:20px;background:#f8fafc;border:1px solid #e2e8f0">
            ${safeMessage}
          </div>
          <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0" />
          <p style="color:#64748b;font-size:13px;margin:0">${escapeHtml(appName)} · <a href="${escapeHtml(appUrl)}">${escapeHtml(appUrl)}</a></p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Invio email fallito (${response.status}): ${errorBody}`);
  }
}

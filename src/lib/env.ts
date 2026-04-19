function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function looksLikePlaceholder(value: string) {
  return value.includes("replace-with") || value.endsWith("_xxx");
}

function normalizeBasePath(value?: string) {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "";

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

function readBooleanEnv(name: string, fallback = false) {
  const value = readEnv(name);
  if (!value) return fallback;

  const normalized = value.toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;

  return fallback;
}

export function getOptionalEnv(name: string) {
  return readEnv(name);
}

export function requireSecretEnv(name: string) {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`${name} mancante`);
  }

  if (process.env.NODE_ENV === "production" && looksLikePlaceholder(value)) {
    throw new Error(`${name} non configurata correttamente per la produzione`);
  }

  return value;
}

export function getAppUrl() {
  return readEnv("NEXT_PUBLIC_APP_URL") || "http://localhost:3000";
}

export function getBasePath() {
  return normalizeBasePath(readEnv("NEXT_PUBLIC_BASE_PATH"));
}

export function withBasePath(path: string) {
  if (!path) return getBasePath() || "/";
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const basePath = getBasePath();

  if (!basePath) return normalizedPath;
  if (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return normalizedPath === "/" ? basePath : `${basePath}${normalizedPath}`;
}

export function hasResendEmailConfig() {
  return Boolean(readEnv("RESEND_API_KEY") && readEnv("EMAIL_FROM"));
}

export function isStripeKeyConfigured(name: "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET") {
  const value = readEnv(name);
  return Boolean(value && !looksLikePlaceholder(value));
}

export function getStripeCheckoutConfig() {
  return {
    automaticTaxEnabled: readBooleanEnv("STRIPE_AUTOMATIC_TAX_ENABLED", false),
    invoiceCreationEnabled: readBooleanEnv("STRIPE_INVOICE_CREATION_ENABLED", true),
    phoneNumberCollectionEnabled: readBooleanEnv("STRIPE_PHONE_NUMBER_COLLECTION_ENABLED", true),
    taxIdCollectionEnabled: readBooleanEnv("STRIPE_TAX_ID_COLLECTION_ENABLED", true),
    invoiceFooter: readEnv("STRIPE_INVOICE_FOOTER")
  };
}

export function isStaticExport() {
  return process.env.STATIC_EXPORT === "true" || process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
}

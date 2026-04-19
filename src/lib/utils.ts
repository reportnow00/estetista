import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAppUrl } from "@/lib/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = "/") {
  const baseUrl = getAppUrl();
  return new URL(path, baseUrl).toString();
}

export function getSafeRedirectPath(path: string | null | undefined, fallback = "/") {
  if (!path) return fallback;

  const normalizedPath = path.trim();
  if (!normalizedPath.startsWith("/") || normalizedPath.startsWith("//")) {
    return fallback;
  }

  return normalizedPath;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
  }).format(cents / 100);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "long"
  }).format(new Date(date));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

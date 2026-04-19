import type { Prisma } from "@prisma/client";

export type LessonSlide = {
  title: string;
  body: string;
  imageUrl: string;
};

function sanitizeSlideField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeLessonSlides(value: unknown): LessonSlide[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;

      const slide = entry as Record<string, unknown>;
      const normalized = {
        title: sanitizeSlideField(slide.title),
        body: sanitizeSlideField(slide.body),
        imageUrl: sanitizeSlideField(slide.imageUrl)
      };

      if (!normalized.title && !normalized.body && !normalized.imageUrl) return null;
      return normalized;
    })
    .filter((entry): entry is LessonSlide => Boolean(entry));
}

export function parseLessonSlides(value: Prisma.JsonValue | null | undefined) {
  return normalizeLessonSlides(value);
}

export function parseSlidesFromFormValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    return normalizeLessonSlides(JSON.parse(value));
  } catch {
    return [];
  }
}

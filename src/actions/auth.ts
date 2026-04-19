'use server';

import type { LessonType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, requireAdmin, requireUser } from "@/lib/session";
import { createRawToken, hashPassword, hashToken, verifyPassword } from "@/lib/password";
import { canSendTransactionalEmail, sendPasswordResetEmail } from "@/lib/mailer";
import { parseSlidesFromFormValue } from "@/lib/lesson-slides";
import { enforceRateLimit } from "@/lib/rate-limit";
import { absoluteUrl, getSafeRedirectPath, slugify } from "@/lib/utils";

function withNext(path: string, nextPath?: string) {
  const safeNextPath = getSafeRedirectPath(nextPath, "");
  const url = new URL(path, "http://localhost");

  if (safeNextPath) {
    url.searchParams.set("next", safeNextPath);
  }

  return `${url.pathname}${url.search}`;
}

function withMessage(path: string, type: "success" | "error", message: string) {
  const safePath = getSafeRedirectPath(path, "/admin");
  const url = new URL(safePath, "http://localhost");
  url.searchParams.set(type, message);
  return `${url.pathname}${url.search}`;
}

async function recalculateEnrollmentProgressForCourse(courseId: string) {
  const [totalLessons, enrollments] = await Promise.all([
    prisma.lesson.count({
      where: {
        module: { courseId }
      }
    }),
    prisma.enrollment.findMany({
      where: {
        courseId,
        status: {
          in: ["ACTIVE", "COMPLETED"]
        }
      },
      select: {
        id: true,
        userId: true
      }
    })
  ]);

  if (!enrollments.length) return;

  if (totalLessons === 0) {
    await prisma.enrollment.updateMany({
      where: {
        courseId,
        status: {
          in: ["ACTIVE", "COMPLETED"]
        }
      },
      data: { progressPercent: 0 }
    });
    return;
  }

  await Promise.all(
    enrollments.map(async (enrollment) => {
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: enrollment.userId,
          completed: true,
          lesson: {
            module: { courseId }
          }
        }
      });

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercent: Math.round((completedLessons / totalLessons) * 100)
        }
      });
    })
  );
}

async function normalizeModuleSortOrder(courseId: string, tx: Prisma.TransactionClient) {
  const modules = await tx.courseModule.findMany({
    where: { courseId },
    orderBy: { sortOrder: "asc" },
    select: { id: true }
  });

  await Promise.all(
    modules.map((courseModule, index) =>
      tx.courseModule.update({
        where: { id: courseModule.id },
        data: { sortOrder: index + 1 }
      })
    )
  );
}

async function normalizeLessonSortOrder(moduleId: string, tx: Prisma.TransactionClient) {
  const lessons = await tx.lesson.findMany({
    where: { moduleId },
    orderBy: { sortOrder: "asc" },
    select: { id: true }
  });

  await Promise.all(
    lessons.map((lesson, index) =>
      tx.lesson.update({
        where: { id: lesson.id },
        data: { sortOrder: index + 1 }
      })
    )
  );
}

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function registerAction(formData: FormData) {
  const requestedNextPath = getSafeRedirectPath(String(formData.get("next") || ""), "");

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect(withNext("/registrazione?error=Controlla%20i%20campi%20del%20modulo", requestedNextPath));
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() }
  });

  if (existing) {
    redirect(
      withNext(
        "/registrazione?error=Esiste%20gi%C3%A0%20un%20account%20con%20questa%20email",
        requestedNextPath
      )
    );
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password)
    }
  });

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });

  redirect(getSafeRedirectPath(requestedNextPath, "/dashboard"));
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").toLowerCase();
  const password = String(formData.get("password") || "");
  const requestedNextPath = getSafeRedirectPath(String(formData.get("next") || ""), "");

  try {
    await enforceRateLimit({
      action: "login",
      identifier: email,
      limit: 6,
      windowMs: 1000 * 60 * 15
    });
  } catch {
    redirect(
      withNext(
        "/login?error=Troppe%20richieste%20di%20accesso.%20Riprova%20tra%20qualche%20minuto",
        requestedNextPath
      )
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    redirect(withNext("/login?error=Email%20o%20password%20non%20corretti", requestedNextPath));
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    redirect(withNext("/login?error=Email%20o%20password%20non%20corretti", requestedNextPath));
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });

  redirect(getSafeRedirectPath(requestedNextPath, user.role === "ADMIN" ? "/admin" : "/dashboard"));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function updateProfileAction(formData: FormData) {
  const currentUser = await requireUser();
  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || "") || null,
      city: String(formData.get("city") || "") || null,
      bio: String(formData.get("bio") || "") || null
    }
  });

  revalidatePath("/dashboard/profilo");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") || "").toLowerCase();

  try {
    await enforceRateLimit({
      action: "password-reset",
      identifier: email,
      limit: 3,
      windowMs: 1000 * 60 * 30
    });
  } catch {
    redirect("/recupero-password?error=Troppe%20richieste.%20Riprova%20piu%20tardi");
  }

  if (process.env.NODE_ENV === "production" && !canSendTransactionalEmail()) {
    redirect("/recupero-password?error=Servizio%20temporaneamente%20non%20disponibile");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) redirect("/recupero-password?sent=1");

  const rawToken = createRawToken();
  const tokenHash = hashToken(rawToken);

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2)
    }
  });

  const link = absoluteUrl(`/reimposta-password/${rawToken}`);

  try {
    await sendPasswordResetEmail({
      to: user.email,
      userName: user.name,
      resetLink: link
    });
  } catch (error) {
    console.error("[PFA] Invio email reset fallito:", error);
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } }).catch(() => undefined);
  }

  redirect("/recupero-password?sent=1");
}

export async function resetPasswordAction(token: string, formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password.length < 8) redirect("/recupero-password?error=La%20password%20deve%20avere%20almeno%208%20caratteri");

  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    redirect("/recupero-password?error=Token%20non%20valido%20o%20scaduto");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: await hashPassword(password) }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() }
    })
  ]);

  await createSession({
    userId: resetToken.user.id,
    email: resetToken.user.email,
    name: resetToken.user.name,
    role: resetToken.user.role
  });

  redirect("/dashboard");
}

const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  subtitle: z.string().min(10),
  shortDescription: z.string().min(20),
  longDescription: z.string().min(60),
  outcome: z.string().min(10),
  audience: z.string().min(10),
  certification: z.string().min(10),
  durationLabel: z.string().min(2),
  supportLabel: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  fullPriceCents: z.coerce.number().int().positive(),
  salePriceCents: z.coerce.number().int().optional(),
  mode: z.enum(["ONLINE", "IN_PRESENCE", "HYBRID"]),
  level: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED", "SPECIALIST"]),
  categoryId: z.string().optional(),
  published: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  badges: z.string().optional(),
  benefits: z.string().optional(),
  careerOutcomes: z.string().optional(),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  seoCanonicalUrl: z.string().url().optional().or(z.literal("")),
  seoOgImage: z.string().url().optional().or(z.literal("")),
  seoNoindex: z.coerce.boolean().optional()
});

export async function saveCourseAction(formData: FormData) {
  await requireAdmin();
  const parsed = courseSchema.safeParse({
    id: String(formData.get("id") || ""),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    shortDescription: formData.get("shortDescription"),
    longDescription: formData.get("longDescription"),
    outcome: formData.get("outcome"),
    audience: formData.get("audience"),
    certification: formData.get("certification"),
    durationLabel: formData.get("durationLabel"),
    supportLabel: formData.get("supportLabel"),
    coverImage: formData.get("coverImage"),
    fullPriceCents: formData.get("fullPriceCents"),
    salePriceCents: formData.get("salePriceCents") || undefined,
    mode: formData.get("mode"),
    level: formData.get("level"),
    categoryId: formData.get("categoryId") || undefined,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    badges: formData.get("badges"),
    benefits: formData.get("benefits"),
    careerOutcomes: formData.get("careerOutcomes"),
    seoMetaTitle: formData.get("seoMetaTitle"),
    seoMetaDescription: formData.get("seoMetaDescription"),
    seoCanonicalUrl: formData.get("seoCanonicalUrl"),
    seoOgImage: formData.get("seoOgImage"),
    seoNoindex: formData.get("seoNoindex") === "on"
  });

  if (!parsed.success) throw new Error("Campi corso non validi.");

  const payload = parsed.data;
  const benefits = (payload.benefits || "").split("\n").map((item) => item.trim()).filter(Boolean);
  const badges = (payload.badges || "").split(",").map((item) => item.trim()).filter(Boolean);
  const careerOutcomes = (payload.careerOutcomes || "").split("\n").map((item) => item.trim()).filter(Boolean);
  const hasCourseSeo =
    Boolean(payload.seoMetaTitle?.trim()) ||
    Boolean(payload.seoMetaDescription?.trim()) ||
    Boolean(payload.seoCanonicalUrl?.trim()) ||
    Boolean(payload.seoOgImage?.trim()) ||
    Boolean(payload.seoNoindex);

  const updateData: Prisma.CourseUncheckedUpdateInput = {
    title: payload.title,
    subtitle: payload.subtitle,
    shortDescription: payload.shortDescription,
    longDescription: payload.longDescription,
    outcome: payload.outcome,
    audience: payload.audience,
    certification: payload.certification,
    durationLabel: payload.durationLabel,
    supportLabel: payload.supportLabel || null,
    coverImage: payload.coverImage || null,
    fullPriceCents: payload.fullPriceCents,
    salePriceCents: payload.salePriceCents || null,
    mode: payload.mode,
    level: payload.level,
    categoryId: payload.categoryId || null,
    published: payload.published ?? false,
    featured: payload.featured ?? false,
    benefits,
    badges,
    careerOutcomes,
    gallery: []
  };

  let courseId = payload.id;
  if (payload.id) {
    await prisma.course.update({
      where: { id: payload.id },
      data: updateData
    });
    courseId = payload.id;
  } else {
    const createData: Prisma.CourseUncheckedCreateInput = {
      title: payload.title,
      slug: slugify(payload.title),
      subtitle: payload.subtitle,
      shortDescription: payload.shortDescription,
      longDescription: payload.longDescription,
      outcome: payload.outcome,
      audience: payload.audience,
      certification: payload.certification,
      durationLabel: payload.durationLabel,
      supportLabel: payload.supportLabel || null,
      coverImage: payload.coverImage || null,
      fullPriceCents: payload.fullPriceCents,
      salePriceCents: payload.salePriceCents || null,
      mode: payload.mode,
      level: payload.level,
      categoryId: payload.categoryId || null,
      published: payload.published ?? false,
      featured: payload.featured ?? false,
      benefits,
      badges,
      careerOutcomes,
      gallery: []
    };

    const created = await prisma.course.create({
      data: createData
    });
    courseId = created.id;
  }

  if (courseId) {
    if (hasCourseSeo) {
      await prisma.seoData.upsert({
        where: { courseId },
        update: {
          entityType: "COURSE",
          metaTitle: payload.seoMetaTitle?.trim() || payload.title,
          metaDescription: payload.seoMetaDescription?.trim() || payload.shortDescription,
          canonicalUrl: payload.seoCanonicalUrl?.trim() || null,
          ogImage: payload.seoOgImage?.trim() || payload.coverImage || null,
          noindex: payload.seoNoindex ?? false
        },
        create: {
          entityType: "COURSE",
          courseId,
          metaTitle: payload.seoMetaTitle?.trim() || payload.title,
          metaDescription: payload.seoMetaDescription?.trim() || payload.shortDescription,
          canonicalUrl: payload.seoCanonicalUrl?.trim() || null,
          ogImage: payload.seoOgImage?.trim() || payload.coverImage || null,
          noindex: payload.seoNoindex ?? false
        }
      });
    } else {
      await prisma.seoData.deleteMany({ where: { courseId } });
    }
  }

  revalidatePath("/admin/corsi");
  revalidatePath("/corsi");
  redirect(`/admin/corsi/${courseId}`);
}

export async function saveTeacherAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const role = String(formData.get("role") || "");
  const bio = String(formData.get("bio") || "");

  const data = {
    slug: slugify(name),
    name,
    role,
    bio,
    shortBio: String(formData.get("shortBio") || "") || null,
    image: String(formData.get("image") || "") || null,
    featured: formData.get("featured") === "on",
    credentials: String(formData.get("credentials") || "")
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean),
    expertise: String(formData.get("expertise") || "")
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean)
  };

  if (id) {
    await prisma.teacher.update({ where: { id }, data });
  } else {
    await prisma.teacher.create({ data });
  }

  revalidatePath("/admin/docenti");
  revalidatePath("/docenti");
}

export async function saveReviewAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = {
    courseId: String(formData.get("courseId") || "") || null,
    authorName: String(formData.get("authorName") || ""),
    authorRole: String(formData.get("authorRole") || "") || null,
    rating: Number(formData.get("rating") || 5),
    title: String(formData.get("title") || "") || null,
    body: String(formData.get("body") || ""),
    featured: formData.get("featured") === "on",
    published: formData.get("published") !== "off"
  };

  if (id) {
    await prisma.review.update({ where: { id }, data });
  } else {
    await prisma.review.create({ data });
  }

  revalidatePath("/admin/recensioni");
  revalidatePath("/recensioni");
}

export async function saveFaqAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = {
    courseId: String(formData.get("courseId") || "") || null,
    pageKey: String(formData.get("pageKey") || "") || null,
    question: String(formData.get("question") || ""),
    answer: String(formData.get("answer") || ""),
    published: formData.get("published") !== "off"
  };

  if (id) {
    await prisma.fAQ.update({ where: { id }, data });
  } else {
    await prisma.fAQ.create({ data });
  }

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");

  const data = {
    name,
    slug: slugify(name),
    description: String(formData.get("description") || "") || null
  };

  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }

  revalidatePath("/admin/categorie");
}

export async function saveBlogCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");

  const data = {
    name,
    slug: slugify(name),
    description: String(formData.get("description") || "") || null
  };

  if (id) {
    await prisma.blogCategory.update({ where: { id }, data });
  } else {
    await prisma.blogCategory.create({ data });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function saveBlogPostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");
  const excerpt = String(formData.get("excerpt") || "");
  const coverImage = String(formData.get("coverImage") || "") || null;
  const categoryId = String(formData.get("categoryId") || "") || null;
  const authorName = String(formData.get("authorName") || "Redazione Professione Fitness");
  const authorRole = String(formData.get("authorRole") || "Redazione") || null;
  const content = String(formData.get("content") || "");
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const readingTime = Number(formData.get("readingTime") || 6);
  const publishedAt = published ? new Date() : null;
  const seoMetaTitle = String(formData.get("seoMetaTitle") || "").trim();
  const seoMetaDescription = String(formData.get("seoMetaDescription") || "").trim();
  const seoCanonicalUrl = String(formData.get("seoCanonicalUrl") || "").trim() || null;
  const seoOgImage = String(formData.get("seoOgImage") || "").trim() || null;
  const seoNoindex = formData.get("seoNoindex") === "on";

  const updateData: Prisma.BlogPostUncheckedUpdateInput = {
    title,
    excerpt,
    coverImage,
    categoryId,
    authorName,
    authorRole,
    content,
    published,
    featured,
    readingTime,
    publishedAt
  };

  let postId = id;

  if (id) {
    await prisma.blogPost.update({ where: { id }, data: updateData });
  } else {
    const createData: Prisma.BlogPostUncheckedCreateInput = {
      slug: slugify(title),
      title,
      excerpt,
      coverImage,
      categoryId,
      authorName,
      authorRole,
      content,
      published,
      featured,
      readingTime,
      publishedAt
    };
    const created = await prisma.blogPost.create({ data: createData });
    postId = created.id;
  }

  if (postId) {
    const hasBlogSeo = Boolean(seoMetaTitle || seoMetaDescription || seoCanonicalUrl || seoOgImage || seoNoindex);

    if (hasBlogSeo) {
      await prisma.seoData.upsert({
        where: { blogPostId: postId },
        update: {
          entityType: "BLOG_POST",
          metaTitle: seoMetaTitle || title,
          metaDescription: seoMetaDescription || excerpt,
          canonicalUrl: seoCanonicalUrl,
          ogImage: seoOgImage || coverImage,
          noindex: seoNoindex
        },
        create: {
          entityType: "BLOG_POST",
          blogPostId: postId,
          metaTitle: seoMetaTitle || title,
          metaDescription: seoMetaDescription || excerpt,
          canonicalUrl: seoCanonicalUrl,
          ogImage: seoOgImage || coverImage,
          noindex: seoNoindex
        }
      });
    } else {
      await prisma.seoData.deleteMany({ where: { blogPostId: postId } });
    }
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${postId}`);
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: "site" },
    update: {
      siteName: String(formData.get("siteName") || ""),
      siteTagline: String(formData.get("siteTagline") || ""),
      supportEmail: String(formData.get("supportEmail") || ""),
      supportPhone: String(formData.get("supportPhone") || "") || null,
      headOffice: String(formData.get("headOffice") || "") || null,
      heroTitle: String(formData.get("heroTitle") || ""),
      heroSubtitle: String(formData.get("heroSubtitle") || ""),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") || ""),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") || ""),
      heroSecondaryCtaLabel: String(formData.get("heroSecondaryCtaLabel") || ""),
      heroSecondaryCtaHref: String(formData.get("heroSecondaryCtaHref") || ""),
      trustLine: String(formData.get("trustLine") || "") || null
    },
    create: {
      id: "site",
      siteName: String(formData.get("siteName") || ""),
      siteTagline: String(formData.get("siteTagline") || ""),
      supportEmail: String(formData.get("supportEmail") || ""),
      supportPhone: String(formData.get("supportPhone") || "") || null,
      headOffice: String(formData.get("headOffice") || "") || null,
      heroTitle: String(formData.get("heroTitle") || ""),
      heroSubtitle: String(formData.get("heroSubtitle") || ""),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") || ""),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") || ""),
      heroSecondaryCtaLabel: String(formData.get("heroSecondaryCtaLabel") || ""),
      heroSecondaryCtaHref: String(formData.get("heroSecondaryCtaHref") || ""),
      trustLine: String(formData.get("trustLine") || "") || null
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/impostazioni");
}

export async function saveModuleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const courseId = String(formData.get("courseId") || "");
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "") || null;

  if (id) {
    await prisma.courseModule.update({
      where: { id },
      data: { title, description }
    });
  } else {
    const count = await prisma.courseModule.count({ where: { courseId } });
    await prisma.courseModule.create({
      data: { courseId, title, description, sortOrder: count + 1 }
    });
  }

  revalidatePath(`/admin/corsi/${courseId}/programma`);
}

async function buildUniqueLessonSlug(moduleId: string, title: string, excludeLessonId?: string) {
  const baseSlug = slugify(title) || "lezione";
  const existingLessons = await prisma.lesson.findMany({
    where: {
      moduleId,
      ...(excludeLessonId ? { id: { not: excludeLessonId } } : {})
    },
    select: { slug: true }
  });

  const usedSlugs = new Set(existingLessons.map((lesson) => lesson.slug).filter(Boolean));
  if (!usedSlugs.has(baseSlug)) return baseSlug;

  let suffix = 2;
  let candidate = `${baseSlug}-${suffix}`;

  while (usedSlugs.has(candidate)) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}

export async function saveLessonAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const moduleId = String(formData.get("moduleId") || "");
  const title = String(formData.get("title") || "");
  const slides = parseSlidesFromFormValue(formData.get("slidesJson"));
  const uniqueSlug = await buildUniqueLessonSlug(moduleId, title, id || undefined);

  const data = {
    title,
    summary: String(formData.get("summary") || "") || null,
    content: String(formData.get("content") || ""),
    slides,
    durationLabel: String(formData.get("durationLabel") || "") || null,
    lessonType: String(formData.get("lessonType") || "VIDEO") as LessonType,
    videoUrl: String(formData.get("videoUrl") || "") || null,
    downloadUrl: String(formData.get("downloadUrl") || "") || null,
    previewable: formData.get("previewable") === "on"
  };

  if (id) {
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      select: { slug: true }
    });

    await prisma.lesson.update({
      where: { id },
      data: {
        ...data,
        slug: existingLesson?.slug?.trim() ? undefined : uniqueSlug
      }
    });
  } else {
    const count = await prisma.lesson.count({ where: { moduleId } });
    await prisma.lesson.create({
      data: {
        moduleId,
        sortOrder: count + 1,
        title,
        slug: uniqueSlug,
        summary: data.summary,
        content: data.content,
        slides: data.slides,
        durationLabel: data.durationLabel,
        lessonType: data.lessonType,
        videoUrl: data.videoUrl,
        downloadUrl: data.downloadUrl,
        previewable: data.previewable
      }
    });
  }

  const courseModule = await prisma.courseModule.findUnique({ where: { id: moduleId } });
  if (courseModule) revalidatePath(`/admin/corsi/${courseModule.courseId}/programma`);
}

export async function moveModuleAction(formData: FormData) {
  await requireAdmin();
  const moduleId = String(formData.get("moduleId") || "");
  const direction = String(formData.get("direction") || "up");

  const currentModule = await prisma.courseModule.findUnique({
    where: { id: moduleId },
    select: {
      id: true,
      courseId: true,
      sortOrder: true
    }
  });

  if (!currentModule) return;

  const adjacentModule = await prisma.courseModule.findFirst({
    where: {
      courseId: currentModule.courseId,
      sortOrder: direction === "up" ? { lt: currentModule.sortOrder } : { gt: currentModule.sortOrder }
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
    select: {
      id: true,
      sortOrder: true
    }
  });

  if (!adjacentModule) return;

  await prisma.$transaction([
    prisma.courseModule.update({
      where: { id: currentModule.id },
      data: { sortOrder: adjacentModule.sortOrder }
    }),
    prisma.courseModule.update({
      where: { id: adjacentModule.id },
      data: { sortOrder: currentModule.sortOrder }
    })
  ]);

  revalidatePath(`/admin/corsi/${currentModule.courseId}/programma`);
}

export async function moveLessonAction(formData: FormData) {
  await requireAdmin();
  const lessonId = String(formData.get("lessonId") || "");
  const direction = String(formData.get("direction") || "up");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      moduleId: true,
      sortOrder: true,
      module: {
        select: {
          courseId: true
        }
      }
    }
  });

  if (!lesson) return;

  const adjacentLesson = await prisma.lesson.findFirst({
    where: {
      moduleId: lesson.moduleId,
      sortOrder: direction === "up" ? { lt: lesson.sortOrder } : { gt: lesson.sortOrder }
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
    select: {
      id: true,
      sortOrder: true
    }
  });

  if (!adjacentLesson) return;

  await prisma.$transaction([
    prisma.lesson.update({
      where: { id: lesson.id },
      data: { sortOrder: adjacentLesson.sortOrder }
    }),
    prisma.lesson.update({
      where: { id: adjacentLesson.id },
      data: { sortOrder: lesson.sortOrder }
    })
  ]);

  revalidatePath(`/admin/corsi/${lesson.module.courseId}/programma`);
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  const courseId = String(formData.get("id") || "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), "/admin/corsi");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          enrollments: true,
          orders: true
        }
      }
    }
  });

  if (!course) {
    redirect(withMessage(redirectTo, "error", "Corso non trovato."));
  }

  if (course._count.enrollments > 0 || course._count.orders > 0) {
    redirect(withMessage(redirectTo, "error", "Non puoi eliminare un corso con ordini o iscrizioni."));
  }

  await prisma.course.delete({
    where: { id: course.id }
  });

  revalidatePath("/admin/corsi");
  revalidatePath("/corsi");
  redirect(withMessage(redirectTo, "success", "Corso eliminato."));
}

export async function archiveCourseAction(formData: FormData) {
  await requireAdmin();
  const courseId = String(formData.get("id") || "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), "/admin/corsi");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      published: true,
      _count: {
        select: {
          enrollments: true,
          orders: true
        }
      }
    }
  });

  if (!course) {
    redirect(withMessage(redirectTo, "error", "Corso non trovato."));
  }

  if (course._count.enrollments === 0 && course._count.orders === 0) {
    redirect(withMessage(redirectTo, "error", "Archiviazione disponibile solo per corsi con dati reali."));
  }

  const nextPublished = !course.published;

  await prisma.course.update({
    where: { id: course.id },
    data: {
      published: nextPublished,
      featured: nextPublished ? undefined : false
    }
  });

  revalidatePath("/admin/corsi");
  revalidatePath(`/admin/corsi/${course.id}`);
  revalidatePath("/corsi");
  redirect(withMessage(redirectTo, "success", nextPublished ? "Corso riattivato." : "Corso archiviato."));
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), "/admin/categorie");

  await prisma.category.delete({
    where: { id }
  });

  revalidatePath("/admin/categorie");
  revalidatePath("/corsi");
  redirect(withMessage(redirectTo, "success", "Categoria eliminata."));
}

export async function deleteBlogCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), "/admin/blog");

  await prisma.blogCategory.delete({
    where: { id }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(withMessage(redirectTo, "success", "Categoria blog eliminata."));
}

export async function deleteTeacherAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), "/admin/docenti");

  await prisma.teacher.delete({
    where: { id }
  });

  revalidatePath("/admin/docenti");
  revalidatePath("/docenti");
  revalidatePath("/corsi");
  redirect(withMessage(redirectTo, "success", "Docente eliminato."));
}

export async function deleteReviewAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), "/admin/recensioni");

  await prisma.review.delete({
    where: { id }
  });

  revalidatePath("/admin/recensioni");
  revalidatePath("/recensioni");
  revalidatePath("/corsi");
  revalidatePath("/");
  redirect(withMessage(redirectTo, "success", "Recensione eliminata."));
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), "/admin/faq");

  await prisma.fAQ.delete({
    where: { id }
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  revalidatePath("/corsi");
  revalidatePath("/");
  redirect(withMessage(redirectTo, "success", "FAQ eliminata."));
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), "/admin/blog");

  await prisma.blogPost.delete({
    where: { id }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(withMessage(redirectTo, "success", "Articolo eliminato."));
}

export async function deleteModuleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");

  const courseModule = await prisma.courseModule.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      courseId: true,
      course: {
        select: {
          slug: true
        }
      }
    }
  });

  if (!courseModule) {
    redirect("/admin/corsi");
  }

  await prisma.$transaction(async (tx) => {
    await tx.courseModule.delete({
      where: { id: courseModule.id }
    });

    await normalizeModuleSortOrder(courseModule.courseId, tx);
  });

  await recalculateEnrollmentProgressForCourse(courseModule.courseId);
  revalidatePath(`/admin/corsi/${courseModule.courseId}/programma`);
  revalidatePath(`/corsi/${courseModule.course.slug}`);
  revalidatePath("/dashboard/corsi");
  revalidatePath(`/dashboard/corsi/${courseModule.course.slug}`);
  redirect(
    withMessage(
      `/admin/corsi/${courseModule.courseId}/programma?panel=new-module`,
      "success",
      "Modulo eliminato."
    )
  );
}

export async function deleteLessonAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      moduleId: true,
      title: true,
      module: {
        select: {
          courseId: true,
          course: {
            select: {
              slug: true
            }
          }
        }
      }
    }
  });

  if (!lesson) {
    redirect("/admin/corsi");
  }

  await prisma.$transaction(async (tx) => {
    await tx.lesson.delete({
      where: { id: lesson.id }
    });

    await normalizeLessonSortOrder(lesson.moduleId, tx);
  });

  await recalculateEnrollmentProgressForCourse(lesson.module.courseId);
  revalidatePath(`/admin/corsi/${lesson.module.courseId}/programma`);
  revalidatePath(`/corsi/${lesson.module.course.slug}`);
  revalidatePath("/dashboard/corsi");
  revalidatePath(`/dashboard/corsi/${lesson.module.course.slug}`);
  redirect(
    withMessage(
      `/admin/corsi/${lesson.module.courseId}/programma?panel=module&module=${lesson.moduleId}`,
      "success",
      "Lezione eliminata."
    )
  );
}

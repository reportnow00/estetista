import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const DB_FALLBACK_TIMEOUT_MS = 2500;
const DB_CIRCUIT_OPEN_MS = 30000;

let dbCircuitOpenUntil = 0;

function shouldShortCircuitDb() {
  return Date.now() < dbCircuitOpenUntil;
}

function openDbCircuit(label: string, reason: "timeout" | "failure") {
  dbCircuitOpenUntil = Date.now() + DB_CIRCUIT_OPEN_MS;
  console.warn(`[data] ${label} opened DB circuit for ${DB_CIRCUIT_OPEN_MS}ms after ${reason}`);
}

export async function resolveDbWithFallback<T>(factory: () => Promise<T>, fallback: T, label: string) {
  if (shouldShortCircuitDb()) {
    console.warn(`[data] ${label} skipped because DB circuit is open, using fallback`);
    return fallback;
  }

  const guardedPromise = factory().catch((error) => {
    openDbCircuit(label, "failure");
    console.error(`[data] ${label} failed, using fallback`, error);
    return fallback;
  });

  const timeoutPromise = new Promise<T>((resolve) => {
    setTimeout(() => {
      openDbCircuit(label, "timeout");
      console.warn(`[data] ${label} timed out after ${DB_FALLBACK_TIMEOUT_MS}ms, using fallback`);
      resolve(fallback);
    }, DB_FALLBACK_TIMEOUT_MS);
  });

  return Promise.race([guardedPromise, timeoutPromise]);
}

const getHomeDataCached = unstable_cache(
  async () =>
    Promise.all([
        prisma.siteSettings.findUnique({ where: { id: "site" } }),
        prisma.course.findFirst({
          where: { featured: true, published: true },
          include: {
            teachers: {
              include: { teacher: true },
              orderBy: { sortOrder: "asc" }
            },
            reviews: {
              where: { featured: true, published: true },
              orderBy: { sortOrder: "asc" },
              take: 3
            },
            faqs: {
              where: { published: true },
              orderBy: { sortOrder: "asc" },
              take: 4
            }
          }
        }),
        prisma.teacher.findMany({
          where: { featured: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          take: 4
        }),
        prisma.review.findMany({
          where: { featured: true, published: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          take: 4
        }),
        prisma.fAQ.findMany({
          where: { pageKey: "home", published: true },
          orderBy: { sortOrder: "asc" },
          take: 4
        }),
        prisma.blogPost.findMany({
          where: { published: true },
          include: { category: true },
          orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
          take: 3
        })
      ]).then(([siteSettings, featuredCourse, featuredTeachers, featuredReviews, faqs, posts]) => ({
      siteSettings,
      featuredCourse,
      featuredTeachers,
      featuredReviews,
      faqs,
      posts
    })),
  ["home-data"],
  { revalidate: 300 }
);

const getPublishedCoursesCached = unstable_cache(
  async () =>
    prisma.course.findMany({
      where: { published: true },
      include: {
        category: true,
        teachers: { include: { teacher: true }, orderBy: { sortOrder: "asc" } }
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    }),
  ["published-courses"],
  { revalidate: 300 }
);

const getBlogPostsCached = unstable_cache(
  async () =>
    prisma.blogPost.findMany({
      where: { published: true },
      include: { category: true, seo: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }]
    }),
  ["blog-posts"],
  { revalidate: 300 }
);

const getStaticFaqsCached = unstable_cache(
  async (pageKey: string) =>
    prisma.fAQ.findMany({
      where: { pageKey, published: true },
      orderBy: { sortOrder: "asc" }
    }),
  ["static-faqs"],
  { revalidate: 300 }
);

export async function getHomeData() {
  return resolveDbWithFallback(
    () => getHomeDataCached(),
    {
      siteSettings: null,
      featuredCourse: null,
      featuredTeachers: [],
      featuredReviews: [],
      faqs: [],
      posts: []
    },
    "getHomeData"
  );
}

export async function getPublishedCourses() {
  return resolveDbWithFallback(() => getPublishedCoursesCached(), [], "getPublishedCourses");
}

export async function getPublishedCourseSlugs() {
  return resolveDbWithFallback(
    () =>
      prisma.course.findMany({
        where: { published: true },
        select: { slug: true },
        orderBy: { createdAt: "desc" }
      }),
    [],
    "getPublishedCourseSlugs"
  );
}

export async function getCourseBySlug(slug: string) {
  return resolveDbWithFallback(
    () =>
      prisma.course.findUnique({
        where: { slug },
        include: {
          category: true,
          modules: {
            include: {
              lessons: {
                orderBy: { sortOrder: "asc" }
              }
            },
            orderBy: { sortOrder: "asc" }
          },
          teachers: {
            include: { teacher: true },
            orderBy: { sortOrder: "asc" }
          },
          faqs: {
            where: { published: true },
            orderBy: { sortOrder: "asc" }
          },
          reviews: {
            where: { published: true },
            orderBy: [{ featured: "desc" }, { sortOrder: "asc" }]
          },
          seo: true
        }
      }),
    null,
    `getCourseBySlug:${slug}`
  );
}

export async function getBlogPosts() {
  return resolveDbWithFallback(() => getBlogPostsCached(), [], "getBlogPosts");
}

export async function getPublishedBlogSlugs() {
  return resolveDbWithFallback(
    () =>
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true },
        orderBy: { publishedAt: "desc" }
      }),
    [],
    "getPublishedBlogSlugs"
  );
}

export async function getBlogPostBySlug(slug: string) {
  return resolveDbWithFallback(
    () =>
      prisma.blogPost.findUnique({
        where: { slug },
        include: { category: true, seo: true }
      }),
    null,
    `getBlogPostBySlug:${slug}`
  );
}

export async function getStaticFaqs(pageKey: string) {
  return resolveDbWithFallback(() => getStaticFaqsCached(pageKey), [], `getStaticFaqs:${pageKey}`);
}

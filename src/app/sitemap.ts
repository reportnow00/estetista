import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/corsi",
    "/diventare-personal-trainer",
    "/quanto-guadagna-un-personal-trainer",
    "/personal-trainer-cosa-studiare",
    "/come-trovare-clienti-personal-trainer",
    "/corso-personal-trainer-riconosciuto-coni",
    "/certificazioni-validita-professionale",
    "/docenti",
    "/recensioni",
    "/faq",
    "/blog",
    "/chi-siamo",
    "/contatti"
  ];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    const changeFrequency: "weekly" | "monthly" = route === "" ? "weekly" : "monthly";

    return {
      url: absoluteUrl(route),
      lastModified: new Date(),
      changeFrequency,
      priority: route === "" ? 1 : route === "/corsi" || route === "/blog" ? 0.9 : 0.8
    };
  });

  try {
    const [courses, posts] = await Promise.all([
      prisma.course.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
    ]);

    return [
      ...staticEntries,
      ...courses.map((course) => ({
        url: absoluteUrl(`/corsi/${course.slug}`),
        lastModified: course.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.9
      })),
      ...posts.map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8
      }))
    ];
  } catch (error) {
    console.error("[sitemap] Falling back to static routes only", error);
    return staticEntries;
  }

}

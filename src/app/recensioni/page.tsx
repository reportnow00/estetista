import { resolveDbWithFallback } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { ReviewsSection } from "@/components/home/reviews-section";

export const metadata = buildMetadata({
  title: "Recensioni | Professione Fitness Academy",
  description:
    "Recensioni e testimonianze collegate al corso e all'academy, presentate con un taglio sobrio e professionale."
});

export default async function ReviewsPage() {
  const reviews = await resolveDbWithFallback(
    () =>
      prisma.review.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }]
      }),
    [],
    "getReviewsPageData"
  );

  return (
    <>
      <PageHero
        badge="Dicono di noi"
        title="Recensioni organizzate come contenuto di fiducia, non come rumore."
        description="Le testimonianze rafforzano la credibilità del percorso principale e possono essere filtrate, riordinate e pubblicate dal pannello admin."
      />
      <ReviewsSection reviews={reviews} />
    </>
  );
}

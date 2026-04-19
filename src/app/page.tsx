import { getHomeData } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCourseSection } from "@/components/home/featured-course-section";
import { WhyUsSection } from "@/components/home/why-us-section";
import { TeachersSection } from "@/components/home/teachers-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { BlogSection } from "@/components/home/blog-section";
import { FaqPreviewSection } from "@/components/home/faq-preview-section";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = buildMetadata({
  title: "Professione Fitness Academy | Diventa Personal Trainer",
  description:
    "Diventa Personal Trainer con un corso professionale pensato per chi vuole lavorare nel fitness con metodo, competenze pratiche e un percorso chiaro."
});

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <HeroSection settings={data.siteSettings} course={data.featuredCourse} />
      <FeaturedCourseSection course={data.featuredCourse} />
      <WhyUsSection />
      {data.featuredTeachers.length > 0 ? <TeachersSection teachers={data.featuredTeachers} /> : null}
      {data.featuredReviews.length > 0 ? <ReviewsSection reviews={data.featuredReviews} /> : null}
      {data.posts.length > 0 ? <BlogSection posts={data.posts} /> : null}
      {data.faqs.length > 0 ? <FaqPreviewSection faqs={data.faqs} /> : null}
      <FinalCta />
    </>
  );
}

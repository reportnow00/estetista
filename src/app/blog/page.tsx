import Image from "next/image";
import Link from "next/link";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getBlogPosts } from "@/lib/data";
import { editorialGuides } from "@/lib/editorial-guides";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";

export const metadata = buildMetadata({
  title: "Blog Personal Trainer e Fitness | Professione Fitness Academy",
  description:
    "Leggi guide e articoli su personal trainer, formazione fitness, certificazioni, clienti e carriera nel settore.",
  path: "/blog",
  keywords: [
    "blog personal trainer",
    "formazione fitness",
    "certificazione personal trainer",
    "guadagno personal trainer",
    "clienti personal trainer"
  ]
});

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Blog", item: "/blog" }
        ])}
      />
      <PageHero
        badge="Blog / Magazine"
        title="Guide e articoli per orientarti nel mondo del fitness."
        description="Leggi contenuti chiari e pratici su formazione, carriera, certificazioni e lavoro come Personal Trainer."
      />
      <Container className="py-16">
        <div className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Guide strategiche</div>
        <div className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {editorialGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.24)]"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{guide.badge}</div>
              <h2 className="mt-3 font-display text-2xl font-bold text-slate-900">{guide.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{guide.description}</p>
            </Link>
          ))}
        </div>

        <div className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Articoli del blog</div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_40px_-34px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.26)]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={post.coverImage || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {post.category?.name || "Magazine"}
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold text-slate-900">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}

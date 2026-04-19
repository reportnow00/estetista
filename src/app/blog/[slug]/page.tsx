import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/data";
import { getRelatedGuides } from "@/lib/editorial-guides";
import { articleJsonLd, buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { extractHeadings, parseMarkdownLite } from "@/lib/markdown";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getPublishedBlogSlugs } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

async function loadBlogPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, seo: true }
  });
}

export async function generateStaticParams() {
  const entries = await getPublishedBlogSlugs();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await loadBlogPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.seo?.metaTitle || `${post.title} | Professione Fitness Academy`,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.seo?.ogImage || post.coverImage || undefined,
    type: "article",
    canonicalUrl: post.seo?.canonicalUrl || undefined,
    noindex: post.seo?.noindex || false,
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt,
    section: post.category?.name || "Blog",
    authors: [post.authorName],
    keywords: [
      post.category?.name || "blog fitness",
      "personal trainer",
      "formazione fitness",
      "carriera fitness"
    ]
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([loadBlogPost(slug), getBlogPosts()]);
  if (!post || !post.published) notFound();

  const headings = extractHeadings(post.content);
  const blocks = parseMarkdownLite(post.content);
  const relatedPosts = allPosts.filter((entry) => entry.slug !== post.slug).slice(0, 3);
  const relatedGuides = getRelatedGuides(`/blog/${post.slug}`, 3);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          path: `/blog/${post.slug}`,
          image: post.coverImage || undefined,
          publishedAt: post.publishedAt || post.createdAt,
          updatedAt: post.updatedAt,
          authorName: post.authorName,
          section: post.category?.name || "Blog"
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", item: "/" },
          { name: "Blog", item: "/blog" },
          { name: post.title, item: `/blog/${post.slug}` }
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title }
        ]}
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_300px]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.18)]">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            {post.category?.name || "Magazine"}
          </div>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-900">
            {post.title}
          </h1>
          <div className="mt-4 text-sm text-slate-500">
            {post.authorName} - {post.authorRole || "Redazione"} - {post.publishedAt ? formatDate(post.publishedAt) : ""}
          </div>
          <p className="mt-6 text-lg leading-8 text-slate-600">{post.excerpt}</p>
          <div className="prose-lite mt-10">
            {blocks.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h2 key={`${block.id}-${index}`} id={block.id} className="scroll-mt-32 text-2xl font-bold text-slate-900">
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={`list-${index}`} className="list-disc space-y-2 pl-5 text-slate-700">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={`paragraph-${index}`} className="leading-8 text-slate-700">
                  {block.lines.map((line, lineIndex) => (
                    <span key={`${line}-${lineIndex}`}>
                      {line}
                      {lineIndex < block.lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>
          <div className="mt-10 rounded-[1.5rem] bg-slate-50 p-6">
            <h2 className="font-display text-2xl font-bold text-slate-900">Vuoi passare dalla teoria alla pratica?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Se vuoi trasformare quello che stai leggendo in competenze concrete, puoi approfondire il percorso completo dedicato a chi vuole lavorare come Personal Trainer.
            </p>
            <ButtonLink href="/corsi/diventa-un-personal-trainer" className="mt-5">
              Scopri il corso
            </ButtonLink>
          </div>

          {relatedPosts.length > 0 ? (
            <div className="mt-10 border-t border-slate-200 pt-8">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Articoli correlati</div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                      {relatedPost.category?.name || "Magazine"}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{relatedPost.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{relatedPost.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {relatedGuides.length > 0 ? (
            <div className="mt-10 border-t border-slate-200 pt-8">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Guide strategiche</div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">{guide.badge}</div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{guide.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-28">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Indice articolo</div>
          <ul className="mt-4 space-y-3 text-sm">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`} className="text-slate-700 hover:text-brand-800">
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </Container>
    </>
  );
}

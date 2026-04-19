import Image from "next/image";
import Link from "next/link";
import type { BlogCategory, BlogPost } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { editorialGuides } from "@/lib/editorial-guides";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function BlogSection({
  posts
}: {
  posts: (BlogPost & { category: BlogCategory | null })[];
}) {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading
            badge="Blog / Magazine"
            title="Approfondimenti utili per chi vuole lavorare nel fitness."
            description="Articoli pensati per orientarti tra formazione, ruolo del personal trainer, competenze e opportunità professionali."
          />
          <Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-brand-800">
            Vai al blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_-42px_rgba(15,23,42,0.28)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.coverImage || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop"}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/12 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {post.category?.name || "Magazine"}
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-slate-900">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200/80 bg-slate-50 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Guide SEO strategiche</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {editorialGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">{guide.badge}</div>
                <div className="mt-2 font-semibold text-slate-900">{guide.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

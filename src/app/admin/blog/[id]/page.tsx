import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { saveBlogPostAction } from "@/actions/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSubmit } from "@/components/ui/form-submit";

type Props = { params?: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  await requireAdmin();
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  const post = params
    ? await prisma.blogPost.findUnique({ where: { id: (await params).id }, include: { seo: true } })
    : null;

  return (
    <>
      <PageHero
        badge="Admin · Articolo"
        title={post ? "Modifica articolo" : "Nuovo articolo"}
        description="Crea pagine editoriali SEO con URL puliti, contenuti strutturati e CTA verso il corso principale."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/blog" />
        <form action={saveBlogPostAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
          {post ? <input type="hidden" name="id" value={post.id} /> : null}
          <label className="text-sm font-medium text-slate-700">Titolo</label>
          <Input name="title" className="mt-2" defaultValue={post?.title || ""} />
          <label className="mt-4 block text-sm font-medium text-slate-700">Excerpt</label>
          <Textarea name="excerpt" className="mt-2" defaultValue={post?.excerpt || ""} />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Categoria</label>
              <select name="categoryId" defaultValue={post?.categoryId || ""} className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4">
                <option value="">Senza categoria</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Cover image URL</label>
              <Input name="coverImage" className="mt-2" defaultValue={post?.coverImage || ""} />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Input name="authorName" defaultValue={post?.authorName || "Redazione Professione Fitness"} />
            <Input name="authorRole" defaultValue={post?.authorRole || "Redazione"} />
            <Input name="readingTime" type="number" defaultValue={post?.readingTime || 6} />
          </div>
          <label className="mt-4 block text-sm font-medium text-slate-700">Contenuto (markdown-lite con titoli ##)</label>
          <Textarea name="content" className="mt-2 min-h-[320px]" defaultValue={post?.content || ""} />
          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">SEO articolo</div>
            <div className="mt-4 grid gap-4">
              <Input name="seoMetaTitle" defaultValue={post?.seo?.metaTitle || ""} placeholder="Meta title SEO" />
              <Textarea
                name="seoMetaDescription"
                className="min-h-[120px]"
                defaultValue={post?.seo?.metaDescription || ""}
                placeholder="Meta description SEO"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="seoCanonicalUrl" defaultValue={post?.seo?.canonicalUrl || ""} placeholder="Canonical URL" />
                <Input name="seoOgImage" defaultValue={post?.seo?.ogImage || ""} placeholder="OG image URL" />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input name="seoNoindex" type="checkbox" defaultChecked={post?.seo?.noindex} />
                Noindex
              </label>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm"><input name="published" type="checkbox" defaultChecked={post?.published} /> Pubblicato</label>
            <label className="inline-flex items-center gap-2 text-sm"><input name="featured" type="checkbox" defaultChecked={post?.featured} /> In evidenza</label>
          </div>
          <FormSubmit className="mt-6">{post ? "Salva articolo" : "Crea articolo"}</FormSubmit>
        </form>
      </Container>
    </>
  );
}

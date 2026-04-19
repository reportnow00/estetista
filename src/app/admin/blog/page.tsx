import Link from "next/link";
import {
  deleteBlogCategoryAction,
  deleteBlogPostAction,
  saveBlogCategoryAction
} from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ActionNotice } from "@/components/ui/action-notice";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DangerSubmit } from "@/components/ui/danger-submit";
import { FormSubmit } from "@/components/ui/form-submit";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/ui/page-hero";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminBlogPage({
  searchParams
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.blogCategory.findMany({
      include: {
        posts: {
          select: { id: true }
        }
      },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <>
      <PageHero
        badge="Admin · Blog"
        title="Gestione articoli"
        description="L'area blog è la leva SEO della piattaforma. Da qui puoi gestire articoli e categorie editoriali."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/blog" />
        <div className="space-y-8">
          <ActionNotice error={params.error} success={params.success} />

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
            <div>
              <div className="mb-6 flex justify-end">
                <ButtonLink href="/admin/blog/nuovo">Nuovo articolo</ButtonLink>
              </div>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-[2rem] border border-slate-200 bg-white p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-brand-700">
                          {post.category?.name || "Magazine"}
                        </div>
                        <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">{post.title}</h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <Link href={`/admin/blog/${post.id}`} className="text-brand-800">
                          Modifica
                        </Link>
                        <form action={deleteBlogPostAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <input type="hidden" name="redirectTo" value="/admin/blog" />
                          <DangerSubmit confirmMessage={`Confermi l'eliminazione dell'articolo "${post.title}"?`} />
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <form action={saveBlogCategoryAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
                <h2 className="font-display text-2xl font-bold text-slate-900">Nuova categoria blog</h2>
                <Input name="name" className="mt-4" placeholder="Nome categoria blog" />
                <Textarea name="description" className="mt-4" placeholder="Descrizione opzionale" />
                <FormSubmit className="mt-4">Aggiungi categoria</FormSubmit>
              </form>

              <div className="space-y-4">
                {categories.map((category) => (
                  <details key={category.id} className="group rounded-[2rem] border border-slate-200 bg-white p-6">
                    <summary className="flex cursor-pointer list-none flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{category.name}</div>
                        <div className="mt-2 text-sm text-slate-600">{category.description || "Nessuna descrizione."}</div>
                        <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {category.posts.length} articoli collegati
                        </div>
                      </div>
                      <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition group-open:border-brand-200 group-open:bg-brand-50 group-open:text-brand-800">
                        Modifica
                      </div>
                    </summary>

                    <form action={saveBlogCategoryAction} className="mt-6 border-t border-slate-200 pt-6">
                      <input type="hidden" name="id" value={category.id} />
                      <Input name="name" defaultValue={category.name} placeholder="Nome categoria blog" />
                      <Textarea
                        name="description"
                        className="mt-4"
                        defaultValue={category.description || ""}
                        placeholder="Descrizione opzionale"
                      />
                      <FormSubmit className="mt-4">Salva modifiche</FormSubmit>
                    </form>

                    <form action={deleteBlogCategoryAction} className="mt-4">
                      <input type="hidden" name="id" value={category.id} />
                      <input type="hidden" name="redirectTo" value="/admin/blog" />
                      <DangerSubmit
                        confirmMessage={`Confermi l'eliminazione della categoria blog "${category.name}"? Gli articoli resteranno senza categoria.`}
                      />
                    </form>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { deleteCategoryAction, saveCategoryAction } from "@/actions/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { ActionNotice } from "@/components/ui/action-notice";
import { Container } from "@/components/ui/container";
import { DangerSubmit } from "@/components/ui/danger-submit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSubmit } from "@/components/ui/form-submit";

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};
  const categories = await prisma.category.findMany({
    include: { courses: true },
    orderBy: { name: "asc" }
  });

  return (
    <>
      <PageHero
        badge="Admin · Categorie"
        title="Categorie corsi"
        description="Struttura già pronta per ospitare più aree tematiche in futuro."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/categorie" />
        <div className="space-y-8">
          <ActionNotice error={params.error} success={params.success} />
          <form action={saveCategoryAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">Nuova categoria</h2>
            <Input name="name" className="mt-4" placeholder="Nome categoria" />
            <Textarea name="description" className="mt-4" placeholder="Descrizione" />
            <FormSubmit className="mt-4">Aggiungi categoria</FormSubmit>
          </form>

          <div className="space-y-4">
            {categories.map((category) => (
              <details key={category.id} className="group rounded-[2rem] border border-slate-200 bg-white p-6">
                <summary className="flex cursor-pointer list-none flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{category.name}</div>
                    <div className="mt-2 text-sm text-slate-600">{category.description}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {category.courses.length} corsi collegati
                    </div>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition group-open:border-brand-200 group-open:bg-brand-50 group-open:text-brand-800">
                    Modifica
                  </div>
                </summary>

                <form action={saveCategoryAction} className="mt-6 border-t border-slate-200 pt-6">
                  <input type="hidden" name="id" value={category.id} />
                  <Input name="name" defaultValue={category.name} placeholder="Nome categoria" />
                  <Textarea name="description" className="mt-4" defaultValue={category.description || ""} placeholder="Descrizione" />
                  <FormSubmit className="mt-4">Salva modifiche</FormSubmit>
                </form>

                <form action={deleteCategoryAction} className="mt-4">
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="redirectTo" value="/admin/categorie" />
                  <DangerSubmit
                    confirmMessage={`Confermi l'eliminazione della categoria "${category.name}"? I corsi collegati resteranno senza categoria.`}
                  />
                </form>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}

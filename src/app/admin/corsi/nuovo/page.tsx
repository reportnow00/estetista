import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { saveCourseAction } from "@/actions/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSubmit } from "@/components/ui/form-submit";

export default async function NewCoursePage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <PageHero
        badge="Admin · Corso"
        title="Nuovo corso"
        description="Crea un nuovo corso e definisci subito struttura, pricing, posizionamento e stato di pubblicazione."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/corsi" />
        <form action={saveCourseAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Titolo</label>
              <Input name="title" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Sottotitolo</label>
              <Input name="subtitle" className="mt-2" />
            </div>
          </div>

          <label className="mt-4 block text-sm font-medium text-slate-700">Descrizione breve</label>
          <Textarea name="shortDescription" className="mt-2" />

          <label className="mt-4 block text-sm font-medium text-slate-700">Descrizione lunga</label>
          <Textarea name="longDescription" className="mt-2" />

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">SEO corso</div>
            <div className="mt-4 grid gap-4">
              <Input name="seoMetaTitle" placeholder="Meta title SEO" />
              <Textarea name="seoMetaDescription" className="min-h-[120px]" placeholder="Meta description SEO" />
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="seoCanonicalUrl" placeholder="Canonical URL" />
                <Input name="seoOgImage" placeholder="OG image URL" />
              </div>
              <label className="inline-flex items-center gap-2 text-sm"><input name="seoNoindex" type="checkbox" /> Noindex</label>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Outcome</label>
              <Textarea name="outcome" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Audience</label>
              <Textarea name="audience" className="mt-2" />
            </div>
          </div>

          <label className="mt-4 block text-sm font-medium text-slate-700">Certificazione</label>
          <Input name="certification" className="mt-2" />

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Durata</label>
              <Input name="durationLabel" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Supporto</label>
              <Input name="supportLabel" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Cover image URL</label>
              <Input name="coverImage" className="mt-2" />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Prezzo pieno (cent)</label>
              <Input name="fullPriceCents" type="number" className="mt-2" defaultValue={0} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Prezzo scontato (cent)</label>
              <Input name="salePriceCents" type="number" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Modalita</label>
              <select name="mode" defaultValue="HYBRID" className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4">
                <option value="ONLINE">Online</option>
                <option value="IN_PRESENCE">In presenza</option>
                <option value="HYBRID">Ibrido</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Livello</label>
              <select name="level" defaultValue="FOUNDATION" className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4">
                <option value="FOUNDATION">Base</option>
                <option value="INTERMEDIATE">Intermedio</option>
                <option value="ADVANCED">Avanzato</option>
                <option value="SPECIALIST">Specialistico</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">Categoria</label>
            <select name="categoryId" defaultValue="" className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4">
              <option value="">Senza categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <label className="mt-4 block text-sm font-medium text-slate-700">Badge (separati da virgola)</label>
          <Input name="badges" className="mt-2" />

          <label className="mt-4 block text-sm font-medium text-slate-700">Benefici (uno per riga)</label>
          <Textarea name="benefits" className="mt-2" />

          <label className="mt-4 block text-sm font-medium text-slate-700">Sbocchi professionali (uno per riga)</label>
          <Textarea name="careerOutcomes" className="mt-2" />

          <div className="mt-4 flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 text-sm"><input name="published" type="checkbox" /> Pubblicato</label>
            <label className="inline-flex items-center gap-2 text-sm"><input name="featured" type="checkbox" /> In evidenza</label>
          </div>

          <FormSubmit className="mt-6">Crea corso</FormSubmit>
        </form>
      </Container>
    </>
  );
}

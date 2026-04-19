import { archiveCourseAction, saveCourseAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ActionNotice } from "@/components/ui/action-notice";
import { Container } from "@/components/ui/container";
import { DangerSubmit } from "@/components/ui/danger-submit";
import { FormSubmit } from "@/components/ui/form-submit";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/ui/page-hero";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ success?: string; error?: string }>;
};

export default async function EditCoursePage({ params, searchParams }: Props) {
  await requireAdmin();
  const query = searchParams ? await searchParams : {};
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const course = await prisma.course.findUnique({
    where: { id: (await params).id },
    include: {
      seo: true,
      _count: {
        select: {
          enrollments: true,
          orders: true
        }
      }
    }
  });

  return (
    <>
      <PageHero
        badge="Admin · Corso"
        title={course ? "Modifica corso" : "Nuovo corso"}
        description="Questa scheda è la base concreta per aggiungere nuovi corsi senza toccare il frontend."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/corsi" />
        <div className="space-y-6">
          <ActionNotice error={query.error} success={query.success} />

          {course && (course._count.orders > 0 || course._count.enrollments > 0) ? (
            <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-950">
              Questo corso ha gia dati reali: non e eliminabile. Puoi archiviarlo per toglierlo dal catalogo pubblico o riattivarlo quando vuoi.
            </div>
          ) : null}

          <form action={saveCourseAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
            {course ? <input type="hidden" name="id" value={course.id} /> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Titolo</label>
                <Input name="title" className="mt-2" defaultValue={course?.title || ""} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Sottotitolo</label>
                <Input name="subtitle" className="mt-2" defaultValue={course?.subtitle || ""} />
              </div>
            </div>

            <label className="mt-4 block text-sm font-medium text-slate-700">Descrizione breve</label>
            <Textarea name="shortDescription" className="mt-2" defaultValue={course?.shortDescription || ""} />

            <label className="mt-4 block text-sm font-medium text-slate-700">Descrizione lunga</label>
            <Textarea name="longDescription" className="mt-2" defaultValue={course?.longDescription || ""} />

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">SEO corso</div>
              <div className="mt-4 grid gap-4">
                <Input name="seoMetaTitle" defaultValue={course?.seo?.metaTitle || ""} placeholder="Meta title SEO" />
                <Textarea
                  name="seoMetaDescription"
                  className="min-h-[120px]"
                  defaultValue={course?.seo?.metaDescription || ""}
                  placeholder="Meta description SEO"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input name="seoCanonicalUrl" defaultValue={course?.seo?.canonicalUrl || ""} placeholder="Canonical URL" />
                  <Input name="seoOgImage" defaultValue={course?.seo?.ogImage || ""} placeholder="OG image URL" />
                </div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input name="seoNoindex" type="checkbox" defaultChecked={course?.seo?.noindex} />
                  Noindex
                </label>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Outcome</label>
                <Textarea name="outcome" className="mt-2" defaultValue={course?.outcome || ""} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Audience</label>
                <Textarea name="audience" className="mt-2" defaultValue={course?.audience || ""} />
              </div>
            </div>

            <label className="mt-4 block text-sm font-medium text-slate-700">Certificazione</label>
            <Input name="certification" className="mt-2" defaultValue={course?.certification || ""} />

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Durata</label>
                <Input name="durationLabel" className="mt-2" defaultValue={course?.durationLabel || ""} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Supporto</label>
                <Input name="supportLabel" className="mt-2" defaultValue={course?.supportLabel || ""} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Cover image URL</label>
                <Input name="coverImage" className="mt-2" defaultValue={course?.coverImage || ""} />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Prezzo pieno (cent)</label>
                <Input name="fullPriceCents" type="number" className="mt-2" defaultValue={course?.fullPriceCents || 0} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Prezzo scontato (cent)</label>
                <Input name="salePriceCents" type="number" className="mt-2" defaultValue={course?.salePriceCents || ""} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Modalita</label>
                <select name="mode" defaultValue={course?.mode || "HYBRID"} className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4">
                  <option value="ONLINE">Online</option>
                  <option value="IN_PRESENCE">In presenza</option>
                  <option value="HYBRID">Ibrido</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Livello</label>
                <select name="level" defaultValue={course?.level || "FOUNDATION"} className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4">
                  <option value="FOUNDATION">Base</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzato</option>
                  <option value="SPECIALIST">Specialistico</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700">Categoria</label>
              <select name="categoryId" defaultValue={course?.categoryId || ""} className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4">
                <option value="">Senza categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="mt-4 block text-sm font-medium text-slate-700">Badge (separati da virgola)</label>
            <Input name="badges" className="mt-2" defaultValue={course?.badges.join(", ") || ""} />

            <label className="mt-4 block text-sm font-medium text-slate-700">Benefici (uno per riga)</label>
            <Textarea name="benefits" className="mt-2" defaultValue={course?.benefits.join("\n") || ""} />

            <label className="mt-4 block text-sm font-medium text-slate-700">Sbocchi professionali (uno per riga)</label>
            <Textarea name="careerOutcomes" className="mt-2" defaultValue={course?.careerOutcomes.join("\n") || ""} />

            <div className="mt-4 flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input name="published" type="checkbox" defaultChecked={course?.published} />
                Pubblicato
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input name="featured" type="checkbox" defaultChecked={course?.featured} />
                In evidenza
              </label>
            </div>

            <FormSubmit className="mt-6">{course ? "Salva modifiche" : "Crea corso"}</FormSubmit>
          </form>

          {course && (course._count.orders > 0 || course._count.enrollments > 0) ? (
            <form action={archiveCourseAction}>
              <input type="hidden" name="id" value={course.id} />
              <input type="hidden" name="redirectTo" value={`/admin/corsi/${course.id}`} />
              <DangerSubmit
                confirmMessage={
                  course.published
                    ? `Confermi l'archiviazione del corso "${course.title}"? Verra tolto dal catalogo pubblico ma restera disponibile agli iscritti.`
                    : `Confermi la riattivazione del corso "${course.title}" nel catalogo pubblico?`
                }
              >
                {course.published ? "Archivia corso" : "Riattiva corso"}
              </DangerSubmit>
            </form>
          ) : null}
        </div>
      </Container>
    </>
  );
}

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { deleteReviewAction, saveReviewAction } from "@/actions/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { ActionNotice } from "@/components/ui/action-notice";
import { Container } from "@/components/ui/container";
import { DangerSubmit } from "@/components/ui/danger-submit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSubmit } from "@/components/ui/form-submit";

export default async function AdminReviewsPage({
  searchParams
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};
  const [reviews, courses] = await Promise.all([
    prisma.review.findMany({ include: { course: true }, orderBy: { createdAt: "desc" } }),
    prisma.course.findMany({ orderBy: { title: "asc" } })
  ]);

  return (
    <>
      <PageHero
        badge="Admin · Recensioni"
        title="Gestione recensioni"
        description="Aggiungi nuove testimonianze e aggiorna in qualsiasi momento quelle gia presenti."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/recensioni" />
        <div className="space-y-8">
          <ActionNotice error={params.error} success={params.success} />
          <form action={saveReviewAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">Nuova recensione</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Input name="authorName" placeholder="Autore" />
              <Input name="authorRole" placeholder="Ruolo" />
              <Input name="rating" type="number" placeholder="Rating 1-5" />
            </div>
            <select name="courseId" className="mt-4 h-12 w-full rounded-2xl border border-slate-300 px-4">
              <option value="">Recensione generale academy</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <Input name="title" className="mt-4" placeholder="Titolo" />
            <Textarea name="body" className="mt-4" placeholder="Testo recensione" />
            <div className="mt-4 flex gap-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" /> In evidenza
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked /> Pubblicata
              </label>
            </div>
            <FormSubmit className="mt-4">Aggiungi recensione</FormSubmit>
          </form>

          <div className="space-y-6">
            {reviews.map((review) => (
              <details key={review.id} className="group rounded-[2rem] border border-slate-200 bg-white p-6">
                <summary className="flex cursor-pointer list-none flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{review.authorName}</div>
                    <div className="mt-1 text-sm text-brand-700">{review.authorRole}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      {review.course?.title || "Recensione generale"} · {review.rating}/5
                    </div>
                    <div className="mt-3 text-sm leading-7 text-slate-600">{review.body}</div>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition group-open:border-brand-200 group-open:bg-brand-50 group-open:text-brand-800">
                    Modifica
                  </div>
                </summary>

                <form action={saveReviewAction} className="mt-6 border-t border-slate-200 pt-6">
                  <input type="hidden" name="id" value={review.id} />
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input name="authorName" defaultValue={review.authorName} placeholder="Autore" />
                    <Input name="authorRole" defaultValue={review.authorRole || ""} placeholder="Ruolo" />
                    <Input name="rating" type="number" defaultValue={review.rating} placeholder="Rating 1-5" />
                  </div>
                  <select name="courseId" defaultValue={review.courseId || ""} className="mt-4 h-12 w-full rounded-2xl border border-slate-300 px-4">
                    <option value="">Recensione generale academy</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <Input name="title" className="mt-4" defaultValue={review.title || ""} placeholder="Titolo" />
                  <Textarea name="body" className="mt-4" defaultValue={review.body} placeholder="Testo recensione" />
                  <div className="mt-4 flex gap-6">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" name="featured" defaultChecked={review.featured} /> In evidenza
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" name="published" defaultChecked={review.published} /> Pubblicata
                    </label>
                  </div>
                  <FormSubmit className="mt-4">Salva modifiche</FormSubmit>
                </form>
                <form action={deleteReviewAction} className="mt-4">
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="redirectTo" value="/admin/recensioni" />
                  <DangerSubmit confirmMessage={`Confermi l'eliminazione della recensione di "${review.authorName}"?`} />
                </form>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}

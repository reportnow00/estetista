import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { deleteFaqAction, saveFaqAction } from "@/actions/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { ActionNotice } from "@/components/ui/action-notice";
import { Container } from "@/components/ui/container";
import { DangerSubmit } from "@/components/ui/danger-submit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSubmit } from "@/components/ui/form-submit";

export default async function AdminFaqPage({
  searchParams
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};
  const faqs = await prisma.fAQ.findMany({ include: { course: true }, orderBy: { createdAt: "desc" } });
  const courses = await prisma.course.findMany({ orderBy: { title: "asc" } });

  return (
    <>
      <PageHero
        badge="Admin · FAQ"
        title="Gestione FAQ"
        description="Crea nuove FAQ e modifica quelle esistenti, sia generali sia collegate ai singoli corsi."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/faq" />
        <div className="space-y-8">
          <ActionNotice error={params.error} success={params.success} />
          <form action={saveFaqAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">Nuova FAQ</h2>
            <select name="courseId" className="mt-4 h-12 w-full rounded-2xl border border-slate-300 px-4">
              <option value="">FAQ generale</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <Input name="pageKey" className="mt-4" placeholder="pageKey opzionale (home, faq, ecc.)" />
            <Input name="question" className="mt-4" placeholder="Domanda" />
            <Textarea name="answer" className="mt-4" placeholder="Risposta" />
            <label className="mt-4 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked /> Pubblicata
            </label>
            <FormSubmit className="mt-4">Aggiungi FAQ</FormSubmit>
          </form>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <details key={faq.id} className="group rounded-[2rem] border border-slate-200 bg-white p-6">
                <summary className="flex cursor-pointer list-none flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{faq.question}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.18em] text-brand-700">
                      {faq.course?.title || faq.pageKey || "FAQ generale"}
                    </div>
                    <div className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</div>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition group-open:border-brand-200 group-open:bg-brand-50 group-open:text-brand-800">
                    Modifica
                  </div>
                </summary>

                <form action={saveFaqAction} className="mt-6 border-t border-slate-200 pt-6">
                  <input type="hidden" name="id" value={faq.id} />
                  <select name="courseId" defaultValue={faq.courseId || ""} className="h-12 w-full rounded-2xl border border-slate-300 px-4">
                    <option value="">FAQ generale</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <Input name="pageKey" className="mt-4" defaultValue={faq.pageKey || ""} placeholder="pageKey opzionale (home, faq, ecc.)" />
                  <Input name="question" className="mt-4" defaultValue={faq.question} placeholder="Domanda" />
                  <Textarea name="answer" className="mt-4" defaultValue={faq.answer} placeholder="Risposta" />
                  <label className="mt-4 inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" name="published" defaultChecked={faq.published} /> Pubblicata
                  </label>
                  <FormSubmit className="mt-4">Salva modifiche</FormSubmit>
                </form>
                <form action={deleteFaqAction} className="mt-4">
                  <input type="hidden" name="id" value={faq.id} />
                  <input type="hidden" name="redirectTo" value="/admin/faq" />
                  <DangerSubmit confirmMessage={`Confermi l'eliminazione della FAQ "${faq.question}"?`} />
                </form>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}

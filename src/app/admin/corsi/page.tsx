import Link from "next/link";
import { archiveCourseAction, deleteCourseAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ActionNotice } from "@/components/ui/action-notice";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DangerSubmit } from "@/components/ui/danger-submit";
import { PageHero } from "@/components/ui/page-hero";
import { formatPrice } from "@/lib/utils";

export default async function AdminCoursesPage({
  searchParams
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};

  const courses = await prisma.course.findMany({
    include: {
      category: true,
      _count: {
        select: {
          enrollments: true,
          orders: true
        }
      }
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });

  return (
    <>
      <PageHero
        badge="Admin · Corsi"
        title="Gestione corsi"
        description="Creazione, modifica, pubblicazione e pricing dei corsi. Il frontend legge direttamente questi dati."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/corsi" />
        <div>
          <ActionNotice error={params.error} success={params.success} className="mb-6" />
          <div className="mb-6 flex justify-end">
            <ButtonLink href="/admin/corsi/nuovo">Nuovo corso</ButtonLink>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">Titolo</th>
                  <th className="px-5 py-4">Categoria</th>
                  <th className="px-5 py-4">Prezzo</th>
                  <th className="px-5 py-4">Stato</th>
                  <th className="px-5 py-4">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-t border-slate-200">
                    <td className="px-5 py-4 font-medium text-slate-900">{course.title}</td>
                    <td className="px-5 py-4">{course.category?.name || "—"}</td>
                    <td className="px-5 py-4">{formatPrice(course.salePriceCents ?? course.fullPriceCents)}</td>
                    <td className="px-5 py-4">
                      <div>
                        {course.published
                          ? "Pubblicato"
                          : (course._count.orders > 0 || course._count.enrollments > 0)
                            ? "Archiviato"
                            : "Bozza"}
                      </div>
                      {(course._count.orders > 0 || course._count.enrollments > 0) ? (
                        <div className="mt-1 text-xs text-slate-500">
                          {course._count.orders} ordini · {course._count.enrollments} iscrizioni
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <Link href={`/admin/corsi/${course.id}`} className="text-brand-800">
                          Modifica
                        </Link>
                        <Link href={`/admin/corsi/${course.id}/programma`} className="text-brand-800">
                          Programma
                        </Link>
                        {course._count.orders > 0 || course._count.enrollments > 0 ? (
                          <form action={archiveCourseAction}>
                            <input type="hidden" name="id" value={course.id} />
                            <input type="hidden" name="redirectTo" value="/admin/corsi" />
                            <DangerSubmit
                              confirmMessage={
                                course.published
                                  ? `Confermi l'archiviazione del corso "${course.title}"? Verrà tolto dal catalogo pubblico ma resterà disponibile agli iscritti.`
                                  : `Confermi la riattivazione del corso "${course.title}" nel catalogo pubblico?`
                              }
                            >
                              {course.published ? "Archivia" : "Riattiva"}
                            </DangerSubmit>
                          </form>
                        ) : null}
                        {course._count.orders === 0 && course._count.enrollments === 0 ? (
                          <form action={deleteCourseAction}>
                            <input type="hidden" name="id" value={course.id} />
                            <input type="hidden" name="redirectTo" value="/admin/corsi" />
                            <DangerSubmit confirmMessage={`Confermi l'eliminazione del corso "${course.title}"?`} />
                          </form>
                        ) : (
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                            Non eliminabile
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </>
  );
}

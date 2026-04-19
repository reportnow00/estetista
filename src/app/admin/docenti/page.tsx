import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { deleteTeacherAction, saveTeacherAction } from "@/actions/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { ActionNotice } from "@/components/ui/action-notice";
import { Container } from "@/components/ui/container";
import { DangerSubmit } from "@/components/ui/danger-submit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSubmit } from "@/components/ui/form-submit";

export default async function AdminTeachersPage({
  searchParams
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};
  const teachers = await prisma.teacher.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });

  return (
    <>
      <PageHero
        badge="Admin · Docenti"
        title="Gestione docenti"
        description="Crea nuovi coach e modifica in qualsiasi momento i dettagli dei profili gia presenti."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/docenti" />
        <div className="space-y-8">
          <ActionNotice error={params.error} success={params.success} />
          <form action={saveTeacherAction} className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">Nuovo docente</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input name="name" placeholder="Nome e cognome" />
              <Input name="role" placeholder="Ruolo" />
            </div>
            <Input name="shortBio" className="mt-4" placeholder="Short bio" />
            <Input name="image" className="mt-4" placeholder="Immagine URL" />
            <Textarea name="bio" className="mt-4" placeholder="Bio completa" />
            <Textarea name="credentials" className="mt-4" placeholder="Credenziali, una per riga" />
            <Textarea name="expertise" className="mt-4" placeholder="Expertise, una per riga" />
            <label className="mt-4 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" /> In evidenza
            </label>
            <FormSubmit className="mt-4">Aggiungi docente</FormSubmit>
          </form>

          <div className="space-y-6">
            {teachers.map((teacher) => (
              <details key={teacher.id} className="group rounded-[2rem] border border-slate-200 bg-white p-6">
                <summary className="flex cursor-pointer list-none flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-display text-2xl font-bold text-slate-900">{teacher.name}</div>
                    <div className="mt-2 text-sm uppercase tracking-[0.18em] text-brand-700">{teacher.role}</div>
                    <div className="mt-3 text-sm leading-7 text-slate-600">{teacher.shortBio || teacher.bio}</div>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition group-open:border-brand-200 group-open:bg-brand-50 group-open:text-brand-800">
                    Modifica
                  </div>
                </summary>

                <form action={saveTeacherAction} className="mt-6 border-t border-slate-200 pt-6">
                  <input type="hidden" name="id" value={teacher.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="name" defaultValue={teacher.name} placeholder="Nome e cognome" />
                    <Input name="role" defaultValue={teacher.role} placeholder="Ruolo" />
                  </div>
                  <Input name="shortBio" className="mt-4" defaultValue={teacher.shortBio || ""} placeholder="Short bio" />
                  <Input name="image" className="mt-4" defaultValue={teacher.image || ""} placeholder="Immagine URL" />
                  <Textarea name="bio" className="mt-4" defaultValue={teacher.bio} placeholder="Bio completa" />
                  <Textarea
                    name="credentials"
                    className="mt-4"
                    defaultValue={teacher.credentials.join("\n")}
                    placeholder="Credenziali, una per riga"
                  />
                  <Textarea
                    name="expertise"
                    className="mt-4"
                    defaultValue={teacher.expertise.join("\n")}
                    placeholder="Expertise, una per riga"
                  />
                  <label className="mt-4 inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" name="featured" defaultChecked={teacher.featured} /> In evidenza
                  </label>
                  <FormSubmit className="mt-4">Salva modifiche</FormSubmit>
                </form>
                <form action={deleteTeacherAction} className="mt-4">
                  <input type="hidden" name="id" value={teacher.id} />
                  <input type="hidden" name="redirectTo" value="/admin/docenti" />
                  <DangerSubmit confirmMessage={`Confermi l'eliminazione del docente "${teacher.name}"?`} />
                </form>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}

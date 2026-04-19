import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    include: { enrollments: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <PageHero
        badge="Admin · Utenti"
        title="Utenti e iscrizioni"
        description="Panoramica semplice di account registrati, ruolo e corsi acquistati."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/utenti" />
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="mt-2 text-sm text-slate-600">{user.email} · iscritto il {formatDate(user.createdAt)}</div>
                </div>
                <div className="text-sm text-brand-800">{user.enrollments.length} corsi</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

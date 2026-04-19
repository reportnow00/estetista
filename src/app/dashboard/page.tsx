import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardPage() {
  const user = await requireUser();
  const orderCount = await prisma.order.count({
    where: { userId: user.id }
  });

  return (
    <>
      <PageHero
        badge="Dashboard utente"
        title={`Bentornato, ${user.name}`}
        description="Da qui l'utente vede i corsi acquistati, lo stato avanzamento e il profilo personale."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar pathname="/dashboard" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Corsi acquistati</div>
            <div className="mt-3 text-4xl font-black text-slate-900">{user.enrollments.length}</div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Ordini</div>
            <div className="mt-3 text-4xl font-black text-slate-900">{orderCount}</div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Stato profilo</div>
            <div className="mt-3 text-lg font-semibold text-slate-900">Attivo</div>
          </div>
        </div>
      </Container>
    </>
  );
}

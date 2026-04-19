import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [courses, posts, users, orders] = await Promise.all([
    prisma.course.count(),
    prisma.blogPost.count(),
    prisma.user.count(),
    prisma.order.count()
  ]);

  const stats = [
    { label: "Corsi", value: courses },
    { label: "Articoli", value: posts },
    { label: "Utenti", value: users },
    { label: "Ordini", value: orders }
  ];

  return (
    <>
      <PageHero
        badge="Admin"
        title="Pannello amministratore"
        description="Gestione di corsi, blog, utenti, ordini, FAQ, recensioni e contenuti chiave della home."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{stat.label}</div>
              <div className="mt-3 text-4xl font-black text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

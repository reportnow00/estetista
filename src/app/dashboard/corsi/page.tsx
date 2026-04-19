import Link from "next/link";
import { requireUser } from "@/lib/session";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { formatPrice } from "@/lib/utils";

export default async function MyCoursesPage() {
  const user = await requireUser();

  return (
    <>
      <PageHero
        badge="I miei corsi"
        title="Contenuti acquistati"
        description="Lezioni e moduli accessibili solo se il pagamento è stato confermato e l'iscrizione è attiva."
      />
      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar pathname="/dashboard/corsi" />
        <div className="space-y-6">
          {user.enrollments.map((enrollment) => (
            <div key={enrollment.id} className="rounded-[2rem] border border-slate-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-brand-700">Corso attivo</div>
                  <h2 className="mt-2 font-display text-3xl font-bold text-slate-900">{enrollment.course.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    {enrollment.course.shortDescription}
                  </p>
                  <div className="mt-4 text-sm text-slate-500">
                    Progresso: {enrollment.progressPercent}% · Quota: {formatPrice(enrollment.course.salePriceCents ?? enrollment.course.fullPriceCents)}
                  </div>
                </div>
                <Link href={`/dashboard/corsi/${enrollment.course.slug}`} className="inline-flex rounded-full bg-brand-900 px-5 py-3 text-sm font-semibold text-white">
                  Entra nel corso
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

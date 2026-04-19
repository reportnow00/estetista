import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { mainNavigation } from "@/lib/site";
import { getSession } from "@/lib/session";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-950 text-white shadow-glow">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-slate-900">
            Professione <span className="text-brand-700">Fitness</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {mainNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-brand-800">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <ButtonLink href={session.role === "ADMIN" ? "/admin" : "/dashboard"} variant="outline">
              Area riservata
            </ButtonLink>
          ) : (
            <ButtonLink href="/login" variant="outline">
              Accedi
            </ButtonLink>
          )}
          <ButtonLink href="/corsi/diventa-un-personal-trainer">Corso principale</ButtonLink>
        </div>

        <MobileNav authenticated={Boolean(session)} dashboardHref={session?.role === "ADMIN" ? "/admin" : "/dashboard"} />
      </Container>
    </header>
  );
}

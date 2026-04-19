"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { mainNavigation } from "@/lib/site";

type Props = {
  authenticated: boolean;
  dashboardHref: string;
};

export function MobileNav({ authenticated, dashboardHref }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Apri menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] bg-slate-950/50 backdrop-blur-sm">
          <div className="absolute inset-x-3 top-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_28px_70px_-40px_rgba(15,23,42,0.32)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-slate-900">
                  Professione <span className="text-brand-700">Fitness</span>
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Academy e area riservata
                </div>
              </div>
              <button
                type="button"
                aria-label="Chiudi menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 space-y-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand-200 hover:text-brand-800"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 grid gap-3">
              <ButtonLink href={authenticated ? dashboardHref : "/login"} variant="outline" onClick={() => setOpen(false)}>
                {authenticated ? "Area riservata" : "Accedi"}
              </ButtonLink>
              <ButtonLink href="/corsi/diventa-un-personal-trainer" onClick={() => setOpen(false)}>
                Corso principale
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

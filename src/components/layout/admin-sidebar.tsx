import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Panoramica" },
  { href: "/admin/corsi", label: "Corsi" },
  { href: "/admin/categorie", label: "Categorie" },
  { href: "/admin/docenti", label: "Docenti" },
  { href: "/admin/recensioni", label: "Recensioni" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/ordini", label: "Ordini" },
  { href: "/admin/utenti", label: "Utenti" },
  { href: "/admin/impostazioni", label: "Contenuti home" }
];

export function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        Admin
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-2xl px-3 py-3 text-sm font-medium transition",
                active ? "bg-brand-950 text-white" : "text-slate-700 hover:bg-slate-50"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 border-t border-slate-200 pt-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Esci
          </button>
        </form>
      </div>
    </aside>
  );
}

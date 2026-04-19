import Link from "next/link";
import { BookOpen, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/corsi", label: "I miei corsi", icon: BookOpen },
  { href: "/dashboard/profilo", label: "Profilo", icon: UserCircle2 }
];

export function DashboardSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        Area utente
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                active ? "bg-brand-950 text-white" : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <Icon className="h-4 w-4" />
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

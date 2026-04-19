import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Breadcrumbs({
  items
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <div className="border-b border-slate-200 bg-slate-50/80 py-4">
      <Container>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          {items.map((item, index) => (
            <span key={item.label} className="inline-flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="hover:text-brand-700">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900">{item.label}</span>
              )}
              {index < items.length - 1 ? <ChevronRight className="h-4 w-4" /> : null}
            </span>
          ))}
        </nav>
      </Container>
    </div>
  );
}

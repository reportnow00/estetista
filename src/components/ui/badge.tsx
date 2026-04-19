import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700",
        className
      )}
    >
      {children}
    </span>
  );
}

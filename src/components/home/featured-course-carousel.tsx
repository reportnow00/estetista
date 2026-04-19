"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function FeaturedCourseCarousel({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollRail(direction: "left" | "right") {
    const rail = railRef.current;
    if (!rail) return;

    const amount = Math.max(rail.clientWidth * 0.82, 280);
    rail.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth"
    });
  }

  return (
    <div className={cn("relative mt-8", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-14 bg-[linear-gradient(90deg,#070b12_0%,rgba(7,11,18,0)_100%)] lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-14 bg-[linear-gradient(270deg,#070b12_0%,rgba(7,11,18,0)_100%)] lg:block" />

      <div className="pointer-events-none absolute inset-y-0 left-3 z-20 hidden items-center lg:flex">
        <button
          type="button"
          onClick={() => scrollRail("left")}
          aria-label="Scorri catalogo a sinistra"
          className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white shadow-[0_22px_44px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md transition hover:bg-black/55"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-3 z-20 hidden items-center lg:flex">
        <button
          type="button"
          onClick={() => scrollRail("right")}
          aria-label="Scorri catalogo a destra"
          className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white shadow-[0_22px_44px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md transition hover:bg-black/55"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-2 lg:px-2"
      >
        {children}
      </div>
    </div>
  );
}

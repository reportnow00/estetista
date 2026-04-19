"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { toggleLessonProgress } from "@/actions/progress";
import { cn } from "@/lib/utils";

export function ProgressToggle({
  lessonId,
  completed
}: {
  lessonId: string;
  completed: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => toggleLessonProgress(lessonId, !completed))}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        completed
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-white text-brand-800 hover:border-brand-200 hover:bg-brand-50/60"
      )}
      disabled={pending}
    >
      {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      {pending ? "Aggiornamento..." : completed ? "Completata" : "Segna come completata"}
    </button>
  );
}

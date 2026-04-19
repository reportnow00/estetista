import { ArrowUpRight, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ComingSoonCourse = {
  id: string;
  title: string;
  description: string;
  eyebrow: string;
  accent: "brand" | "emerald";
};

const accentClasses = {
  brand: {
    badge: "bg-brand-50 text-brand-800",
    icon: "text-brand-300",
    panel: "bg-[linear-gradient(145deg,#07111c_0%,#10263a_50%,#0b1726_100%)]",
    glow: "bg-cyan-400/14"
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "text-emerald-300",
    panel: "bg-[linear-gradient(145deg,#071018_0%,#123447_50%,#0b1720_100%)]",
    glow: "bg-emerald-400/14"
  }
};

export const comingSoonCourses: ComingSoonCourse[] = [
  {
    id: "strength-lab",
    title: "Strength & Performance",
    description: "Un nuovo percorso pensato per chi vuole lavorare su forza, performance e costruzione tecnica del gesto.",
    eyebrow: "In arrivo",
    accent: "brand"
  },
  {
    id: "movement-specialist",
    title: "Movement Specialist",
    description: "Un focus dedicato a controllo motorio, biomeccanica e lettura del movimento in modo piu avanzato.",
    eyebrow: "Nuovo percorso",
    accent: "emerald"
  },
  {
    id: "nutrition-fitness",
    title: "Nutrition for Fitness",
    description: "Un percorso editoriale e pratico per orientarti tra nutrizione applicata, educazione alimentare e lavoro con il cliente.",
    eyebrow: "Prossimamente",
    accent: "brand"
  },
  {
    id: "coach-business",
    title: "Coach Business Essentials",
    description: "Un corso pensato per proposta, posizionamento, clienti e sviluppo professionale nel mercato fitness.",
    eyebrow: "Accesso anticipato",
    accent: "emerald"
  }
];

export function ComingSoonCourseCard({
  course,
  compact = false,
  masked = false,
  minimal = false
}: {
  course: ComingSoonCourse;
  compact?: boolean;
  masked?: boolean;
  minimal?: boolean;
}) {
  const accent = accentClasses[course.accent];

  return (
    <Card className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_70px_-44px_rgba(0,0,0,0.85)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]">
      <div className={cn("relative p-4 sm:p-5", masked ? "min-h-[232px]" : compact ? "min-h-[310px]" : "min-h-[350px]")}>
        <div className={cn("absolute right-5 top-4 h-20 w-20 rounded-full blur-3xl", accent.glow)} />

        {masked ? (
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">In arrivo</div>
        ) : null}

        <div
          className={cn(
            "relative mb-5 overflow-hidden rounded-[1.6rem] border border-white/10 shadow-[0_22px_50px_-28px_rgba(0,0,0,0.85)]",
            masked ? "h-44" : compact ? "h-40" : "h-48"
          )}
        >
          <div className={cn("absolute inset-0", accent.panel)} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,12,0.08)_0%,rgba(2,6,12,0.24)_36%,rgba(2,6,12,0.76)_100%)]" />

          {!masked ? (
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/24 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              <Clock3 className="h-3.5 w-3.5" />
              Coming soon
            </div>
          ) : null}

          <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 p-2 text-white backdrop-blur-sm">
            <LockKeyhole className={cn("h-4 w-4", accent.icon)} />
          </div>

          <div className="absolute inset-x-4 bottom-4">
            <div className="rounded-[1.3rem] border border-white/10 bg-black/28 p-4 text-white backdrop-blur-md">
              {masked ? (
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-full bg-white/20" />
                  <div className="h-3 w-16 rounded-full bg-white/10" />
                </div>
              ) : (
                <>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">Nuovo corso</div>
                  <div className="mt-2 text-lg font-semibold leading-7">{course.title}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {masked ? (
          <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Coming soon
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        ) : minimal ? (
          <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Coming soon
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <Badge className={cn(accent.badge)}>{course.eyebrow}</Badge>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <Sparkles className={cn("h-3.5 w-3.5", accent.icon)} />
                In sviluppo
              </div>
            </div>

            <h3
              className={cn(
                "mt-5 max-w-[10ch] font-display font-black tracking-[-0.05em] text-white",
                compact ? "text-[2.2rem] leading-[0.95]" : "text-[2.5rem] leading-[0.94]"
              )}
            >
              {course.title}
            </h3>
          </>
        )}

        {!masked && !minimal ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Presto online
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        ) : null}
      </div>
    </Card>
  );
}

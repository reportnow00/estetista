import Image from "next/image";
import { BookOpen, Clock3, GraduationCap, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Course, CourseTeacher, Teacher } from "@prisma/client";

type CourseCardType = Course & {
  teachers?: (CourseTeacher & { teacher: Teacher })[];
};

export function CourseCard({ course }: { course: CourseCardType }) {
  const price = course.salePriceCents ?? course.fullPriceCents;
  const modeLabel =
    course.mode === "HYBRID" ? "Ibrido" : course.mode === "ONLINE" ? "Online" : "In presenza";
  const levelLabel =
    course.level === "FOUNDATION"
      ? "Base"
      : course.level === "INTERMEDIATE"
        ? "Intermedio"
        : course.level === "ADVANCED"
          ? "Avanzato"
          : "Specialistico";
  const mobileMeta = [
    { label: "Modalita", value: modeLabel },
    { label: "Livello", value: levelLabel },
    { label: "Durata", value: course.durationLabel },
    { label: "Accesso", value: "Immediato" }
  ];

  return (
    <Card className="group overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_100px_-48px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative h-[300px] overflow-hidden sm:h-[360px] lg:min-h-[620px] lg:h-auto">
          <Image
            src={course.coverImage || "https://images.unsplash.com/photo-1518611012118-2969c6370238?q=80&w=1400&auto=format&fit=crop"}
            alt={course.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,12,0.02)_0%,rgba(2,6,12,0.06)_24%,rgba(2,6,12,0.2)_50%,rgba(2,6,12,0.86)_100%)] lg:bg-[linear-gradient(180deg,rgba(2,6,12,0.08)_0%,rgba(2,6,12,0.18)_28%,rgba(2,6,12,0.58)_62%,rgba(2,6,12,0.94)_100%)]" />

          <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-5 sm:right-5 sm:top-5">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-white/10 bg-black/25 text-white backdrop-blur-sm">Ora disponibile</Badge>
              {course.badges.slice(0, 1).map((badge) => (
                <Badge key={badge} className="hidden border-white/10 bg-white/10 text-white backdrop-blur-sm sm:inline-flex">
                  {badge}
                </Badge>
              ))}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/28 text-white backdrop-blur-sm sm:h-11 sm:w-11">
              <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
            <div className="rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,14,24,0.12),rgba(3,7,18,0.72))] p-4 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] backdrop-blur-[10px] sm:rounded-[1.8rem] sm:bg-[linear-gradient(180deg,rgba(17,24,39,0.28),rgba(3,7,18,0.76))] sm:p-5 sm:backdrop-blur-[24px]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/10 text-white backdrop-blur-sm">
                  {modeLabel}
                </Badge>
                <Badge className="bg-emerald-400/12 text-emerald-300">{levelLabel}</Badge>
              </div>

              <h3 className="mt-3 max-w-[11ch] font-display text-[2rem] font-black leading-[0.92] tracking-[-0.05em] text-white sm:mt-4 sm:text-[2.2rem] lg:text-[2.8rem]">
                {course.title}
              </h3>
              <p className="mt-3 hidden max-w-xl text-sm leading-7 text-slate-300 sm:block sm:text-base lg:mt-4">{course.shortDescription}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-[linear-gradient(180deg,rgba(9,12,18,0.95),rgba(3,6,12,0.98))] p-5 sm:p-7">
          <div>
            <div className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300 sm:block">Percorso completo</div>

            <div className="mt-4 hidden gap-3 lg:grid lg:mt-6">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                <Clock3 className="mb-3 h-4 w-4 text-emerald-300" />
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Durata</div>
                <div className="mt-2 text-sm font-semibold text-white">{course.durationLabel}</div>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                <BookOpen className="mb-3 h-4 w-4 text-emerald-300" />
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Accesso</div>
                <div className="mt-2 text-sm font-semibold text-white">Dashboard personale e accesso immediato</div>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                <GraduationCap className="mb-3 h-4 w-4 text-emerald-300" />
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Output</div>
                <div className="mt-2 text-sm font-semibold text-white">Certificato finale e percorso orientato al lavoro</div>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-300 sm:hidden">{course.shortDescription}</p>

            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:hidden">
              {mobileMeta.map((item) => (
                <div key={item.label} className="rounded-[1.15rem] border border-white/10 bg-white/[0.04] px-3.5 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">{item.label}</div>
                  <div className="mt-1.5 text-sm font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-white/10 pt-5 sm:mt-7 sm:pt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Investimento unico</div>
            <div className="mt-2 text-[2.1rem] font-black tracking-[-0.05em] text-white sm:text-[2.5rem] lg:text-[3rem]">{formatPrice(price)}</div>

            <div className="mt-4 flex flex-col gap-3 sm:mt-5">
              <ButtonLink href={`/corsi/${course.slug}`} className="w-full justify-center bg-white text-slate-950 hover:bg-emerald-50">
                Dettagli corso
              </ButtonLink>
              <div className="rounded-full border border-white/10 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
                Programma, docenti e FAQ visibili prima del checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

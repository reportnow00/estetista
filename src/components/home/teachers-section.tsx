import Image from "next/image";
import type { Teacher } from "@prisma/client";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function TeachersSection({ teachers }: { teachers: Teacher[] }) {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <SectionHeading
          badge="Faculty"
          title="Professionisti del settore, presentati con chiarezza."
          description="Conosci i docenti, la loro esperienza e il taglio pratico che portano dentro il percorso formativo."
          center
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="rounded-[2rem] border border-slate-200/80 bg-white p-6 text-center shadow-[0_20px_60px_-42px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_-42px_rgba(15,23,42,0.28)]">
              <div className="relative mx-auto mb-5 h-48 w-48 overflow-hidden rounded-[2rem] border border-slate-200/80 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.28)]">
                <Image
                  src={teacher.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">{teacher.name}</h3>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">{teacher.role}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{teacher.shortBio || teacher.bio}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

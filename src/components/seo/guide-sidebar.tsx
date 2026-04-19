import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { getRelatedGuides } from "@/lib/editorial-guides";

export function GuideSidebar({
  currentPath,
  title = "Diventa un Personal Trainer",
  description = "Scopri il percorso completo con programma, docenti, area corso e accesso riservato agli iscritti."
}: {
  currentPath: string;
  title?: string;
  description?: string;
}) {
  const relatedGuides = getRelatedGuides(currentPath);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Percorso consigliato</div>
        <h3 className="mt-3 font-display text-3xl font-bold text-slate-900">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
        <ButtonLink href="/corsi/diventa-un-personal-trainer" className="mt-6 w-full">
          Vai al corso
        </ButtonLink>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Guide correlate</div>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
          {relatedGuides.map((guide) => (
            <li key={guide.href}>
              <Link href={guide.href} className="hover:text-brand-800">
                {guide.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/blog" className="hover:text-brand-800">
              Vai al blog completo
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

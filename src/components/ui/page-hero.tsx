import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export function PageHero({
  badge,
  title,
  description
}: {
  badge?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-slate-200 bg-white pt-28 pb-14">
      <Container>
        <div className="max-w-3xl">
          {badge ? <Badge className="mb-5">{badge}</Badge> : null}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
        </div>
      </Container>
    </section>
  );
}

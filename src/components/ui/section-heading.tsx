import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  badge,
  title,
  description,
  center = false
}: {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {badge ? <Badge className="mb-4">{badge}</Badge> : null}
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

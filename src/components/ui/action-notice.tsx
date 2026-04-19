import { cn } from "@/lib/utils";

type Props = {
  error?: string;
  success?: string;
  className?: string;
};

export function ActionNotice({ error, success, className }: Props) {
  if (!error && !success) return null;

  return (
    <div
      className={cn(
        "rounded-[1.5rem] border px-5 py-4 text-sm leading-7",
        error ? "border-rose-200 bg-rose-50 text-rose-900" : "border-emerald-200 bg-emerald-50 text-emerald-900",
        className
      )}
    >
      {decodeURIComponent(error || success || "")}
    </div>
  );
}

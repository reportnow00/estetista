import { Star } from "lucide-react";

export function RatingStars({ value = 5 }: { value?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={index < value ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-slate-300"}
        />
      ))}
    </div>
  );
}

import type { Review } from "@prisma/client";
import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";

function formatAverage(reviews: Review[]) {
  if (reviews.length === 0) return "0.0";
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const [featuredReview, ...otherReviews] = reviews;
  const average = formatAverage(reviews);

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f8fafc)] py-20">
      <Container>
        <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="relative">
            <Badge className="mb-5 bg-brand-50 text-brand-800">Recensioni</Badge>
            <h2 className="max-w-xl font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Chi ha scelto il percorso ha trovato più chiarezza, più metodo e più fiducia.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Le testimonianze ti aiutano a capire come viene vissuta davvero l&apos;esperienza di studio: non solo nei contenuti, ma anche nella percezione del percorso e nella facilità con cui lo si segue.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.2)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Valutazione</div>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-4xl font-black text-slate-900">{average}</span>
                  <span className="pb-1 text-sm font-medium text-slate-500">/ 5</span>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.2)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Studenti</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{reviews.length}</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">testimonianze in evidenza</p>
              </div>
              <div className="rounded-[1.75rem] border border-brand-100 bg-brand-50/70 p-5 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.16)]">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Una sezione pensata per aiutarti a capire se il percorso può essere adatto anche a te.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-slate-950 p-8 text-white shadow-[0_38px_90px_-52px_rgba(15,23,42,0.65)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_24%)]" />
              <div className="relative">
                <Quote className="h-10 w-10 text-white/30" />
                <div className="mt-4">
                  <RatingStars value={featuredReview.rating} />
                </div>
                <p className="mt-6 max-w-3xl font-display text-2xl font-semibold leading-10 text-white sm:text-3xl">
                  {featuredReview.body}
                </p>
                <div className="mt-8 border-t border-white/10 pt-5">
                  <div className="text-lg font-semibold text-white">{featuredReview.authorName}</div>
                  <div className="mt-1 text-sm text-emerald-200">{featuredReview.authorRole}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {otherReviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`rounded-[1.85rem] border p-7 shadow-[0_22px_55px_-40px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 ${
                    index % 2 === 0
                      ? "border-slate-200/80 bg-white"
                      : "border-brand-100 bg-[linear-gradient(180deg,rgba(239,246,255,0.9),rgba(248,250,252,1))]"
                  }`}
                >
                  <Quote className="h-7 w-7 text-brand-200" />
                  <div className="mt-4">
                    <RatingStars value={review.rating} />
                  </div>
                  <p className="mt-5 text-base leading-8 text-slate-700">{review.body}</p>
                  <div className="mt-6">
                    <div className="font-semibold text-slate-900">{review.authorName}</div>
                    <div className="mt-1 text-sm text-brand-700">{review.authorRole}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

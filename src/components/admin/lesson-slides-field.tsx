"use client";

import { useState } from "react";
import { ImagePlus, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LessonSlide } from "@/lib/lesson-slides";

const emptySlide = (): LessonSlide => ({
  title: "",
  body: "",
  imageUrl: ""
});

type Props = {
  initialSlides?: LessonSlide[];
};

export function LessonSlidesField({ initialSlides = [] }: Props) {
  const [slides, setSlides] = useState<LessonSlide[]>(initialSlides);

  const updateSlide = (index: number, field: keyof LessonSlide, value: string) => {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, [field]: value } : slide
      )
    );
  };

  const removeSlide = (index: number) => {
    setSlides((current) => current.filter((_, slideIndex) => slideIndex !== index));
  };

  const serializedSlides = JSON.stringify(
    slides.filter((slide) => slide.title || slide.body || slide.imageUrl)
  );

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
      <input type="hidden" name="slidesJson" value={serializedSlides} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">
            <LayoutTemplate className="h-3.5 w-3.5" />
            Slide deck
          </div>
          <h5 className="mt-3 text-lg font-semibold text-slate-900">Aggiungi slide visuali o testuali</h5>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Perfetto per lezioni senza video: ogni slide può avere titolo, testo e immagine, così l&apos;area corso resta ricca e curata.
          </p>
        </div>
        <Button type="button" variant="outline" className="gap-2" onClick={() => setSlides((current) => [...current, emptySlide()])}>
          <Plus className="h-4 w-4" />
          Aggiungi slide
        </Button>
      </div>

      {slides.length > 0 ? (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {slides.map((slide, index) => (
            <div
              key={`slide-${index}`}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.18)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Slide {String(index + 1).padStart(2, "0")}
                </div>
                <Button type="button" variant="ghost" size="sm" className="gap-2 text-rose-600 hover:bg-rose-50" onClick={() => removeSlide(index)}>
                  <Trash2 className="h-4 w-4" />
                  Rimuovi
                </Button>
              </div>

              <Input
                className="mt-4"
                placeholder="Titolo slide"
                value={slide.title}
                onChange={(event) => updateSlide(index, "title", event.target.value)}
              />
              <Textarea
                className="mt-4 min-h-[120px]"
                placeholder="Testo slide"
                value={slide.body}
                onChange={(event) => updateSlide(index, "body", event.target.value)}
              />
              <div className="relative mt-4">
                <ImagePlus className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  placeholder="URL immagine slide"
                  value={slide.imageUrl}
                  onChange={(event) => updateSlide(index, "imageUrl", event.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 p-6 text-sm leading-7 text-slate-500">
          Nessuna slide inserita. Puoi usare solo il testo della lezione oppure aggiungere una o più slide per creare un deck visivo.
        </div>
      )}
    </div>
  );
}

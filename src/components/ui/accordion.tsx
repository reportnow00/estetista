"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="font-semibold text-slate-900">{item.question}</span>
              <ChevronDown className={cn("h-5 w-5 text-slate-500 transition-transform", open && "rotate-180")} />
            </button>
            {open ? <div className="px-6 pb-6 text-sm leading-7 text-slate-600">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

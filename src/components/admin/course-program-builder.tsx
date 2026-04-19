"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { LessonType } from "@prisma/client";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  FolderKanban,
  MonitorPlay,
  Plus,
  Sparkles
} from "lucide-react";
import {
  deleteLessonAction,
  deleteModuleAction,
  moveLessonAction,
  moveModuleAction,
  saveLessonAction,
  saveModuleAction
} from "@/actions/auth";
import { LessonSlidesField } from "@/components/admin/lesson-slides-field";
import { Button } from "@/components/ui/button";
import { DangerSubmit } from "@/components/ui/danger-submit";
import { FormSubmit } from "@/components/ui/form-submit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { LessonSlide } from "@/lib/lesson-slides";

const lessonTypeLabels: Record<LessonType, string> = {
  VIDEO: "Video",
  ARTICLE: "Testo",
  DOWNLOAD: "Download",
  QUIZ: "Quiz"
};

type BuilderLesson = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  durationLabel: string | null;
  lessonType: LessonType;
  videoUrl: string | null;
  downloadUrl: string | null;
  previewable: boolean;
  sortOrder: number;
  slides: LessonSlide[];
  slidesCount: number;
};

type BuilderModule = {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  lessons: BuilderLesson[];
};

type SelectionMode = "new-module" | "module" | "new-lesson" | "lesson";

type SelectionState = {
  mode: SelectionMode;
  moduleId?: string;
  lessonId?: string;
};

type Props = {
  course: {
    id: string;
    slug: string;
    title: string;
    modules: BuilderModule[];
  };
  initialSelection?: Partial<SelectionState>;
};

const emptyLesson = {
  title: "",
  summary: "",
  content: "",
  durationLabel: "",
  lessonType: "VIDEO" as LessonType,
  videoUrl: "",
  downloadUrl: "",
  previewable: false,
  slides: []
};

function resolveSelection(modules: BuilderModule[], initialSelection?: Partial<SelectionState>): SelectionState {
  const requestedModule = modules.find((module) => module.id === initialSelection?.moduleId);
  const requestedLesson = modules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.id === initialSelection?.lessonId);

  if (initialSelection?.mode === "new-module") return { mode: "new-module" };

  if (initialSelection?.mode === "new-lesson" && requestedModule) {
    return { mode: "new-lesson", moduleId: requestedModule.id };
  }

  if (initialSelection?.mode === "module" && requestedModule) {
    return { mode: "module", moduleId: requestedModule.id };
  }

  if (initialSelection?.mode === "lesson" && requestedLesson) {
    const lessonModule = modules.find((module) => module.lessons.some((lesson) => lesson.id === requestedLesson.id));
    return {
      mode: "lesson",
      moduleId: lessonModule?.id,
      lessonId: requestedLesson.id
    };
  }

  const firstModule = modules[0];
  const firstLesson = firstModule?.lessons[0];

  if (firstLesson) {
    return {
      mode: "lesson",
      moduleId: firstModule.id,
      lessonId: firstLesson.id
    };
  }

  if (firstModule) {
    return {
      mode: "module",
      moduleId: firstModule.id
    };
  }

  return { mode: "new-module" };
}

function ContentBadge({ children, tone = "slate" }: { children: string; tone?: "slate" | "brand" | "emerald" | "amber" }) {
  const toneClasses = {
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    brand: "border-brand-100 bg-brand-50 text-brand-800",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-800",
    amber: "border-amber-100 bg-amber-50 text-amber-800"
  };

  return (
    <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]", toneClasses[tone])}>
      {children}
    </span>
  );
}

function SortActionForm({
  action,
  fieldName,
  itemId,
  direction,
  disabled
}: {
  action: (formData: FormData) => Promise<void>;
  fieldName: "moduleId" | "lessonId";
  itemId: string;
  direction: "up" | "down";
  disabled: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name={fieldName} value={itemId} />
      <input type="hidden" name="direction" value={direction} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={disabled}
        className="h-9 w-9 rounded-2xl px-0 text-slate-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
      >
        {direction === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </Button>
    </form>
  );
}

function StudentPreview({ moduleTitle, lesson }: { moduleTitle: string; lesson: BuilderLesson | typeof emptyLesson }) {
  const previewBlocks = [
    lesson.videoUrl ? "Video player" : null,
    lesson.slides.length ? `${lesson.slides.length} slide` : null,
    lesson.content.trim() ? "Testo completo" : null,
    lesson.downloadUrl ? "Download allegato" : null
  ].filter((value): value is string => Boolean(value));

  const excerpt = (lesson.summary || lesson.content || "").replace(/\s+/g, " ").trim().slice(0, 180);

  return (
    <div className="rounded-[2rem] border border-slate-900 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.2),transparent_38%),linear-gradient(180deg,#0f172a_0%,#111c31_100%)] p-6 text-white shadow-[0_34px_80px_-44px_rgba(15,23,42,0.75)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">Preview studente</div>
          <h4 className="mt-2 text-2xl font-semibold">{lesson.title || "Titolo lezione"}</h4>
        </div>
        <div className="rounded-full border border-white/[0.15] bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100">
          {lessonTypeLabels[lesson.lessonType]}
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
        {excerpt || "Qui l&apos;admin vede subito come apparira la lezione: titolo, ritmo, contenuti presenti e sensazione generale per chi compra."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <ContentBadge tone="brand">{moduleTitle || "Modulo"}</ContentBadge>
        {lesson.durationLabel ? <ContentBadge tone="slate">{lesson.durationLabel}</ContentBadge> : null}
        {lesson.previewable ? <ContentBadge tone="emerald">Anteprima libera</ContentBadge> : null}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {previewBlocks.map((block) => (
          <div key={block} className="rounded-[1.4rem] border border-white/10 bg-white/[0.08] p-4 text-sm text-slate-100">
            {block}
          </div>
        ))}
        {!previewBlocks.length ? (
          <div className="rounded-[1.4rem] border border-dashed border-white/20 bg-white/5 p-4 text-sm text-slate-300 sm:col-span-2">
            Inserisci almeno uno tra testo, video, slide o allegato per vedere una preview più ricca.
          </div>
        ) : null}
      </div>

      <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/[0.08] p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          <MonitorPlay className="h-3.5 w-3.5" />
          Come la percepisce lo studente
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          Layout chiaro, blocchi ordinati e contenuti riconoscibili al primo colpo. Questa preview ti aiuta a capire se la lezione sembra davvero pronta, non solo compilata.
        </p>
      </div>
    </div>
  );
}

function LessonEditorForm({
  moduleId,
  lesson,
  isNew
}: {
  moduleId: string;
  lesson: BuilderLesson | typeof emptyLesson;
  isNew: boolean;
}) {
  return (
    <form action={saveLessonAction} className="space-y-6">
      {!isNew ? <input type="hidden" name="id" value={"id" in lesson ? lesson.id : ""} /> : null}
      <input type="hidden" name="moduleId" value={moduleId} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" defaultValue={lesson.title} placeholder="Titolo lezione" />
        <Input name="summary" defaultValue={lesson.summary ?? ""} placeholder="Riassunto breve" />
      </div>

      <Textarea
        name="content"
        className="min-h-[190px]"
        defaultValue={lesson.content}
        placeholder="Testo completo della lezione"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Input name="durationLabel" defaultValue={lesson.durationLabel ?? ""} placeholder="Durata" />
        <select
          name="lessonType"
          defaultValue={lesson.lessonType}
          className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <option value="VIDEO">Video</option>
          <option value="ARTICLE">Articolo / testo</option>
          <option value="DOWNLOAD">Download</option>
          <option value="QUIZ">Quiz</option>
        </select>
        <Input name="videoUrl" defaultValue={lesson.videoUrl ?? ""} placeholder="Video URL" />
      </div>

      <Input name="downloadUrl" defaultValue={lesson.downloadUrl ?? ""} placeholder="Download URL" />

      <LessonSlidesField initialSlides={lesson.slides} />

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="previewable" defaultChecked={lesson.previewable} />
        Anteprima libera
      </label>

      <FormSubmit>{isNew ? "Aggiungi lezione" : "Salva modifiche"}</FormSubmit>
    </form>
  );
}

export function CourseProgramBuilder({ course, initialSelection }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<SelectionState>(() => resolveSelection(course.modules, initialSelection));

  const moduleCount = course.modules.length;
  const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const selectedModule =
    course.modules.find((module) => module.id === selection.moduleId) ||
    course.modules.find((module) => module.lessons.some((lesson) => lesson.id === selection.lessonId)) ||
    course.modules[0];
  const selectedLesson = selectedModule?.lessons.find((lesson) => lesson.id === selection.lessonId);

  function updateSelection(next: SelectionState) {
    setSelection(next);

    const params = new URLSearchParams(searchParams.toString());
    params.set("panel", next.mode);

    if (next.moduleId) params.set("module", next.moduleId);
    else params.delete("module");

    if (next.lessonId) params.set("lesson", next.lessonId);
    else params.delete("lesson");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_-40px_rgba(15,23,42,0.22)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">
                <FolderKanban className="h-3.5 w-3.5" />
                Builder programma
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Moduli e lezioni</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Gestisci il percorso come una vera scaletta editoriale: struttura a sinistra, editor dedicato a destra.
              </p>
            </div>
            <Button type="button" size="sm" className="gap-2" onClick={() => updateSelection({ mode: "new-module" })}>
              <Plus className="h-4 w-4" />
              Nuovo
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Moduli</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{moduleCount}</div>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Lezioni</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{lessonCount}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {course.modules.map((module, moduleIndex) => {
            const moduleSelected = selection.moduleId === module.id || module.lessons.some((lesson) => lesson.id === selection.lessonId);

            return (
              <div
                key={module.id}
                className={cn(
                  "rounded-[2rem] border bg-white p-5 shadow-[0_22px_54px_-40px_rgba(15,23,42,0.18)] transition",
                  moduleSelected ? "border-brand-200 ring-4 ring-brand-50" : "border-slate-200"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => updateSelection({ mode: "module", moduleId: module.id })}>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Modulo {String(moduleIndex + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{module.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{module.lessons.length} lezioni</p>
                  </button>

                  <div className="flex items-center gap-1">
                    <SortActionForm
                      action={moveModuleAction}
                      fieldName="moduleId"
                      itemId={module.id}
                      direction="up"
                      disabled={moduleIndex === 0}
                    />
                    <SortActionForm
                      action={moveModuleAction}
                      fieldName="moduleId"
                      itemId={module.id}
                      direction="down"
                      disabled={moduleIndex === course.modules.length - 1}
                    />
                  </div>
                </div>

                {module.description ? <p className="mt-3 text-sm leading-7 text-slate-600">{module.description}</p> : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => updateSelection({ mode: "module", moduleId: module.id })}>
                    <Sparkles className="h-4 w-4" />
                    Dettagli modulo
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="gap-2" onClick={() => updateSelection({ mode: "new-lesson", moduleId: module.id })}>
                    <Plus className="h-4 w-4" />
                    Nuova lezione
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  {module.lessons.length ? (
                    module.lessons.map((lesson, lessonIndex) => {
                      const activeLesson = selection.lessonId === lesson.id;

                      return (
                        <div
                          key={lesson.id}
                          className={cn(
                            "rounded-[1.4rem] border p-4 transition",
                            activeLesson ? "border-brand-200 bg-brand-50/70" : "border-slate-200 bg-slate-50/80"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              className="min-w-0 flex-1 text-left"
                              onClick={() => updateSelection({ mode: "lesson", moduleId: module.id, lessonId: lesson.id })}
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-slate-900">{lesson.title}</span>
                                <ContentBadge tone="slate">{lessonTypeLabels[lesson.lessonType]}</ContentBadge>
                                {lesson.videoUrl ? <ContentBadge tone="brand">Video</ContentBadge> : null}
                                {lesson.slidesCount ? <ContentBadge tone="emerald">{`${lesson.slidesCount} slide`}</ContentBadge> : null}
                                {lesson.downloadUrl ? <ContentBadge tone="amber">Allegato</ContentBadge> : null}
                              </div>
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                                {(lesson.summary || lesson.content).trim() || "Lezione pronta da completare."}
                              </p>
                            </button>

                            <div className="flex items-center gap-1">
                              <SortActionForm
                                action={moveLessonAction}
                                fieldName="lessonId"
                                itemId={lesson.id}
                                direction="up"
                                disabled={lessonIndex === 0}
                              />
                              <SortActionForm
                                action={moveLessonAction}
                                fieldName="lessonId"
                                itemId={lesson.id}
                                direction="down"
                                disabled={lessonIndex === module.lessons.length - 1}
                              />
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-2">
                              {lesson.durationLabel ? <ContentBadge tone="slate">{lesson.durationLabel}</ContentBadge> : null}
                              {lesson.previewable ? <ContentBadge tone="emerald">Anteprima</ContentBadge> : null}
                            </div>
                            <Button
                              type="button"
                              variant={activeLesson ? "primary" : "outline"}
                              size="sm"
                              className="gap-2"
                              onClick={() => updateSelection({ mode: "lesson", moduleId: module.id, lessonId: lesson.id })}
                            >
                              <Eye className="h-4 w-4" />
                              Modifica
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm leading-7 text-slate-500">
                      Modulo vuoto per ora. Clicca su <strong>Nuova lezione</strong> per iniziare a costruirlo.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {selection.mode === "new-module" ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_26px_72px_-44px_rgba(15,23,42,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">Nuovo modulo</div>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">Aggiungi un nuovo blocco del corso</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  Parti da un modulo chiaro, con titolo e descrizione orientati al risultato. Da qui poi potrai agganciare tutte le lezioni che ti servono.
                </p>
              </div>
            </div>

            <form action={saveModuleAction} className="mt-8 space-y-5">
              <input type="hidden" name="courseId" value={course.id} />
              <Input name="title" placeholder="Titolo modulo" />
              <Textarea name="description" className="min-h-[180px]" placeholder="Descrizione modulo" />
              <FormSubmit>Aggiungi modulo</FormSubmit>
            </form>
          </div>
        ) : null}

        {selection.mode === "module" && selectedModule ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_26px_72px_-44px_rgba(15,23,42,0.24)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">Modulo selezionato</div>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">{selectedModule.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  Qui aggiorni l&apos;identità del modulo e, quando vuoi, puoi aggiungere subito una nuova lezione nella colonna destra senza perdere il contesto.
                </p>
              </div>
              <Button type="button" className="gap-2" onClick={() => updateSelection({ mode: "new-lesson", moduleId: selectedModule.id })}>
                <Plus className="h-4 w-4" />
                Nuova lezione
              </Button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Lezioni</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{selectedModule.lessons.length}</div>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Preview libere</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedModule.lessons.filter((lesson) => lesson.previewable).length}
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Slide deck</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedModule.lessons.reduce((total, lesson) => total + lesson.slidesCount, 0)}
                </div>
              </div>
            </div>

            <form action={saveModuleAction} className="mt-8 space-y-5">
              <input type="hidden" name="id" value={selectedModule.id} />
              <input type="hidden" name="courseId" value={course.id} />
              <Input name="title" defaultValue={selectedModule.title} placeholder="Titolo modulo" />
              <Textarea
                name="description"
                className="min-h-[180px]"
                defaultValue={selectedModule.description ?? ""}
                placeholder="Descrizione modulo"
              />
              <FormSubmit>Salva modifiche</FormSubmit>
            </form>
            <form action={deleteModuleAction} className="mt-4">
              <input type="hidden" name="id" value={selectedModule.id} />
              <DangerSubmit
                confirmMessage={`Confermi l'eliminazione del modulo "${selectedModule.title}" e di tutte le sue lezioni?`}
              />
            </form>
          </div>
        ) : null}

        {selection.mode === "new-lesson" && selectedModule ? (
          <>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_26px_72px_-44px_rgba(15,23,42,0.24)]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">Nuova lezione</div>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">Aggiungi una lezione dentro {selectedModule.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  Se non hai ancora il video, pubblica comunque una lezione completa con testo, slide e allegati: la piattaforma la renderizza già bene lato studente.
                </p>
              </div>

              <div className="mt-8">
                <LessonEditorForm moduleId={selectedModule.id} lesson={emptyLesson} isNew />
              </div>
            </div>

            <StudentPreview moduleTitle={selectedModule.title} lesson={emptyLesson} />
          </>
        ) : null}

        {selection.mode === "lesson" && selectedModule && selectedLesson ? (
          <>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_26px_72px_-44px_rgba(15,23,42,0.24)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-800">Lezione selezionata</div>
                  <h3 className="mt-2 text-3xl font-semibold text-slate-900">{selectedLesson.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                    Stai lavorando dentro <strong>{selectedModule.title}</strong>. Qui modifichi solo questa lezione, con badges rapidi e preview sintetica sempre visibile.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ContentBadge tone="slate">{lessonTypeLabels[selectedLesson.lessonType]}</ContentBadge>
                  {selectedLesson.videoUrl ? <ContentBadge tone="brand">Video</ContentBadge> : null}
                  {selectedLesson.slidesCount ? <ContentBadge tone="emerald">{`${selectedLesson.slidesCount} slide`}</ContentBadge> : null}
                  {selectedLesson.downloadUrl ? <ContentBadge tone="amber">Allegato</ContentBadge> : null}
                </div>
              </div>

              <div className="mt-8">
                <LessonEditorForm moduleId={selectedModule.id} lesson={selectedLesson} isNew={false} />
                <form action={deleteLessonAction} className="mt-4">
                  <input type="hidden" name="id" value={selectedLesson.id} />
                  <DangerSubmit
                    confirmMessage={`Confermi l'eliminazione della lezione "${selectedLesson.title}"?`}
                  />
                </form>
              </div>
            </div>

            <StudentPreview moduleTitle={selectedModule.title} lesson={selectedLesson} />
          </>
        ) : null}
      </div>
    </div>
  );
}

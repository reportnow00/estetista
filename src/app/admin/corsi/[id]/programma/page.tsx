import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { parseLessonSlides } from "@/lib/lesson-slides";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ActionNotice } from "@/components/ui/action-notice";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { CourseProgramBuilder } from "@/components/admin/course-program-builder";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    panel?: string;
    module?: string;
    lesson?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function CourseProgramPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const selection = searchParams ? await searchParams : undefined;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { sortOrder: "asc" }
          }
        },
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  if (!course) return null;

  return (
    <>
      <PageHero
        badge="Admin · Programma corso"
        title={`Programma · ${course.title}`}
        description="Organizza il corso come un builder vero: struttura a sinistra, editor dedicato a destra e preview sintetica di come lo vedra lo studente."
      />

      <Container className="grid gap-8 py-16 lg:grid-cols-[280px_1fr]">
        <AdminSidebar pathname="/admin/corsi" />
        <div className="space-y-6">
          <ActionNotice error={selection?.error} success={selection?.success} />
          <CourseProgramBuilder
            course={{
              id: course.id,
              slug: course.slug,
              title: course.title,
              modules: course.modules.map((module) => ({
                id: module.id,
                title: module.title,
                description: module.description,
                sortOrder: module.sortOrder,
                lessons: module.lessons.map((lesson) => {
                  const slides = parseLessonSlides(lesson.slides);

                  return {
                    id: lesson.id,
                    title: lesson.title,
                    slug: lesson.slug,
                    summary: lesson.summary,
                    content: lesson.content,
                    durationLabel: lesson.durationLabel,
                    lessonType: lesson.lessonType,
                    videoUrl: lesson.videoUrl,
                    downloadUrl: lesson.downloadUrl,
                    previewable: lesson.previewable,
                    sortOrder: lesson.sortOrder,
                    slides,
                    slidesCount: slides.length
                  };
                })
              }))
            }}
            initialSelection={{
              mode:
                selection?.panel === "new-module" ||
                selection?.panel === "module" ||
                selection?.panel === "new-lesson" ||
                selection?.panel === "lesson"
                  ? selection.panel
                  : undefined,
              moduleId: selection?.module,
              lessonId: selection?.lesson
            }}
          />
        </div>
      </Container>
    </>
  );
}

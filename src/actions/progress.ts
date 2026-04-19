'use server';

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function toggleLessonProgress(lessonId: string, completed: boolean) {
  const user = await requireUser();

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      module: {
        course: {
          enrollments: {
            some: {
              userId: user.id,
              status: {
                in: ["ACTIVE", "COMPLETED"]
              }
            }
          }
        }
      }
    },
    select: {
      id: true,
      slug: true,
      module: {
        select: {
          course: {
            select: {
              id: true,
              slug: true
            }
          }
        }
      }
    }
  });

  if (!lesson) return;

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId
      }
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null
    },
    create: {
      userId: user.id,
      lessonId,
      completed,
      completedAt: completed ? new Date() : null
    }
  });

  const totalLessons = await prisma.lesson.count({
    where: {
      module: {
        courseId: lesson.module.course.id
      }
    }
  });
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: user.id,
      completed: true,
      lesson: {
        module: {
          courseId: lesson.module.course.id
        }
      }
    }
  });

  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  await prisma.enrollment.updateMany({
    where: {
      userId: user.id,
      courseId: lesson.module.course.id,
      status: {
        in: ["ACTIVE", "COMPLETED"]
      }
    },
    data: {
      progressPercent
    }
  });

  revalidatePath("/dashboard/corsi");
  revalidatePath(`/dashboard/corsi/${lesson.module.course.slug}`);
  revalidatePath(`/dashboard/corsi/${lesson.module.course.slug}/${lesson.slug}`);
}

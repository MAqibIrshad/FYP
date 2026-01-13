"use server"

import {courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { requireAdmin } from "../../../../data/admin/require-admin"
import {ApiResponse} from "../../../../../lib/types"
import arcjet, {detectBot, fixedWindow, request} from "@arcjet/next";
import { chapterSchema, ChapterSchemaType, lessonSchema, LessonSchemaType } from "../../../../../lib/zodSchema";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
const aj = arcjet({
    key: process.env.ARCJET_KEY!,  // or your Arcjet site key
    rules: [
        detectBot({
            mode: "LIVE",
            allow: [],
        }),
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5,
        }),
    ],
});
export async function EditCourse(data: CourseSchemaType, courseid: string): Promise<ApiResponse | undefined> {
    const user = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req)
        const result = courseSchema.safeParse(data);
        if (decision.isDenied()) {
            if (!decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting"
                }
            } else {
                return {
                    status: "error",
                    message: "You are a bot! if this is a mistake contact our support"
                }
            }
        }
    }
catch{
    return {
            status: "error",
            message: "Unauthorized"
    }
    }
}

export async function createChapter(
    values: ChapterSchemaType
): Promise<ApiResponse | undefined> 
{
    await requireAdmin();
     try{
        const result = chapterSchema.safeParse(values);

        if(!result.success)
        {
            return {
            status: "error",
            message: "Invalid Data"
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where:{
                    courseId: result.data.courseId,
                },
                select:{
                    position : true
                },

                orderBy: {
                    position: "desc"
                }
            });

            await tx.chapter.create({
                data: {
                    title:result.data.name,
                    courseId:result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1,

                }
            });
        });

        

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

         return {
            status: "success",
            message: "Chapter Created Successfully"
            }
     }

     catch{

     }
}

export async function createLesson(
    values: LessonSchemaType
): Promise<ApiResponse | undefined>
{
    await requireAdmin();
     try{
        const result = lessonSchema.safeParse(values);

        if(!result.success)
        {
            return {
            status: "error",
            message: "Invalid Data"
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where:{
                    courseId: result.data.chapterId,
                },
                select:{
                    position : true
                },

                orderBy: {
                    position: "desc"
                }
            });

            await tx.lesson.create({
                data: {
                    title:result.data.name,
                    videoKey: result.data.videokey,
                    thumbnailKey: result.data.thumbnailKey,
                    chapterId: result.data.chapterId,
                    position: (maxPos?.position ?? 0) + 1,

                }
            });
        });

        

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

         return {
            status: "success",
            message: "Lesson Created Successfully"
            }
     }

     catch{

     }
}




export async function deleteLesson(
  { chapterId, courseId, lessonId }: { chapterId: string; courseId: string, lessonId: string }
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    // Fetch course with chapters
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const lessons = chapterWithLessons.lessons;

    // Find chapter to delete
    const lessonToDelete = lessons.find((l) => l.id === lessonId);

    if (!lessonToDelete) {
      return {
        status: "error",
        message: "lesson not found in the chapter",
      };
    }

    // Remaining chapters for reorder
    const remainingLessons = lessons.filter((l) => l.id !== lessonId);

    const updates = remainingLessons.map((lesson, idx)=>{
      return prisma.lesson.update({
        where: {id: lesson.id},
        data: {position: idx + 1},
      })
    })
    await prisma.$transaction([
      ...updates,
     prisma.lesson.delete({
      where: {
        id: lessonId,
        chapterId: chapterId,
      }
     })

    ])
     
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted and reordered successfully",
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}



export async function deleteChapter(
  { chapterId, courseId }: { chapterId: string; courseId: string}
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    // Fetch course with chapters
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapters: {
          orderBy: { position: "asc" },
          select : { id: true, position: true}
         
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    const chapters = courseWithChapters.chapters;

    // Find chapter to delete
    const chapterToDelete = chapters.find((c) => c.id === chapterId);

    if (!chapterToDelete) {
      return {
        status: "error",
        message: "chapter not found in the chapter",
      };
    }

    // Remaining chapters for reorder
    const remainingChapters = chapters.filter((c) => c.id !== chapterId);

    const updates = remainingChapters.map((chapter, idx)=>{
      return prisma.chapter.update({
        where: {id: chapter.id},
        data: {position: idx + 1},
      })
    })
    await prisma.$transaction([
      ...updates,
     prisma.chapter.delete({
      where: {
        
        id: chapterId,
      }
     })

    ])
     
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted and reordered successfully",
    };
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}

// export async function editCourse(data: CourseSchemaType, courseid: string): Promise<ApiResponse>{
//     const user = await requireAdmin();
//
//     try{
//         const result = courseSchema.safeparse(data);
//
//         if( !result.success ){
//             return {
//                 status: "error",
//                 message: "Invalid data"
//             };
//         }
//
//         await prisma.course.update({
//             where:{
//                 id: courseid,
//                 userId: user.user.id,
//             },
//             data:{
//                 ...result.data,
//             }
//         })
//
//         return {
//             status: "success",
//             message: "Course Updated Successfully"
//         }
//     }
//     catch{
//         return {
//             status: "success",
//             message: "Failed to Update Course"
//         }
//     }
// }

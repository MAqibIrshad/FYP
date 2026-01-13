import {z} from 'zod'

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archive"] as const;
export const courseCategory = ["Development", "Business", "IT & Software", "Office Productivity", "Finance", "Design", "Marketing", "Health & Fitness", "Music", "Teaching & Academics"] as const;

export const courseSchema = z.object({

    title: z.string().min(3, { message: "Title must be at least 3 characters"}).
        max(100, {message: "Title must be at most 100 characters long"}),
    description: z.string().min(3).max(500, {message:"Description must be at most 500 characters long"}),
    fileKey: z.string().min(0),
    price: z.coerce.number().min(1),
    duration:z.coerce.number().min(1).max(500, {message:"Duration must be at most 500 hours"}),
    level: z.enum(courseLevels, {message:"Level is Required!"}),
    category: z.enum(courseCategory, {message:"Category is Required!"}),
    smallDescription: z.string().min(3).max(200),
    slug: z.string().min(3),
    status: z.enum(courseStatus),

})

export const chapterSchema = z.object({
    name: z.string().min(3, { message: "Name Must be at least 3 characters long"}),
    courseId: z.string().uuid({ message: "Invalid Course Id"}),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
  chapterId: z.string().uuid({ message: "Invalid chapter id" }),
  description: z.string().min(3).max(500).optional(),
  videokey:  z.string().optional(),
  thumbnailKey: z.string().optional()

});

export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type CourseSchemaType = z.infer<typeof courseSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
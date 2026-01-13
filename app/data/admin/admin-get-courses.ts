import "server-only"
import { requireAdmin } from "./require-admin";
import {prisma} from "@/lib/db";



export async function adminGetCourses(){
    await requireAdmin();
    const data = await prisma.course.findMany({
        orderBy:{
            createdAt: "desc"
        },
        select:{
            id: true,
            title: true, 
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            category: true,
            slug: true,

        }

       
    })
     return data;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourses>>[0]
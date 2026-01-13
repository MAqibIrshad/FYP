"use server"
import {AdminSingularCourseType} from "@/app/data/admin/admin-get-course";



import {courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import {ApiResponse} from "../../../../lib/types";



import { requireAdmin } from "../../../data/admin/require-admin";
import arcjet, { detectBot, fixedWindow, request, ArcjetRule } from "@arcjet/next";
import { prisma } from "@/lib/db";
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


export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse>{
    const session = await requireAdmin();
    try{
        const req = await request();

        const decision = await aj.protect(req)

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting"
                }
            }
            else {
                return {
                status: "error",
                message: "You are a bot! If mistake contact our support",
            }
            }

        }
        
        const validation = courseSchema.safeParse(values);

        if(!validation.success){
            // return {
            //     status: "error",
            //     message: "Invalid Form Data",
            // };

            throw new Error("Something Failed")
        }

        const data = await prisma.course.create({
            data: {
                ...validation.data,
                userId:  session?.user.id,
            }
        });

        console.log(session)

        return { 
            status: "success",
            message: "Course Created Successfully!",
        }
    } catch {
        
        return { 
            status: "error",
            message: "Failed to create course"
        }
    }
}
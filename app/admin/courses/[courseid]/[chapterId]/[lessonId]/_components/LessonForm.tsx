"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import Uploader from "@/app/file-upload/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { DataTable } from "@/components/sidebar/data-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Form, useForm } from "react-hook-form";
import z from "zod";
import { updateLesson } from "../actions";
import { toast } from "sonner";
import router from "next/router";
import { useTransition } from "react";


interface iAppProps {
    data: AdminLessonType;
    chapterId: string;
    courseId: string;
}


export function LessonForm({
    chapterId, data, courseId
}: iAppProps){
            const [ pending, startTransition ] = useTransition();
            


            function onSubmit(data: z.infer<typeof lessonSchema>) {
                            startTransition(async ()=> {
                                const { data: result, error } = await tryCatch(updateLesson(data, data.chapterId));
                    
                                if(error){
                                    toast.error("An unexpected error occurred. Please try again. ");
                                    return;
                                }
                    
                                if(result.status === "success"){
                                    toast.success(result.message)
                                    form.reset();
                                    router.push("/admin/courses")
                                }
                                else if(result.status === "error"){
                                    toast.error(result.message);
                                }
                            })
                    
                    
                        }



    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: data.title,
            chapterId: chapterId,
            courseId: courseId,
            description: data.description ?? undefined,
            videokey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,


        }
    })






    return (
        <div>
            <Link className={buttonVariants({ variant: "outline", className: "mb-6"})} href={`/admin/courses/${courseId}/edit`}>
                <ArrowLeft className="size-4" />


                <span>Go Back</span>
            </Link>


            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                

                    <CardDescription>
                        Configure the video and description for this lesson.
                    </CardDescription>

                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field })=>(
                                <FormItem>
                                    <FormLabel>Lesson Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="chapter xyx" {...field} />
                                    </FormControl>

                                </FormItem>
                                )}
                            >
                                
                            </FormField>




                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field })=>(
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <RichTextEditor field={field} />
                                    </FormControl>

                                    <FormMessage />

                                </FormItem>
                                )}
                            >
                                
                            </FormField>


                            <FormField
                                control={form.control}
                                name="thumbnailKey"
                                render={({ field })=>(
                                <FormItem>
                                    <FormLabel>Thumbnail Image</FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image"/>
                                    </FormControl>

                                </FormItem>
                                )}
                            >
                                
                            </FormField>



                            <FormField
                                control={form.control}
                                name="thumbnailKey"
                                render={({ field })=>(
                                <FormItem>
                                    <FormLabel>Video File</FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video"/>
                                    </FormControl>

                                </FormItem>
                                )}
                            >
                                
                            </FormField>


                            <Button type="submit">Save Lesson</Button>
                        </form>
                    </Form>
                </CardContent>


            </Card>
        </div>
    )
}





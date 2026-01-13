"use client";
import {Button, buttonVariants} from "@/components/ui/button";
import React, {useTransition} from 'react'
import Link from "next/link";
import {ArrowLeft, ArrowLeftIcon, Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DeepPartial, Resolver, useForm} from "react-hook-form";
import {courseCategory, courseSchema, CourseSchemaType, courseLevels, courseStatus} from "@/lib/zodSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Input} from "@/components/ui/input";
import slugify from 'slugify';
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {categories} from "@arcjet/next";
import { RichTextEditor } from '@/components/rich-text-editor/Editor';
import Uploader from "@/components/file-upload/Uploader";
import { adminGetCourses } from '../../../../../data/admin/admin-get-courses';
import { AdminSingularCourseType } from "@/app/data/admin/admin-get-course";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "../../../create/actions";
import { toast } from "sonner";


interface iAppProps  {
    data: AdminSingularCourseType
}

export default function EditCourseForm({data}: iAppProps){
        const [ pending, startTransition ] = useTransition();
        const router = useRouter();
    const form = useForm<CourseSchemaType>({
            resolver: zodResolver(courseSchema) as Resolver<CourseSchemaType>,
            defaultValues: {
                title: data.title,
                description: data.description,
                fileKey: data.fileKey,
                price: data.price,
                duration: data.duration,
                level: data.level,
                category: data.category as CourseSchemaType["category"],
                status: data.status,
                slug: data.slug,
                smallDescription: data.smallDescription
            } as DeepPartial<CourseSchemaType>,
        })
        function onSubmit(data: z.infer<typeof courseSchema>) {
                startTransition(async ()=> {
                    const { data: result, error } = await tryCatch(CreateCourse(data));
        
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
    return (
        <Form {...form}>
                                <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)} >
                                    <FormField control={form.control} name={"title"} render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl><Input placeholder={"Title"} {...field}/></FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
        
        
                                    )}>
                                    </FormField>
        
                                    <div className={"flex gap-4 items-end"}>
                                        <FormField control={form.control} name={"slug"} render={({field})=>(
                                            <FormItem className={"w-full"}>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl><Input placeholder={"Slug"} {...field}/></FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
        
        
                                        )}>
                                        </FormField>
                                        <Button type={"button"} className={"w-fit"} onClick={()=>{
                                            const titleValue = form.getValues("title")
                                            const slug = slugify(titleValue)
                                            form.setValue("slug", slug, {shouldValidate: true})
        
                                        }}>
                                            Generate Slug <SparkleIcon className={"ml-1"} size={16}></SparkleIcon>
                                        </Button>
                                    </div>
        
                                    <FormField control={form.control} name={"description"} render={({field})=>(
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Small Description</FormLabel>
                                            <FormControl><Textarea placeholder={"Small Description"} className={"min-h-[120]"} /></FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
        
        
                                    )}>
                                    </FormField>
        
                                    <FormField control={form.control} name={"fileKey"} render={({field})=>(
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Thumbnail Image</FormLabel>
                                            <FormControl>
                                                <Uploader courseId={data.id} onChange={field.onChange} value={field.value} fileTypeAccepted={"image"}/>
                                            </FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
        
        
                                    )}>
                                    </FormField>
        
                                    <FormField control={form.control} name={"description"} render={({field})=>(
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Big Description</FormLabel>
                                            <FormControl>
                                                <RichTextEditor field={field}/>
                                            </FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
        
        
                                    )}>
                                    </FormField>
        
                                    <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                                        <FormField control={form.control} name={"category"} render={({field})=>(
                                            <FormItem className={"w-full"}>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                                                    <FormControl>
                                                        <SelectTrigger className={"w-full"}>
                                                            <SelectValue placeholder={"Select Category"}></SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            courseCategory.map((category)=>(
                                                                <SelectItem key={category} value={category}>
                                                                    {category}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
        
                                                <FormMessage></FormMessage>
                                            </FormItem>
        
        
                                        )}>
                                        </FormField>
        
                                        <FormField control={form.control} name={"level"} render={({field})=>(
                                            <FormItem className={"w-full"}>
                                                <FormLabel>Level</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                                                    <FormControl>
                                                        <SelectTrigger className={"w-full"}>
                                                            <SelectValue placeholder={"Select Level"}>Beginner</SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            courseLevels.map((lvl)=>(
                                                                <SelectItem key={lvl} value={lvl}>
                                                                    {lvl}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
        
                                                <FormMessage></FormMessage>
                                            </FormItem>
        
        
                                        )}>
                                        </FormField>
        
                                        <FormField control={form.control} name={"duration"} render={({field})=>(
                                            <FormItem className={"w-full"}>
                                                <FormLabel>Duration (hours)</FormLabel>
                                                <FormControl><Input placeholder={"duration"} type="number" {...field}></Input></FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
        
        
                                        )}>
                                    </FormField>
        
                                        <FormField control={form.control} name={"price"} render={({field})=>(
                                            <FormItem className={"w-full"}>
                                                <FormLabel>Price ($)</FormLabel>
                                                <FormControl><Input placeholder={"Price"} type="number" {...field}></Input></FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
        
        
                                        )}>
                                        </FormField>
        
        
                                        <FormField control={form.control} name={"status"} render={({field})=>(
                                            <FormItem className={"w-full"}>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={"w-[1125]"}>
                                                            <SelectValue placeholder={"Select Status"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            courseStatus.map((status)=>(
                                                                <SelectItem key={status} value={status}>
                                                                    {status}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
        
                                                <FormMessage></FormMessage>
                                            </FormItem>
        
        
                                        )}>
                                        </FormField>
                                    </div>
                                    <Button type="submit" disabled={pending}>
                                        {pending?(
                                            <>
                                                Updating...
                                                <Loader2 className="animate-spin ml-1"></Loader2>
                                            </>
                                        )
                                        :
                                        (
                                        <>
                                            Update Course <PlusIcon className={"ml-1"} size={"16"}></PlusIcon>
                                        </>
                                        )}
                                                  
                                        
                                    </Button>
                                </form>
                            </Form>
    )
}
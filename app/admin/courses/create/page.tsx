"use client"

import React, {useTransition, useEffect, useState} from 'react'
import Link from "next/link";
import {ArrowLeftIcon, Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
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
import { RichTextEditor } from '@/components/rich-text-editor/Editor';
import Uploader from "@/components/file-upload/Uploader";
import { CreateCourse } from './actions';
import { tryCatch } from '@/hooks/try-catch';
import { toast } from 'sonner';
import {useRouter} from "next/navigation";
import { useConfetti } from '@/hooks/use-confetti';

const CreateCoursePage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [pending, startTransition] = useTransition();
    const router = useRouter();
    const {triggerConfetti} = useConfetti();

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema) as Resolver<CourseSchemaType>,
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 0,
            duration: 0,
            level: "Beginner",
            category: "Health & Fitness",
            status: "Draft",
            slug: "",
            smallDescription: ""
        } as DeepPartial<CourseSchemaType>,
    })

    // Fix 1: Ensure component is mounted before any state updates
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fix 2: Proper onSubmit handler

    // Fix 3: Safe slug generation function
    const generateSlug = () => {
        if (!isMounted) return;
        
        const titleValue = form.getValues("title");
        if (titleValue) {
            const slug = slugify(titleValue, { lower: true, strict: true });
            form.setValue("slug", slug, { shouldValidate: true });
        }
    }
function onSubmit(data: z.infer<typeof courseSchema>) {
                            startTransition(async ()=> {
                                const { data: result, error } = await tryCatch(CreateCourse(data));
                    
                                if(error){
                                    toast.error("An unexpected error occurred. Please try again. ");
                                    return;
                                }
                    
                                if(result.status === "success"){
                                    toast.success(result.message)
                                     triggerConfetti();
                                    form.reset();
                                    router.push("/admin/courses")
                                   
                                }
                                else if(result.status === "error"){
                                    toast.error(result.message);
                                }
                            })
                    
                    
                        }
    // Fix 4: Check for smallDescription field in your form
    // I notice you have "smallDescription" in defaultValues but no FormField for it
    // Added the missing FormField for smallDescription


    return (
        <>
            <div className={"flex items-center gap-4"}>
                <Link href={"/admin/courses"} className={buttonVariants({
                    variant: "outline",
                    size: "icon"
                })}>
                    <ArrowLeftIcon size={16} /> {/* Fixed size */}
                </Link>

                <h1 className={"text-2xl font-bold"}>Create Courses</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide basic information about the course</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control} 
                                name={"title"} 
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"Title"} {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className={"flex gap-4 items-end"}>
                                <FormField 
                                    control={form.control} 
                                    name={"slug"} 
                                    render={({field}) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder={"Slug"} {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button 
                                    type={"button"} 
                                    className={"w-fit"} 
                                    onClick={generateSlug} // Fixed: Use the safe function
                                >
                                    Generate Slug <SparkleIcon className={"ml-1"} size={16} />
                                </Button>
                            </div>

                            {/* Fix 5: Added missing smallDescription field */}
                            <FormField 
                                control={form.control} 
                                name={"smallDescription"} 
                                render={({field}) => (
                                    <FormItem className={"w-full"}>
                                        <FormLabel>Small Description</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder={"Small Description"} 
                                                className={"min-h-[120px]"} 
                                                {...field} // Added field spread
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <FormField 
                                control={form.control} 
                                name={"fileKey"} 
                                render={({field}) => (
                                    <FormItem className={"w-full"}>
                                        <FormLabel>Thumbnail Image</FormLabel>
                                        <FormControl>
                                            <Uploader 
                                                onChange={field.onChange}
                                                value={field.value}
                                                fileTypeAccepted="image"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <FormField 
                                control={form.control} 
                                name={"description"} 
                                render={({field}) => (
                                    <FormItem className={"w-full"}>
                                        <FormLabel>Big Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> 

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                                <FormField 
                                    control={form.control} 
                                    name={"category"} 
                                    render={({field}) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"w-full"}>
                                                        <SelectValue placeholder={"Select Category"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseCategory.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control} 
                                    name={"level"} 
                                    render={({field}) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"w-full"}>
                                                        <SelectValue placeholder={"Select Level"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseLevels.map((lvl) => (
                                                        <SelectItem key={lvl} value={lvl}>
                                                            {lvl}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control} 
                                    name={"duration"} 
                                    render={({field}) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Duration (hours)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder={"duration"} 
                                                    type="number" 
                                                    {...field}
                                                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control} 
                                    name={"price"} 
                                    render={({field}) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder={"Price"} 
                                                    type="number" 
                                                    {...field}
                                                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control} 
                                    name={"status"} 
                                    render={({field}) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"w-full"}> {/* Fixed width */}
                                                        <SelectValue placeholder={"Select Status"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseStatus.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <Button type="submit" disabled={pending || !isMounted}>
                                {pending ? (
                                    <>
                                        Creating...
                                        <Loader2 className="animate-spin ml-1" size={16} />
                                    </>
                                ) : (
                                    <>
                                        Create Course <PlusIcon className={"ml-1"} size={16} />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}

export default CreateCoursePage
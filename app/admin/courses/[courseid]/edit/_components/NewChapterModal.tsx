"use client";
import { useForm } from "react-hook-form";
import { createChapter, createLesson } from "../actions";
import { chapterSchema, ChapterSchemaType, LessonSchemaType } from "../../../../../../lib/zodSchema";
import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { tryCatch } from "@/hooks/try-catch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function NewChapterModal({ courseId}: {courseId: string}) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();
    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
        },
    })

    function handleOpenChange(open: boolean)
    {
        setIsOpen(open);
    }

    async function onSubmit(values: ChapterSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createChapter(values));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }


    // const [ isOpen, setIsOpen ] = useState(false);

    // function handleOpenChange(open: boolean){
    //     setIsOpen(open)
    // }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">

                    <Plus className="size-4" /> New Chapter
                
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                
                    <DialogTitle>Create new Chapter</DialogTitle>

                    <DialogDescription>
                        What would you like to name your chapter?
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control} 
                            name={"name"} 
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel></FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Chapter Name"} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={pending} type="submit">
                                {pending? "Saving...": "Save Change"}
                            </Button>
                        </DialogFooter>
                        </form>
                        
                        </Form>
            </DialogContent>

            
        </Dialog>
    )
}
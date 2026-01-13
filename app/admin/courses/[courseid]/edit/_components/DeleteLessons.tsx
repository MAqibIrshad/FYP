"use client";
import { useState, useTransition } from "react";
import { deleteLesson } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteLessons({chapterId, courseId, lessonId}: {chapterId: string, courseId: string, lessonId: string}){

const [ isOpen, setOpen ] = useState(false);

    const [pending, startTransition] = useTransition();

    async function onSubmit(){
        startTransition(async()=>{
            const { data: result, error} = await tryCatch(
                deleteLesson({chapterId, courseId, lessonId})
            )

            if(error){
            toast.error("An Unexpected Error occured Plz try again");
            return;
        }

        if(result.status === "success")
        {
            toast.success(result.message);
            setOpen(false);
        }
        else if(result.status === "error"){
            toast.error(result.message);
        }
        });

        
    }

return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
        <Button>
            <Trash2></Trash2>
        </Button>
    </AlertDialogTrigger>

    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Are you absolutely sure?
            </AlertDialogTitle>

            <AlertDialogDescription>
                {" "}
                This action cannot be undone. This will permanently delete this lesson.
            </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
            Cancel
        </AlertDialogFooter>
        <Button onSubmit={onSubmit} disabled={pending}>
            {pending? "Deleting...": "Continue"}
        </Button>

        
    </AlertDialogContent>
    </AlertDialog>
)
}
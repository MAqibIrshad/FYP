"use client";
import { useState, useTransition } from "react";
import { deleteChapter } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteChapter({chapterId, courseId}: {chapterId: string, courseId: string}){
    const [ isOpen, setOpen ] = useState(false);

    const [pending, startTransition] = useTransition();

    async function onSubmit(){
            startTransition(async()=>{
                const { data: result, error} = await tryCatch(
                    deleteChapter({chapterId, courseId})
                );

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
            }
    
            
            );
        }

    return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
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
                This action cannot be undone. This will permanently delete this chapter.
            </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
             <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
        <Button onClick={onSubmit} disabled={pending}>
            {pending? "Deleting...": "Continue"}
        </Button>
    </AlertDialogContent>
    </AlertDialog>
    )
    
    }

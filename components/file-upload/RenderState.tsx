"use client"
import React from 'react'
import {CloudUploadIcon, ImageIcon, Loader2, XIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import  Image  from 'next/image';
const RenderEmptyState = ({isDragActive}: {isDragActive: boolean}) => {
    return (
        <div className={"text-center"}>
            <div>
                <CloudUploadIcon className={cn(
                    "ml-33 mb-5 size-6 text-muted-foreground",
                    isDragActive && "text-primary"
                    )}>

                </CloudUploadIcon>
            </div>

            <p className={"text-base font-semibold text-foreground"}>
                Drop your files here or {" "}
                <span className={"text-primary font-bold cursor-pointer"}>click to upload</span>
            </p>
            <Button type={"button"} className={"mt-4"}>Select File</Button>
        </div>
    )
}



const RenderErrorState = () => {
    return (
        <div className={"text-destructive text-center"}>
            <div className={"flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4"}>
                <ImageIcon className={cn("size-6 text-destructive")}></ImageIcon>
            </div>
            <p className={"text-base font-semibold"}>
                Upload Failed!
            </p>
            <p className={"text-xl mt-1 text-muted-foreground"}>Something went wrong</p>
            <p className={"text-xl mt-3 text-muted-foreground"}>Click or drag file to retry</p>
            <Button type={"button"} className={"mt-4"}>Retry File Selection</Button>
        </div>
    )
}

export function RenderUploadState({ previewUrl, isDeleting, handleRemoveFile } : {previewUrl: string, isDeleting: boolean, handleRemoveFile: ()=> void}) {
 
    return (
        <div>
            <Image src={previewUrl} alt={"Uploaded File"} fill className={"object-contain p-2"} />
            <Button onClick={handleRemoveFile} disabled={isDeleting} variant={"destructive"} size={"icon"} className={cn("absolute top-4 right-4")}>
                {
                    isDeleting ? (
                        <Loader2 className="size-4 animate-spin" />
                    ):
                    (
                        <XIcon className="size-4"/>
                    )
                }
            </Button>
        </div>
    )
}

export function RenderUploadingState({progress, file} : {
    progress: number;
    file: File;
}) {
    return (
        <div className={"text-center flex justify-center items-center flex-col"}>
            <p>{progress}</p>
            <p className={"mt-2 text-sm font-medium text-foreground"}>Uploading...</p>
            <p className={"mt-1 text-xs text-muted-foreground truncate max-w-xs"}>{file.name}</p>
        </div>
    )
}

export {RenderEmptyState, RenderErrorState}


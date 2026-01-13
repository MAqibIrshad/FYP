"use client";

import React, {useCallback, useEffect, useState} from 'react'
import {FileRejection, useDropzone} from "react-dropzone";
import {cn} from "@/lib/utils";
import {Card, CardContent} from '../ui/card';
import {
    RenderEmptyState,
    RenderErrorState,
    RenderUploadingState,
    RenderUploadState
} from "@/components/file-upload/RenderState";
import {toast} from "sonner";
import { v4 as uuidv4 } from 'uuid'
import { useConstructUrl } from '../../hooks/construct-url';
interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
    fileTypeAccepted: "image"| "video";
    courseId: string;
}

import axios from 'axios'


    interface UploaderState {
        id: string | null;
        file: File | null;
        uploading: boolean;
        progress: number;
        key?: string;
        isDeleting: boolean;
        error: boolean;
        objectUrl?: string;
        fileType: "image" | "video"
    }
    
    

   
const Uploader = ({ onChange, value, courseId, fileTypeAccepted }: iAppProps) => {
      const fileUrl = useConstructUrl(value as string);
      console.log(fileUrl)

const [fileState, setFileState] = useState<UploaderState>({
  error: false,
  file: null,
  id: null,
  uploading: false,
  progress: 0,
  isDeleting: false,
  fileType: "image",
  key: value,
  objectUrl: fileUrl ?? undefined,
});

    useEffect(() => {
    return () => {
        if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl)
        }
        onChange?.("")
    }
}, [fileState.objectUrl]);

   
  
    const onDrop = useCallback(
        (acceptedFiles: File[])=>{
        if(acceptedFiles.length > 0){
            const file = acceptedFiles[0];

                setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting:false,
                fileType:"image"

            });
            uploadFile(file);
        }}, [fileState.objectUrl]);
        const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept:{"image/*": []}, maxFiles:1, maxSize:5*1024 * 1024, onDropRejected: rejectedFiles, disabled: fileState.uploading ||  !!fileState.objectUrl})



    async function uploadFile(file: File) {
    setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
    }));

    try {
        // 1️⃣ Get presigned URL from your server
        const presignedResponse = await axios.post("/api/s3/upload-url", {
            fileName: file.name,             
            contentType: file.type,
        }, {
            headers: { "Content-Type": "application/json" },
        });     

        const { presignedUrl, key } = presignedResponse.data;

        if (!presignedUrl) {
            toast.error("Failed to access presigned URL");
            setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: true,
            }));
            return;
        }

        // 2️⃣ Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64File = Buffer.from(arrayBuffer).toString("base64");

        // 3️⃣ Upload file to API route
        await axios.post("/api/s3/upload", {
            presignedUrl,
            fileName: file.name,
            fileType: file.type,
            file: base64File,
        }, {
            headers: { "Content-Type": "application/json" },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentageCompleted = (progressEvent.loaded / progressEvent.total) * 100;
                    setFileState((prev) => ({
                        ...prev,
                        progress: Math.round(percentageCompleted),
                    }));
                }
            },
        });

        // 4️⃣ Update state after successful upload
        setFileState((prev) => ({
            ...prev,
            progress: 100,
            uploading: false,
            key: key,
            objectUrl: useConstructUrl(key) ?? undefined,
        }));

        onChange?.(key);
        toast.success("File uploaded successfully");
        await axios.patch(`/courses/${courseId}`, { fileKey: key });
    } catch (err: any) {
        console.error(err);
        toast.error("Something went wrong!");
        setFileState((prev) => ({
            ...prev,
            progress: 0,
            uploading: false,
            error: true,
        }));
    }
}


    async function handleRemoveFile(){

        if(fileState.isDeleting || !fileState.objectUrl) return;

        try{
             const response = await fetch("/api/s3/delete", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({
                key: fileState.key,
                })
            })

            if(!response.ok){
                toast.error("Failed to remove file from storage");
                 setFileState((prev)=>({
                ...prev,
                isDeleting: true,
            }))
            }

            setFileState((prev)=>({
                file: null,
                uploading: false,
                progress: 0,
                objectUrl: undefined,
                error: false,
                fileType: "image",
                id: null,
                isDeleting: false,
            }));
            toast.success("File Removed Successfully")

           
        }
        catch{
            toast.success("Error Removing File. please try again!")
            setFileState((prev)=>({
                ...prev,
                isDeleting: false,
                error: true,
            }))
        }
    }

    function rejectedFiles(fileRejection: FileRejection[]){
        if(fileRejection.length){
            const tooManyFiles = fileRejection.find(
                (rejection)=> rejection.errors[0].code === "too-many-files"
            );

            if(tooManyFiles){
                toast.error("Too many files selected, max is 1");
            }

            const fileSizeTooBig = fileRejection.find(
                (rejection)=> rejection.errors[0].code === "file-too-large"
            );

            if(fileSizeTooBig) {
                toast.error("File Size exceeds the limit")
            }
        }

    }
    function renderContent(){
        if(fileState.uploading){
            return (
                <RenderUploadingState file={fileState.file as File} progress={fileState.progress}></RenderUploadingState>
            )
        }

        if(fileState.error){
            return <RenderErrorState />
        }

        if(fileState.objectUrl){
            return <RenderUploadState 
                handleRemoveFile={handleRemoveFile} 
                previewUrl={fileState.objectUrl}
                isDeleting={fileState.isDeleting}
            />
        }

        return <RenderEmptyState isDragActive/>


    }
   


    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-65",
            isDragActive ? 'border-primary bg-primary/10 border-solid' : "border-border hover:border-primary"
            )}>
            <CardContent className={"flex items-center justify-center h-full w-full p-4"}>

            <input {...getInputProps()} />
            {
                // isDragActive ?
                //     <p>Drop the files here ...</p> :
                //     <RenderEmptyState isDragActive={isDragActive} />

                renderContent()
            }


            </CardContent>
        </Card>
    )
}
export default Uploader;

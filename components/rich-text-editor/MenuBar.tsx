"use client"
import React from 'react'
import { type Editor} from "@tiptap/react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import { Toggle } from '../ui/toggle';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Italic,
    ListIcon,
    ListOrdered, Redo,
    Strikethrough, Undo
} from "lucide-react";
import {cn} from "@/lib/utils";
import {left} from "effect/Either";
import {Button} from "@/components/ui/button";

interface iAppProps {
    editor: Editor | null;
}
const MenuBar = ({editor}: iAppProps) => {
    if(!editor){
        return null;
    }
    return (
        <div className={"border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center"}>
            <TooltipProvider>
                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("bold") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive("bold"))} onPressedChange={()=> editor.chain().focus().toggleBold().run()}>
                                <Bold></Bold>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("italic") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive("italic"))} onPressedChange={()=> editor.chain().focus().toggleItalic().run()}>
                                <Italic></Italic>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("strike") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive("strike"))} onPressedChange={()=> editor.chain().focus().toggleStrike().run()}>
                                <Strikethrough></Strikethrough>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strike</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("heading") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive("heading", {level: 1}))} onPressedChange={()=> editor.chain().focus().toggleHeading({level: 1}).run()}>
                                <Heading1Icon></Heading1Icon>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("heading") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive("heading", {level: 2}))} onPressedChange={()=> editor.chain().focus().toggleHeading({level: 2}).run()}>
                                <Heading2Icon></Heading2Icon>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("heading") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive("heading", {level: 3}))} onPressedChange={()=> editor.chain().focus().toggleHeading({level: 3}).run()}>
                                <Heading3Icon></Heading3Icon>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>


                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("bulletList") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive("bulletList"))} onPressedChange={()=> editor.chain().focus().toggleBulletList().run()}>
                                <ListIcon></ListIcon>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("orderedList") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive("orderedList"))} onPressedChange={()=> editor.chain().focus().toggleOrderedList().run()}>
                                <ListOrdered></ListOrdered>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Order List</TooltipContent>
                    </Tooltip>
                </div>
                <div className={"w-px h-6 bg-border mx-2"}></div>

                <div className={"flex flex-wrap gap-1"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("orderedList") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive({textAlign: "left"}))} onPressedChange={()=> editor.chain().focus().setTextAlign("left").run()}>
                                <AlignLeft></AlignLeft>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Left</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("orderedList") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive({textAlign: "center"}))} onPressedChange={()=> editor.chain().focus().setTextAlign("center").run()}>
                                <AlignCenter></AlignCenter>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Center</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle className={cn(
                                editor.isActive("orderedList") && "bg-muted text-muted-foreground"
                            )} size={"sm"} pressed={(editor.isActive({textAlign: "right"}))} onPressedChange={()=> editor.chain().focus().setTextAlign("right").run()}>
                                <AlignRight></AlignRight>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Right</TooltipContent>
                    </Tooltip>

                    <div className={"w-px h-6 bg-border mx-2"}>
                    </div>

                    <div className={"flex flex-wrap gap-1"}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button disabled={!editor.can().undo()} onClick={()=> editor.chain().focus().undo().run()} size={"sm"} variant={"ghost"} type={"button"}>
                                    <Undo></Undo>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Undo</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button disabled={!editor.can().redo()} onClick={()=> editor.chain().focus().redo().run()} size={"sm"} variant={"ghost"} type={"button"}>
                                    <Redo></Redo>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Redo</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </TooltipProvider>

        </div>
    )
}
export default MenuBar

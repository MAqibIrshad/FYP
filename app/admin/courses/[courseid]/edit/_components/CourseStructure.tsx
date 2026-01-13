"use client";

import React, { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  rectIntersection,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
  SortableContextProps,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { GripVertical, ChevronDown, ChevronRight, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { NewChapterModal } from "./NewChapterModal";
import { NewLessonModal } from "./NewLessonModal";
import { DeleteChapter } from "./DeleteChapter";
import { DeleteLessons } from "./DeleteLessons";
import { AdminSingularCourseType } from "@/app/data/admin/admin-get-course";
import { createLesson } from "../actions";

type LessonItem = { id: string; title: string; order: number };
type ChapterItem = { id: string; title: string; order: number; isOpen: boolean; lessons: LessonItem[] };

interface SortableItemProps {
  id: string;
  children: (listeners: any) => React.ReactNode;
  data?: { type: "chapter" | "lesson"; chapterId?: string };
  className?: string;
}

function SortableItem({ id, children, data, className }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, data });
  const style: React.CSSProperties = { transform: transform ? `translate3d(${transform.x}px, ${transform.y}px,0)` : undefined, transition };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className={cn(className, isDragging && "z-10")} style={style}>
      {children(listeners)}
    </div>
  );
}

interface CourseStructureProps {
  data: AdminSingularCourseType;
}

export function CourseStructure({ data }: CourseStructureProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const initialItems: ChapterItem[] =
    data.chapters?.map(ch => ({
      id: ch.id,
      title: ch.title,
      order: ch.position,
      isOpen: true,
      lessons: ch.lessons.map(l => ({ id: l.id, title: l.title, order: l.position }))
    })) || [];

  const [items, setItems] = useState<ChapterItem[]>(initialItems);

  function toggleChapter(chapterId: string) {
    setItems(prev => prev.map(ch => (ch.id === chapterId ? { ...ch, isOpen: !ch.isOpen } : ch)));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const prevItems = [...items];
    const activeId = active.id as string;
    const overId = over.id as string;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "chapter") {
      const oldIdx = items.findIndex(ch => ch.id === activeId);
      const newIdx = items.findIndex(ch => ch.id === overId);
      const updated = arrayMove(items, oldIdx, newIdx).map((c, i) => ({ ...c, order: i + 1 }));
      setItems(updated);
      toast.success("Chapters reordered");
      return;
    }

    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const targetChapterId = over.data.current?.chapterId;
      if (!chapterId || chapterId !== targetChapterId) return toast.error("Cannot move lessons between chapters");

      const chapterIndex = items.findIndex(ch => ch.id === chapterId);
      const chapter = items[chapterIndex];
      const oldLessonIdx = chapter.lessons.findIndex(l => l.id === activeId);
      const newLessonIdx = chapter.lessons.findIndex(l => l.id === overId);

      const reorderedLessons = arrayMove(chapter.lessons, oldLessonIdx, newLessonIdx).map((l, i) => ({ ...l, order: i + 1 }));
      const newItems = [...items];
      newItems[chapterIndex] = { ...chapter, lessons: reorderedLessons };
      setItems(newItems);
      toast.success("Lessons reordered");
      return;
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
      <Card>
        <CardHeader className="flex items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
          <NewChapterModal courseId={data.id} />
        </CardHeader>

        <CardContent>
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            {items.map(chapter => (
              <SortableItem key={chapter.id} id={chapter.id} data={{ type: "chapter" }}>
                {listeners => (
                  <Card className="mb-4">
                    <Collapsible open={chapter.isOpen} onOpenChange={() => toggleChapter(chapter.id)}>
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <button {...listeners} className="cursor-grab opacity-60 hover:opacity-100">
                            <GripVertical className="size-4" />
                          </button>
                          <CollapsibleTrigger asChild>
                            <Button size="icon" variant="ghost">
                              {chapter.isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="pl-2 cursor-pointer hover:text-primary">{chapter.title}</p>
                        </div>
                        <DeleteChapter chapterId={chapter.id} courseId={data.id} />
                      </div>

                      <CollapsibleContent>
                        <div className="p-2">
                          <SortableContext items={chapter.lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
                            {chapter.lessons.map(lesson => (
                              <SortableItem key={lesson.id} id={lesson.id} data={{ type: "lesson", chapterId: chapter.id }}>
                                {lessonListeners => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button size="icon" variant="ghost" {...lessonListeners}>
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link href={`/admin/courses/${data.id}/${chapter.id}/${lesson.id}`}>
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLessons chapterId={chapter.id} courseId={data.id} lessonId={lesson.id} />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>

                          {/* New Lesson Modal */}
                          <NewLessonModal chapterId={chapter.id} courseId={data.id} />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}

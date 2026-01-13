"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-courses';
import { useConstructUrl } from '@/hooks/construct-url';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRight, MoreVertical, Pencil, School, TimerIcon, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface iAppProps {
  data: AdminCourseSingularType;
}

export function AdminCourseCard({ data }: iAppProps) {
  const thumbnail_url = useConstructUrl(data.fileKey);
  console.log("Thumbnail URL:", thumbnail_url, data);

  return (
    <Card className="group relative py-0 gap-0">
      {/* Dropdown menu */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <a href={`/admin/courses/${data.id}/edit`}>
                <Pencil className="size-4 mr-2" /> Edit Course
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <a href={`/admin/courses/${data.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive" /> Delete Course
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thumbnail Image */}
      {thumbnail_url ? (
        <Image
          src={thumbnail_url}
          alt={data.title || "Course Thumbnail"}
          width={600}
          height={400}
          className="w-full rounded-t-lg aspect-video h-full object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center text-muted-foreground">
          No Image
        </div>
      )}

      {/* Card content */}
      <CardContent className="p-4">
        <a
          href={`/admin/courses/${data.id}/edit`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </a>

        <p className="line-clamp-2 text-muted-foreground text-sm leading-tight mt-2">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>

          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>

        <a
          className={buttonVariants({ className: "w-full mt-4" })}
          href={`/admin/courses/${data.id}/edit`}
        >
          Edit Course <ArrowRight className="size-4" />
        </a>
      </CardContent>
    </Card>
  );
}

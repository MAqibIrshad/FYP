"use server"
import { adminGetCourse } from "../../../../data/admin/admin-get-course"
import EditCourseForm from "./_components/EditCourseForm";
import {CourseStructure} from "./_components/CourseStructure";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Params = Promise<{ courseid: string }>
export default async function EditRoute({params}: {params: Params}){
    const {courseid} = await params;
    const data = await adminGetCourse(courseid);
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Course: <span className="text-primary underline">{data.title}</span></h1>
        
            <Tabs defaultValue="basic info" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>

                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info.</CardTitle>
                            <CardDescription>Provide Basic Information about the course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={data} />
                        </CardContent>


                    </Card>
                </TabsContent>

                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>Here you can update your course structure</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructure data={data}></CourseStructure>
                        </CardContent>


                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
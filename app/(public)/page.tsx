'use client'

import {ModeToggle} from '@/components/ui/theme-toggle'
import {Button, buttonVariants} from "@/components/ui/button";
import {useSession, authClient, signIn} from "@/lib/auth-client";

import {router} from "next/client";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface featureProps {
    title: string,
    description: string,
    icon: string,
}

const features : featureProps[] = [
    {
        title: "Comprehensive Courses",
        description: "Access a wide range of carefully curated courses designed by industry experts.",
        icon: "📚"
    },
    {
        title: "Interactive Learning",
        description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
        icon: "🎮"
    },
    {
        title: "Progress Tracking",
        description: "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
        icon: "📊"
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
        icon: "👥"
    },
]
export default function Home() {
    // const router = useRouter();
    // const { data: session } = useSession();
    // async function signOut() {
    //     await authClient.signOut({
    //         fetchOptions: {
    //             onSuccess: () => {
    //                 router.push("/login");
    //                 toast.success("Sign out successfully!")
    //             }
    //         }
    //     })
    //
    // }
    return (
        <>
            <section className={"relative py-20"}>
                <div className={"flex flex-col items-center text-center space-y-8"}>
                    <Badge variant={"outline"}>The Future of Distant Learning</Badge>
                    <h1 className={"text-4xl md:text-6xl font-bold tracking-tight"}>Elevate your Learning Experience</h1>
                    <p className={"max-w-[700px] md:text-xl text-muted-foreground"}>Discover new way to learn with our modern , interactive learning management system. Access high-quality courses anytime, anywhere.</p>
                    <div className={"flex flex-col sm:flex-row gap-4 mt-8"}>
                        <Link className={buttonVariants({
                            size: "lg",
                            variant:"outline",
                        })}  href={"/courses"}>
                            Explore Courses
                        </Link>
                        <Link className={buttonVariants({
                            size: "lg",
                            variant:"default",
                        })}  href={"/courses"}>
                            Sign in
                        </Link>

                    </div>
                </div>
            </section>

            <section className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32"}>
                {
                    features.map((feature, idx)=>(
                        <Card key={idx} className={"hover:shadow-lg transition-shadow"}>
                            <CardHeader>
                                <div className={"text-4xl mb-4"}>{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{feature.description}</p>
                            </CardContent>
                        </Card>
                    )
                )
                }
            </section>
        </>
    );
}

'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {GithubIcon, Loader, Loader2, Send} from "lucide-react";
import {Label} from "@/components/ui/label";
import {useState, useTransition} from "react";
import {authClient} from "@/lib/auth-client";
import {auth} from '@/lib/auth'
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export function  LoginForm(){
    const router = useRouter();
    const[githubPending, startGHubTransition] = useTransition();
    const [email, setEmail] = useState<string>("");
    const [emailPending, startEmailTransition] = useTransition();
    async function signInWithGithub(){
        startGHubTransition(async ()=>{
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Login Successful!");
                    },
                    onError: (err) => {
                        toast.error(err.error.message);
                    },

                }
            })
        })

    }

    async function signInWithEmail() {
        startEmailTransition(async ()=>{
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: ()=>{
                        toast.success("OTP sent successfully!");
                        router.push(`/verify-request?email=${email}`);
                    },

                    onError: ()=> {
                        toast.error("Error sending email!");
                    }
                }
            })
        })
    }


    return(
        <Card className={"w-100"}>
        <CardHeader>
            <CardTitle className={"text-xl"}>
                Welcome Back!
            </CardTitle>
            <CardDescription>
                Login with your Github Email Account
            </CardDescription>
        </CardHeader>
    <CardContent className={"flex flex-col gap-4"}>
        <Button disabled={githubPending} onClick={signInWithGithub} className={"w-full"} variant={"outline"}>

            {githubPending ? (
                    <>
                        <Loader className={"size-4 animate-spin"}>Loading...</Loader>
                    </>):

                <>
                    <GithubIcon className={"size-4"}></GithubIcon>
                    Sign in with Github
                </>
            }
        </Button>
        <div className={"relative text-center text-sm after:absolute after:inset-0 after:top-1/2after:z-0 after:flex after:items-center after:border-t after:border-border"}>
            <span className={"relative z-10 bg-card px-2 bottom-2 text-muted-foreground"}>Or continue with</span>
        </div>

        <div className={"grid gap-3"}>
            <div className={"grid gap-2"}>
                <Label htmlFor={"email"}>Email</Label>
                <input value={email} onChange={(e)=> setEmail(e.target.value)} required className={"rounded-sm px-2 py-2 border"} type={"email"} placeholder={"m@example.com"} />
            </div>
            <Button onClick={signInWithEmail} disabled={emailPending}>{
                emailPending?
                    (
                        <>
                            <Loader2 className={"size-4 animate-spin"}></Loader2>
                            <span>Loading...</span>
                        </>
                    ):
                    (
                        <>
                            <Send className={"size-4"}></Send>Continue with Email

                        </>
                    )
            }</Button>
        </div>
    </CardContent>
        </Card>
    )
}
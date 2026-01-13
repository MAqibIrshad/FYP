'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {useRouter, useSearchParams} from "next/navigation";
import { toast } from "sonner";
import {Loader2} from "lucide-react";

export default function VerifyRequest() {
    const [otp, setOTP] = useState<string>("");
    const [emailPending, startTransition] = useTransition();
    const params = useSearchParams();
    const email: any = params.get("email");
    const router = useRouter();
    const isOTPCompleted = otp.length === 6;

    async function verifyOTP() {
        startTransition(async () => {
            try {

                await authClient.signIn.emailOtp(
                    {
                        email,
                        otp, // user input
                    },
                    {
                        onSuccess: () => {
                            toast.success("Email verified successfully!");
                            router.push("/");
                        },
                        onError: () => {
                            toast.error("Verification Failed");
                        },
                    }
                );
            } catch (error) {
                console.error(error);
                toast.error("Error verifying OTP");
            }
        });
    }


    return (
        <Card className={"w-full mx-auto"}>
            <CardHeader className={"text-center"}>
                <CardTitle className={"text-xl"}>
                    Please check your email!
                </CardTitle>
                <CardDescription>
                    We have sent a verification code on your email! Please open the email and paste below!
                </CardDescription>
            </CardHeader>
            <CardContent className={"space-y-6"}>
                <div className={"flex flex-col items-center space-y-2"}>
                    <InputOTP value={otp} onChange={(value)=> setOTP(value)} maxLength={6} className={"gap-2 "}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />

                            <InputOTPSlot index={1} />

                            <InputOTPSlot index={2} />

                        </InputOTPGroup>

                        <InputOTPGroup>
                            <InputOTPSlot index={3} />

                            <InputOTPSlot index={4} />

                            <InputOTPSlot index={5} />

                        </InputOTPGroup>
                    </InputOTP>
                    <p className={"text-sm text-muted-foreground"}>Enter 6-Digit code sent to your email.</p>
                </div>
                <Button className={"w-full"} onClick={verifyOTP} disabled={emailPending || !isOTPCompleted}>{
                    emailPending? (
                        <>
                            <Loader2 className={"size-4 animate-spin"}></Loader2>
                            <span>Loading...</span>
                        </>
                    ):
                        "Verify Request"
                }</Button>
            </CardContent>
        </Card>
    )
}
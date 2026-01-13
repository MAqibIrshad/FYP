import {ReactNode} from 'react'
import Link from 'next/link'
import {ArrowLeft} from "lucide-react";
import {buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import logo from '../../../public/logo.png'
const AuthLayout = ({ children }:{ children: ReactNode}) => {
    return (
    <div>
        <div className={"relative flex min-h-svh flex-col items-center justify-center"}>
            <div className={"flex w-full max-w-sm flex-col gap-6"}>
                <Link href={"/"} className={buttonVariants({
                    variant:"outline",
                    className: "absolute top-4 left-4"

                })}>
                    <ArrowLeft className={"size-4"}></ArrowLeft>
                    Back
                </Link>
            </div>
            <Link href={"/"} className={"relative bottom-5 flex items-center gap-2 self-center font-medium"}>
                <Image src={logo} width={42} height={42} className={"rounded-xl"} alt={"Logo"}></Image>
                GengrowLMS
            </Link>
            {children}
            <div className={"relative top-8 text-balance text-center text-xs text-muted-foreground"}>
                By clicking continue, you agree to our <span className={"hover:text-primary hover:underline"}>Terms of service</span>
                {" "}
                and <span>Privacy Policy</span>.
            </div>
        </div>
    </div>
    )
}
export default AuthLayout;

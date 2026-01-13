'use client'
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import logo from '../../../public/logo_tr.png'
import {ModeToggle} from "@/components/ui/theme-toggle";
import {authClient} from "@/lib/auth-client";
import {buttonVariants} from "@/components/ui/button";
import Component from './UserDropdown'
const navigationItems = [
    {name: 'Home', href:"/"},
    {name: "Courses", href: "/courses"},
    {name :"Dashboard", href:"/admin"}
];
const Navbar = () => {
    const { data:session, isPending } = authClient.useSession();
    return (
        <header className={"flex sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"}>
            <div className={"container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8"}>
                <Link href={"/"} className={"flex items-center space-x-2 mr-4"}>
                    <Image alt="img" src={logo} className={"size-9 rounded-lg"}/>
                    <span className={"font-bold"}>GengrowLMS.</span>
                </Link>
            </div>

            <nav className={"hidden md:flex md:flex-1 md:items-center md:justify-between"}>
                <div className={"border-0 flex items-center justify-between absolute left-60 z-10 space-x-5"}>
                    {
                        navigationItems.map((item)=>(
                            <Link href={item.href} key={item.name} className={"text-sm font-medium transition-colors hover:text-primary"}>
                                {item.name}
                            </Link>
                        ))
                    }
                </div>

                <div className={"flex items-center space-x-0 gap-2 p-5 absolute right-0"}>
                    <ModeToggle />

                    {
                        isPending? null: session? (
                            <Component email={session.user.email} image={session.user.image || ""} name={session.user.name} />
                        ):
                            (
                                <>
                                    <Link href={"/login"} className={buttonVariants({
                                        variant: "secondary"
                                    })}>Login</Link>
                                    <Link href={"/login"} className={buttonVariants({
                                        variant: "default"
                                    })}>Get Started</Link>
                                </>
                            )
                    }
                </div>
            </nav>
        </header>
    )
}
export default Navbar

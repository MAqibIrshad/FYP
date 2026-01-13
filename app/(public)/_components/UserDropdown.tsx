import {
    BoltIcon,
    BookOpenIcon,
    ChevronDownIcon, Home,
    Layers2Icon, LayoutDashboard,
    LogOutIcon,
    PinIcon,
    UserPenIcon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import { useRouter} from 'next/navigation'

interface iAppProps {
    image: string,
    name: string,
    email: string
}
export default function Component({image, name, email}: iAppProps) {
    const router = useRouter();
    async function signOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    toast.success("Sign out successfully!")
                },
                onError: () =>{
                    toast.error("Failed to Sign Out!")
                }
            }
        })

    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className={"m-0"}>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage src={image} alt="Profile image" />
                        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"} className="max-w-48">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">{name}
          </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
           {email}
          </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={"/"}>
                        <Home size={16} className="opacity-60" aria-hidden="true" />
                        <span>Home</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"/courses"}>
                        <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Courses</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"/dashboard"}>
                        <LayoutDashboard size={16} className="opacity-60" aria-hidden="true" />
                        <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild onClick={signOut}>
                    <Link href={"/"}>
                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                    <span>Logout</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

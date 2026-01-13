// "use client"

// import {
//   IconCreditCard, IconDashboard,
//   IconDotsVertical,
//   IconLogout,
//   IconNotification,
//   IconUserCircle,
// } from "@tabler/icons-react"

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar"
// import {authClient} from "@/lib/auth-client";
// import Link from "next/link";
// import {HomeIcon, Tv2} from "lucide-react";
// import {useSignOut} from "@/hooks/use-signout";

// export function NavUser() {
//   const { isMobile } = useSidebar()
//   const { data:session, isPending } = authClient.useSession();
//   const handleSignOut = useSignOut();

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//               >
//             <div className="flex items-center gap-2 w-full">
//               <Avatar className="h-8 w-8 rounded-lg">
//                 <AvatarImage
//                     src={session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`}
//                     alt={session?.user.name}
//                 />
//                 <AvatarFallback className="rounded-lg">
//                   {session?.user.name && session?.user.name.length > 0
//                       ? session.user.name.charAt(0).toUpperCase()
//                       : session?.user.email.charAt(0).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-medium">{session?.user.name}</span>
//                 <span className="text-muted-foreground truncate text-xs">
//         {session?.user.email}
//       </span>
//               </div>

//               <IconDotsVertical className="ml-auto size-4" />
//             </div>
//           </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage src={session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`} alt={session?.user.name} />
//                   <AvatarFallback className="rounded-lg">{session?.user.name && session?.user.name.length > 0 ? session.user.name.charAt(0).toUpperCase() : session?.user.email.charAt(0).toUpperCase()}</AvatarFallback>
//                 </Avatar>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-medium">{session?.user.name && session.user.name.length > 0? session.user.name: session?.user.email.split("@")[0]}</span>
//                   <span className="text-muted-foreground truncate text-xs">
//                     {session?.user.email}
//                   </span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem asChild>
//                 <Link href={"/lms/public"}>
//                   <HomeIcon />
//                   Homepage
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href={"/admin"}>
//                 <IconDashboard />
//                 Dashboard
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href={"/admin/courses"}>
//                 <Tv2 />
//                Courses
//                 </Link>
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleSignOut}>
//               <IconLogout />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }

// components/sidebar/nav-user.tsx
"use client"

import { useState, useEffect } from "react"
import {
  IconCreditCard,
  IconDashboard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { HomeIcon, Tv2 } from "lucide-react"
import { useSignOut } from "@/hooks/use-signout"
import { Skeleton } from "@/components/ui/skeleton"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, isPending } = authClient.useSession()
  const handleSignOut = useSignOut()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Show loading state during SSR and initial client render
  if (!isMounted || isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="pointer-events-none">
            <div className="flex items-center gap-2 w-full">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-2 w-full">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.user?.image ?? `https://avatar.vercel.sh/${session?.user?.email}`}
                    alt={session?.user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {session?.user?.name && session.user.name.length > 0
                      ? session.user.name.charAt(0).toUpperCase()
                      : session?.user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{session?.user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session?.user?.email}
                  </span>
                </div>

                <IconDotsVertical className="ml-auto size-4" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage 
                    src={session?.user?.image ?? `https://avatar.vercel.sh/${session?.user?.email}`} 
                    alt={session?.user?.name} 
                  />
                  <AvatarFallback className="rounded-lg">
                    {session?.user?.name && session.user.name.length > 0 
                      ? session.user.name.charAt(0).toUpperCase() 
                      : session?.user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user?.name && session.user.name.length > 0 
                      ? session.user.name 
                      : session?.user?.email?.split("@")[0]}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/lms/public"}>
                  <HomeIcon className="size-4" />
                  Homepage
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/admin"}>
                  <IconDashboard className="size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/admin/courses"}>
                  <Tv2 className="size-4" />
                  Courses
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
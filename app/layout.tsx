// "use client";

// import {ReactNode} from "react";
// import "./globals.css";
// import {ThemeProvider} from "@/components/ui/theme-provider";
// import {Toaster} from "@/components/ui/sonner";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//       <>
//           <html lang="en" suppressHydrationWarning>
//           <head />
//           <body>
//           <ThemeProvider
//               attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange
//           >
//               {children}
//               <Toaster closeButton postion="bottom-center" />
//           </ThemeProvider>
//           </body>
//           </html>
//       </>
//   );
// }

// app/layout.tsx

"use client"
import { ReactNode } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
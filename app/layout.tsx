import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ClerkProvider appearance={{ theme: shadcn }}>
          <ThemeProvider>
            <TooltipProvider>
              <header className="border-b">
                <nav
                  aria-label="Main navigation"
                  className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
                >
                  <Link href="/" className="font-semibold">
                    AI Assistant
                  </Link>
                  <div className="flex items-center gap-2">
                    <Show when="signed-out">
                      <SignInButton>
                        <Button variant="ghost" size="sm">
                          Sign in
                        </Button>
                      </SignInButton>
                      <SignUpButton>
                        <Button size="sm">Sign up</Button>
                      </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                      <Link
                        href="/dashboard"
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        Dashboard
                      </Link>
                      <UserButton />
                    </Show>
                  </div>
                </nav>
              </header>
              {children}
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}

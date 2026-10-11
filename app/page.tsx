import { Show } from "@clerk/nextjs"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-16">
      <h1 className="text-3xl font-semibold">Welcome to AI Assistant</h1>
      <p className="max-w-lg text-muted-foreground">
        Sign in or create an account to access your dashboard.
      </p>
      <Show when="signed-in">
        <Button render={<Link href="/dashboard" />} className="self-start">
          Open dashboard
        </Button>
      </Show>
    </main>
  )
}

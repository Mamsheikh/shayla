import { auth } from "@clerk/nextjs/server"
import { PlusIcon } from "lucide-react"
import { connection } from "next/server"

import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default async function Page() {
  await auth.protect()
  await connection()
  const avatarSeed = crypto.randomUUID()

  return (
    <main className="flex min-h-[calc(100svh-4rem)] px-6">
      <Empty className="mx-auto max-w-2xl gap-5">
        <EmptyHeader className="max-w-xl gap-4">
          <EmptyMedia className="mb-3">
            <ChatAvatar seed={avatarSeed} className="size-14" />
          </EmptyMedia>
          <EmptyTitle className="text-xl">
            <h1>Meet your first bot</h1>
          </EmptyTitle>
          <EmptyDescription className="text-base sm:text-xl">
            Every bot gets its own personality, memory, and face. Spin one up
            and start the conversation.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="secondary" size="lg" className="h-12 px-5 text-base">
            <PlusIcon data-icon="inline-start" />
            Create a new bot
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}

import "server-only"

import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"

import { getDb } from "@/db"
import { chats } from "@/db/schema"

export async function getChat(chatId: string) {
  const { userId } = await auth.protect()

  return getDb().query.chats.findFirst({
    where: and(
      eq(chats.id, chatId),
      eq(chats.userId, userId),
      eq(chats.kind, "direct")
    ),
    with: { members: { with: { bot: true } } },
  })
}

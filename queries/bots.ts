import "server-only"

import { auth } from "@clerk/nextjs/server"
import { and, desc, eq } from "drizzle-orm"

import { getDb } from "@/db"
import { bots, chats } from "@/db/schema"

export async function getDirectChats() {
  const { userId } = await auth.protect()
  const db = getDb()

  const [userChats, firstBot] = await Promise.all([
    db.query.chats.findMany({
      where: and(eq(chats.userId, userId), eq(chats.kind, "direct")),
      with: { members: { with: { bot: true } } },
      orderBy: [desc(chats.lastMessageAt)],
    }),
    db.query.bots.findFirst({
      where: eq(bots.userId, userId),
      orderBy: [bots.createdAt],
    }),
  ])

  return userChats.map((chat) => {
    const bot =
      chat.members.find((member) => member.bot.userId === userId)?.bot ??
      firstBot

    return {
      id: chat.id,
      name: chat.name || bot?.name || "Chat",
      avatarSeed: bot?.avatar || chat.id,
      preview: chat.lastMessagePreview,
      lastMessageAt: chat.lastMessageAt.toISOString(),
    }
  })
}

export type DirectChat = Awaited<ReturnType<typeof getDirectChats>>[number]

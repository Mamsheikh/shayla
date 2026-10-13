"use server"

import { auth } from "@clerk/nextjs/server"
import { and, eq, inArray } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

import { getDb } from "@/db"
import {
  bots,
  chatMembers,
  chats,
  createBotSchema,
  type CreateBotInput,
} from "@/db/schema"

export async function createBot(input: CreateBotInput) {
  const { userId } = await auth.protect()
  const values = createBotSchema.parse(input)
  const botId = nanoid()
  const chatId = nanoid()
  const db = getDb()

  await db.batch([
    db.insert(bots).values({
      ...values,
      id: botId,
      instructions: values.instructions || null,
      userId,
    }),
    db.insert(chats).values({ id: chatId, userId, kind: "direct" }),
    db.insert(chatMembers).values({ chatId, botId }),
  ])

  revalidatePath("/")
  revalidatePath("/dashboard")

  return botId
}

export async function updateBot(botId: string, input: CreateBotInput) {
  const { userId } = await auth.protect()
  const values = createBotSchema.parse(input)
  const updated = await getDb()
    .update(bots)
    .set({ ...values, instructions: values.instructions || null })
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    .returning({ id: bots.id })

  if (updated.length === 0) {
    throw new Error("Bot not found")
  }

  revalidatePath("/(dashboard)", "layout")
  revalidatePath("/chats/[chatId]", "page")
}

export async function deleteBot(botId: string) {
  const { userId } = await auth.protect()
  const db = getDb()
  const ownedBot = await db.query.bots.findFirst({
    where: and(eq(bots.id, botId), eq(bots.userId, userId)),
    columns: { id: true },
  })

  if (!ownedBot) {
    throw new Error("Bot not found")
  }

  const directChats = db
    .select({ id: chatMembers.chatId })
    .from(chatMembers)
    .where(eq(chatMembers.botId, botId))

  await db.batch([
    db
      .delete(chats)
      .where(
        and(
          eq(chats.userId, userId),
          eq(chats.kind, "direct"),
          inArray(chats.id, directChats)
        )
      ),
    db.delete(bots).where(and(eq(bots.id, botId), eq(bots.userId, userId))),
  ])

  revalidatePath("/(dashboard)", "layout")
  revalidatePath("/chats/[chatId]", "page")
}

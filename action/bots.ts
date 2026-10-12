"use server"

import { auth } from "@clerk/nextjs/server"
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

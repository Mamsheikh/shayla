"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { getDb } from "@/db"
import { bots, createBotSchema, type CreateBotInput } from "@/db/schema"

export async function createBot(input: CreateBotInput) {
  const { userId } = await auth.protect()
  const values = createBotSchema.parse(input)

  const [bot] = await getDb()
    .insert(bots)
    .values({
      ...values,
      instructions: values.instructions || null,
      userId,
    })
    .returning({ id: bots.id })

  revalidatePath("/")
  revalidatePath("/dashboard")

  return bot.id
}

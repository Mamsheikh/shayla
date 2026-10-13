import { openai } from "@ai-sdk/openai"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  validateUIMessages,
  type UIMessage,
} from "ai"

import { getChat } from "@/queries/chats"

export const maxDuration = 30

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params
  const chat = await getChat(chatId)
  const bot = chat?.members[0]?.bot

  if (!bot) return new Response("Chat not found", { status: 404 })

  let messages: UIMessage[]
  try {
    const body = await request.json()
    messages = await validateUIMessages({ messages: body.messages })
  } catch {
    return new Response("Invalid messages", { status: 400 })
  }

  const result = streamText({
    model: openai("gpt-6-luna"),
    instructions: `You are ${bot.name}, ${bot.job}. ${bot.instructions ?? ""}`,
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}

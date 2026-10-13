import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import { ChatHeader } from "@/components/chat-header"
import { Chat } from "@/components/chat"
import { getChat } from "@/queries/chats"

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  await auth.protect()
  const { chatId } = await params
  const chat = await getChat(chatId)
  const bot = chat?.members[0]?.bot

  if (!bot) notFound()

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <ChatHeader bot={bot} />
      <Chat key={chatId} chatId={chatId} botName={bot.name} />
    </main>
  )
}

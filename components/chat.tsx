"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"

export function Chat({ chatId, botName }: { chatId: string; botName: string }) {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: `/api/chats/${chatId}` }),
  })
  const isGenerating = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation>
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 && (
            <ConversationEmptyState
              title={`Chat with ${botName}`}
              description="Send a message to start the conversation."
            />
          )}
          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <MessageResponse
                      key={index}
                      isAnimating={status === "streaming"}
                    >
                      {part.text}
                    </MessageResponse>
                  ) : null
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <p className="text-sm text-muted-foreground">Thinking…</p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-4 pb-4">
        <PromptInput
          onSubmit={({ text }) => {
            if (!text.trim() || isGenerating) return
            sendMessage({ text: text.trim() })
            setInput("")
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea
              aria-label={`Message ${botName}`}
              placeholder={`Message ${botName}…`}
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={!isGenerating && !input.trim()}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}

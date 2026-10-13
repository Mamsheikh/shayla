import { MonitorIcon } from "lucide-react"

import { BotsDialog } from "@/components/bots-dialog"
import { Button } from "@/components/ui/button"

type ChatHeaderProps = {
  bot: {
    id: string
    name: string
    avatar: string
    job: string
    instructions: string | null
  }
}

export function ChatHeader({ bot }: ChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
      <h1 className="sr-only">{bot.name}</h1>
      <BotsDialog initialSeed={bot.avatar} bot={bot} />
      <Button type="button" variant="ghost" size="icon" aria-label="Desktop">
        <MonitorIcon />
      </Button>
    </header>
  )
}

"use client"

import { useEffect, useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { formatDistanceToNowStrict } from "date-fns"
import { PlusIcon, SearchIcon, UsersRoundIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { BotsDialog } from "@/components/bots-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { DirectChat } from "@/queries/bots"

export function AppSidebar({ chats }: { chats: DirectChat[] }) {
  const router = useRouter()
  const [botDialogOpen, setBotDialogOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [avatarSeed, setAvatarSeed] = useState<string | null>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-lg" aria-label="Create" />
              }
            >
              <PlusIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setAvatarSeed((seed) => seed ?? crypto.randomUUID())
                    setBotDialogOpen(true)
                  }}
                >
                  <PlusIcon />
                  Create new bot
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UsersRoundIcon />
                  Create group chat
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          variant="ghost"
          onClick={() => setSearchOpen(true)}
          aria-label="Search chats"
          aria-keyshortcuts="Meta+K Control+K"
          className="h-8 w-full min-w-0 justify-start gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base font-normal text-muted-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
        >
          <SearchIcon data-icon="inline-start" />
          <span className="flex-1 text-left">Search</span>
          <KbdGroup aria-hidden="true">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        {avatarSeed && (
          <BotsDialog
            initialSeed={avatarSeed}
            open={botDialogOpen}
            onOpenChange={setBotDialogOpen}
          />
        )}
      </SidebarHeader>
      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Search chats"
        description="Search your chats by name or recent message."
      >
        <Command>
          <CommandInput placeholder="Search chats..." autoFocus />
          <CommandList>
            <CommandEmpty>No chats found.</CommandEmpty>
            <CommandGroup heading="Chats">
              {chats.map((chat) => (
                <CommandItem
                  key={chat.id}
                  value={`${chat.name} ${chat.preview ?? ""}`}
                  className="min-h-14"
                  onSelect={() => {
                    setSearchOpen(false)
                    router.push(`/chats/${encodeURIComponent(chat.id)}`)
                  }}
                >
                  <ChatAvatar
                    seed={chat.avatarSeed}
                    className="size-9 shrink-0"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {chat.name}
                      </span>
                      <time
                        dateTime={chat.lastMessageAt}
                        className="shrink-0 text-xs text-muted-foreground"
                      >
                        {formatDistanceToNowStrict(
                          new Date(chat.lastMessageAt)
                        )}
                      </time>
                    </span>
                    {chat.preview && (
                      <span className="truncate text-muted-foreground">
                        {chat.preview}
                      </span>
                    )}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    render={
                      <Link
                        href={`/chats/${encodeURIComponent(chat.id)}`}
                        prefetch={false}
                      />
                    }
                    size="lg"
                    className="h-auto min-h-14"
                  >
                    <ChatAvatar
                      seed={chat.avatarSeed}
                      className="size-9 shrink-0"
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="min-w-0 flex-1 truncate font-medium">
                          {chat.name}
                        </span>
                        <time
                          dateTime={chat.lastMessageAt}
                          className="shrink-0 text-xs text-muted-foreground"
                        >
                          {formatDistanceToNowStrict(
                            new Date(chat.lastMessageAt)
                          )}
                        </time>
                      </span>
                      {chat.preview && (
                        <span className="truncate text-muted-foreground">
                          {chat.preview}
                        </span>
                      )}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<div />} size="lg" className="p-0">
              <UserButton
                showName
                appearance={{
                  elements: {
                    rootBox: { display: "block", width: "100%" },
                    userButtonTrigger: {
                      width: "100%",
                      height: "100%",
                      padding: "0.5rem",
                      borderRadius: "var(--radius-md)",
                      color: "var(--sidebar-foreground)",
                      "&:hover": {
                        backgroundColor: "var(--sidebar-accent)",
                        color: "var(--sidebar-accent-foreground)",
                      },
                      "&:focus-visible": {
                        outline: "2px solid var(--sidebar-ring)",
                        outlineOffset: "-2px",
                      },
                    },
                    userButtonBox: {
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: "0.5rem",
                    },
                    userButtonAvatarBox: {
                      order: 1,
                      width: "1.75rem",
                      height: "1.75rem",
                      flexShrink: 0,
                    },
                    userButtonOuterIdentifier: {
                      order: 2,
                      minWidth: 0,
                      flex: 1,
                      paddingInlineStart: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "left",
                      fontSize: "0.875rem",
                      fontWeight: 400,
                    },
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

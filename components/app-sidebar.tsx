"use client"

import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { formatDistanceToNowStrict } from "date-fns"
import { PlusIcon, UsersRoundIcon } from "lucide-react"

import { BotsDialog } from "@/components/bots-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const [botDialogOpen, setBotDialogOpen] = useState(false)
  const [avatarSeed, setAvatarSeed] = useState<string | null>(null)

  return (
    <Sidebar>
      <SidebarHeader className="flex-row justify-end">
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
        {avatarSeed && (
          <BotsDialog
            initialSeed={avatarSeed}
            open={botDialogOpen}
            onOpenChange={setBotDialogOpen}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    render={<div />}
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

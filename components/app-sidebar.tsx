import { UserButton } from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent />
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

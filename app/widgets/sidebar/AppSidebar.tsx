// widgets/sidebar/AppSidebar.tsx
"use client"

import { useEffect, useMemo, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import { getStoredUser, resolveRole, type Role } from "@/lib/auth"
import { getMenuForRole } from "@/lib/menu"

const subscribe = () => () => {}

// localStorage faqat clientda mavjud, shuning uchun sessiya shu yerdan o'qiladi
function getSession() {
  if (typeof window === "undefined") return ""
  const token = localStorage.getItem("token")
  const user = getStoredUser()
  if (!token || !user) return ""
  return resolveRole(user) ?? "unknown"
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const session = useSyncExternalStore(subscribe, getSession, () => "")
  const ready = session !== ""
  const role = ready && session !== "unknown" ? (session as Role) : null

  useEffect(() => {
    if (!session) router.replace("/login")
  }, [session, router])

  const visibleGroups = useMemo(() => getMenuForRole(role), [role])

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="border-b p-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary" />
          <span className="font-bold group-data-[collapsible=icon]:hidden">
            Bunyod Optom
          </span>
        </div>
      </SidebarHeader>

      {/* NAVIGATION */}
      <SidebarContent>
        {ready &&
          visibleGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active =
                      item.url === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.url)
                    const Icon = item.icon

                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.name}
                          className="text-sidebar-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-white"
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-2"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t p-3">
        <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          v1.0.0 • Boshqaruv paneli
          {role && <span className="block capitalize">Rol: {role}</span>}
        </div>
        <div className="hidden w-full justify-center group-data-[collapsible=icon]:flex">
          ⚡
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
// widgets/sidebar/AppSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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

import {
  ProductsIcon,
  UserIcon,
  AnalyticsIcon,
  NotificationIcon,
  SettingsIcon,
  CategoriesIcon,
  DashboardIcon,
  StoreIcon,
  DeliveryIcon,
} from "@/assets/icons"

const navGroups = [
  {
    label: "Asosiy",
    items: [
      { name: "Bosh sahifa", url: "/", icon: DashboardIcon },
      { name: "Tahlil", url: "/analytics", icon: AnalyticsIcon },
      { name: "Mahsulotlar", url: "/products", icon: ProductsIcon },
      { name: "Addresses", url: "/addresses", icon: ProductsIcon },
      { name: "Dukonlar", url: "/stores", icon: StoreIcon },
      { name: "Kategoriyalar", url: "/categories", icon: CategoriesIcon },
      { name: "Buyurtmalar", url: "/orders", icon: DeliveryIcon },
      { name: "Foydalanuvchilar", url: "/users", icon: UserIcon },
    ],
  },
  {
    label: "Tizim",
    items: [
      { name: "Bildirishnomalar", url: "/notifications", icon: NotificationIcon },
      { name: "Sozlamalar", url: "/settings", icon: SettingsIcon },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="border-b p-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary" />
          <span className="font-bold group-data-[collapsible=icon]:hidden">
            SaaS Panel
          </span>
        </div>
      </SidebarHeader>

      {/* NAVIGATION */}
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.url
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.name}
                        className="text-sidebar-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-white"
                      >
                        <Link href={item.url} className="flex items-center gap-2">
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
        </div>
        <div className="hidden w-full justify-center group-data-[collapsible=icon]:flex">
          ⚡
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
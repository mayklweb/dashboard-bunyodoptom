// lib/menu.ts
import type { ComponentType } from "react"

import {
  ProductsIcon,
  UserIcon,
  NotificationIcon,
  SettingsIcon,
  CategoriesIcon,
  DashboardIcon,
  StoreIcon,
  DeliveryIcon,
  StaffIcon,
} from "@/assets/icons"

import type { Role } from "./auth"

export type NavItem = {
  name: string
  url: string
  icon: ComponentType<{ className?: string }>
  roles: Role[] // qaysi rollar ko'radi
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

const ALL: Role[] = ["admin", "manager", "courier"]

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Asosiy",
    items: [
      // Dashboard hamma uchun bitta URL, sahifa ichida rolga qarab boshqacha ko'rinadi
      { name: "Bosh sahifa", url: "/", icon: DashboardIcon, roles: ALL },
      {
        name: "Mahsulotlar",
        url: "/products",
        icon: ProductsIcon,
        roles: ["admin", "manager", "warehouse"],
      },
      {
        name: "Do'konlar",
        url: "/stores",
        icon: StoreIcon,
        roles: ["admin", "manager"],
      },
      {
        name: "Kategoriyalar",
        url: "/categories",
        icon: CategoriesIcon,
        roles: ["admin", "manager", "warehouse"],
      },
      // Menejer buyurtmalarni yaratadi va dastavshiklarga biriktiradi
      {
        name: "Buyurtmalar",
        url: "/orders",
        icon: DeliveryIcon,
        roles: ["admin", "manager"],
      },
      {
        name: "Dastavshiklar",
        url: "/couriers",
        icon: StaffIcon,
        roles: ["admin", "manager"],
      },
      // Dastavshik faqat o'ziga biriktirilgan buyurtmalarni ko'radi
      {
        name: "Mening buyurtmalarim",
        url: "/my-orders",
        icon: DeliveryIcon,
        roles: ["courier"],
      },
      {
        name: "Foydalanuvchilar",
        url: "/users",
        icon: UserIcon,
        roles: ["admin"],
      },
      {
        name: "Xodimlar",
        url: "/staff",
        icon: StaffIcon,
        roles: ["admin"],
      },
    ],
  },
  {
    label: "Tizim",
    items: [
      {
        name: "Bildirishnomalar",
        url: "/notifications",
        icon: NotificationIcon,
        roles: [...ALL, "warehouse"],
      },
      {
        name: "Sozlamalar",
        url: "/settings",
        icon: SettingsIcon,
        roles: ["admin"],
      },
    ],
  },
]

// Rolga mos menyu; bo'sh qolgan guruh qaytarilmaydi
export function getMenuForRole(role: Role | null): NavGroup[] {
  if (!role) return []
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(role)),
  })).filter((group) => group.items.length > 0)
}
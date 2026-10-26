// lib/courier-api.ts
// DIQQAT: endpoint nomlari va javob maydonlari qisman TAXMINIY.
// Backend boshqacha bo'lsa, faqat shu faylni (ENDPOINTS va normalizeOrder) moslang.

import { logout } from "./auth"

const BASE_URL = "https://api.bunyodoptom.uz/api/v1"

const ENDPOINTS = {
  // GET -> buyurtmalar (kuryer tokeni bilan o'ziga tegishlilari qaytishi kerak)
  orders: "/orders",
  // PATCH -> buyurtmani yangilash (status). TAXMINIY, backendga moslang
  status: (id: number | string) => `/orders/${id}`,
}

// Backend enum'i bilan bir xil: pending, preparing, delivered, cancelled
export type OrderStatus = "new" | "on_the_way" | "delivered" | "cancelled"

export interface CourierOrder {
  id: number | string
  number: string
  market: {
    market_id: number
    name: string
    address: string
    region: string | null
    district: string | null
  }
  address: string
  phone: string
  amount: number
  status: OrderStatus
  createdAt?: string
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Yangi buyurtma",
  on_the_way: "Yo'lda",
  delivered: "Yetkazildi",
  cancelled: "Bekor qilindi",
}

// Hali yakunlanmagan (kuryer ustida ishlashi mumkin bo'lgan) buyurtma
export function isActiveStatus(s: OrderStatus) {
  return s === "new" || s === "on_the_way"
}

export function normalizeStatus(raw: unknown): OrderStatus {
  const s = String(raw ?? "")
    .toLowerCase()
    .trim()

  if (["delivered", "completed", "done"].includes(s)) {
    return "delivered"
  }

  if (["cancelled", "canceled", "rejected"].includes(s)) {
    return "cancelled"
  }

  if (["on_the_way", "on the way", "on-the-way"].includes(s)) {
    return "on_the_way"
  }

  if (["new", "pending", "preparing"].includes(s)) {
    return "new"
  }

  return "new"
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeOrder(o: any): CourierOrder {
  return {
    id: o.id ?? o._id,
    number: String(o.number ?? o.order_number ?? o.id ?? o._id),

    market: {
      market_id: o.market?.market_id ?? 0,
      name: o.market?.name ?? "",
      address: o.market?.address ?? "",
      region: o.market?.region ?? null,
      district: o.market?.district ?? null,
    },

    storeName:
      o.market?.name ??
      o.store_name ??
      o.store?.name ??
      o.user?.name ??
      "Noma'lum do'kon",

    address: o.market?.address ?? o.address ?? "",
    phone: o.user?.phone ?? o.phone ?? o.customer_phone ?? "",
    amount: Number(o.total_amount ?? o.amount ?? o.total ?? 0),
    status: normalizeStatus(o.status),
    createdAt: o.created_at ?? o.createdAt,
  } as CourierOrder
}

export async function request(path: string, init?: RequestInit) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })

  if (res.status === 401) {
    logout()
    window.location.href = "/login"
    throw new Error("Sessiya tugadi, qayta kiring")
  }
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || "Server xatosi")
  }
  return res.json()
}

// Javobdan buyurtmalar massivini topadi (turli formatlarga chidamli)
export function extractList(json: any): any[] {
  const candidates = [
    json,
    json?.data,
    json?.data?.data,
    json?.data?.orders,
    json?.data?.items,
    json?.data?.results,
    json?.orders,
    json?.items,
    json?.results,
  ]
  for (const c of candidates) if (Array.isArray(c)) return c

  const keys =
    json && typeof json === "object"
      ? Object.keys(json).join(", ")
      : typeof json
  throw new Error(`Javob formati tushunarsiz (kalitlar: ${keys || "yo'q"})`)
}

export async function fetchCourierOrders(
  date: string
): Promise<CourierOrder[]> {
  const json = await request(ENDPOINTS.orders)

  console.log("Orders API raw response:", json)

  const list = extractList(json)

  console.log("Orders API list:", list)

  return list.map(normalizeOrder)
}

export async function updateOrderStatus(
  id: number | string,
  status: OrderStatus,
  reason?: string
) {
  return request(ENDPOINTS.status(id), {
    method: "PATCH",
    body: JSON.stringify({
      status,
      cancelReason: reason,
    }),
  })
}

export function formatMoney(n: number) {
  return `${n.toLocaleString("ru-RU")} so'm`
}

export function todayISO() {
  const d = new Date()
  const pad = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

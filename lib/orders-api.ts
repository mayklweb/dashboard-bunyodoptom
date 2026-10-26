// lib/orders-api.ts  (menejer / admin uchun)
// DIQQAT: endpointlar va maydon nomlari TAXMINIY. Faqat shu faylni moslang.

import {
  extractList,
  normalizeStatus,
  request,
  type OrderStatus,
} from "./courier-api"

const ENDPOINTS = {
  orders: "/orders", // GET ?search=&status=&courier_id=&date=&page=
  couriers: "/admin/staff", // GET. TAXMINIY (xodimlar endpointiga moslang)
  order: (id: number | string) => `/orders/${id}`, // PATCH { courier_id }. TAXMINIY
}

export interface ManagerOrder {
  id: number | string
  number: string
  storeName: string
  address: string
  phone: string
  amount: number
  status: OrderStatus
  courierId: number | string | null
  courierName: string | null
  createdAt: string
}

export interface Courier {
  id: number | string
  name: string
  phone?: string
}

export interface OrdersQuery {
  search?: string
  status?: string // "" | OrderStatus
  courier?: string // "" | "none" | courierId
  date?: string // YYYY-MM-DD
  page?: number
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeOrder(o: any): ManagerOrder {
  return {
    id: o.id,
    number: String(o.number ?? o.order_number ?? o.id),
    storeName: o.store_name ?? o.store?.name ?? o.customer_name ?? "Noma'lum do'kon",
    address: o.address ?? o.store?.address ?? "",
    phone: o.phone ?? o.store?.phone ?? "",
    amount: Number(o.total_amount ?? o.amount ?? o.total ?? 0),
    status: normalizeStatus(o.status),
    courierId: o.courier_id ?? o.courier?.id ?? null,
    courierName: o.courier_name ?? o.courier?.name ?? null,
    createdAt: o.created_at ?? "",
  }
}

export async function fetchOrders(q: OrdersQuery) {
  const params = new URLSearchParams()
  if (q.search) params.set("search", q.search)
  if (q.status) params.set("status", q.status)
  if (q.courier === "none") params.set("unassigned", "1")
  else if (q.courier) params.set("courier_id", q.courier)
  if (q.date) params.set("date", q.date)
  params.set("page", String(q.page ?? 1))

  const json = await request(`${ENDPOINTS.orders}?${params}`)
  const list: any[] = extractList(json)

  return {
    orders: list.map(normalizeOrder),
    lastPage: Number(
      json.meta?.last_page ?? json.data?.last_page ?? json.last_page ?? 1
    ),
  }
}

export async function fetchCouriers(): Promise<Courier[]> {
  const json = await request(ENDPOINTS.couriers)
  const list: any[] = Array.isArray(json.data)
    ? json.data
    : json.data?.items ?? json.data?.data ?? []
  return list.map((c) => ({
    id: c.id,
    name: c.name ?? c.full_name ?? c.username ?? `Kuryer #${c.id}`,
    phone: c.phone,
  }))
}

// Berilgan kunning barcha buyurtmalarini (hamma sahifalarni) yig'adi. Dashboard uchun.
export async function fetchAllOrdersForDate(date: string): Promise<ManagerOrder[]> {
  const all: ManagerOrder[] = []
  let page = 1
  let lastPage = 1
  do {
    const res = await fetchOrders({ date, page })
    all.push(...res.orders)
    lastPage = res.lastPage
    page++
  } while (page <= lastPage && page <= 20) // xavfsizlik uchun 20 sahifa bilan cheklangan
  return all
}

// Bitta yoki bir nechta buyurtmani dastavshikka biriktiradi
export async function assignOrders(
  orderIds: Array<number | string>,
  courierId: number | string
) {
  // Alohida "assign" endpoint yo'q, shuning uchun har bir buyurtmani alohida yangilaymiz
  await Promise.all(
    orderIds.map((id) =>
      request(ENDPOINTS.order(id), {
        method: "PATCH",
        body: JSON.stringify({ courier_id: courierId }),
      })
    )
  )
}
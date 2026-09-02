// lib/api/orders.ts
import { api } from "@/lib/axios"
import type { Order, OrderStatus } from "@/types/order"

export async function getOrders(): Promise<Order[]> {
  const res = await api.get("/orders")
  return Array.isArray(res.data) ? res.data : (res.data.data ?? [])
}

export async function getOrder(id: number): Promise<Order> {
  const res = await api.get(`/orders/${id}`)
  return res.data.data ?? res.data
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus
): Promise<Order> {
  const res = await api.patch(`/orders/${id}/status`, { status })
  return res.data.data ?? res.data
}

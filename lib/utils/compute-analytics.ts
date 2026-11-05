// lib/utils/compute-analytics.ts
import type { Order } from "@/types/order"

export interface AnalyticsSummary {
  totalOrders: number
  totalRevenue: number
  paidRevenue: number
  unpaidRevenue: number
  statusCounts: Record<string, number>
  topProducts: {
    id: number
    name: string
    qty: number
    revenue: number
  }[]
  revenueByDay: { date: string; revenue: number }[]
}

export function computeAnalytics(orders: Order[]): AnalyticsSummary {
  const safeOrders = orders ?? []

  const totalOrders = safeOrders.length
  const totalRevenue = safeOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)
  const paidRevenue = safeOrders
    .filter((o) => Number(o.payed) === 1)
    .reduce((sum, o) => sum + Number(o.total_amount), 0)
  const unpaidRevenue = totalRevenue - paidRevenue

  const statusCounts: Record<string, number> = {}
  for (const order of safeOrders) {
    statusCounts[order.status] = (statusCounts[order.status] ?? 0) + 1
  }

  const productMap = new Map<
    number,
    { id: number; name: string; qty: number; revenue: number }
  >()
  for (const order of safeOrders) {
    for (const item of order.products ?? []) {
      const existing = productMap.get(item.product_id)
      const subtotal = Number(item.subtotal)
      if (existing) {
        existing.qty += Number(item.qty)
        existing.revenue += subtotal
      } else {
        productMap.set(item.product_id, {
          id: item.product_id,
          name: item.product?.name ?? "Noma'lum",
          qty: Number(item.qty),
          revenue: subtotal,
        })
      }
    }
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const revenueMap = new Map<string, number>()
  for (const order of safeOrders) {
    const timestamp = new Date(order.created_at)
    if (Number.isNaN(timestamp.getTime())) continue
    const date = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, "0")}-${String(timestamp.getDate()).padStart(2, "0")}`
    revenueMap.set(date, (revenueMap.get(date) ?? 0) + Number(order.total_amount))
  }
  const revenueByDay = Array.from(revenueMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, revenue]) => ({
      date: new Date(`${date}T00:00:00`).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit" }),
      revenue,
    }))

  return {
    totalOrders,
    totalRevenue,
    paidRevenue,
    unpaidRevenue,
    statusCounts,
    topProducts,
    revenueByDay,
  }
}

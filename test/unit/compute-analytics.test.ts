import { describe, expect, it } from "vitest"
import { computeAnalytics } from "@/lib/utils/compute-analytics"
import type { Order } from "@/types/order"

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 1,
    status: "new",
    payment_method: "cash",
    payed: 0,
    user_id: 1,
    market_id: 1,
    total_amount: 0,
    created_at: "2026-10-20T10:00:00.000Z",
    user: { id: 1, name: "Ali", phone: "+998901112233" },
    market: {
      id: 1,
      name: "Bozor",
      address: "Chilonzor",
      region: "Toshkent",
      district: null,
    },
    products: [],
    address: {
      id: 1,
      user_id: 1,
      region: "Toshkent",
      district: null,
      address: "1-uy",
      is_default: 1,
      created_at: "2026-10-20T10:00:00.000Z",
      updated_at: "2026-10-20T10:00:00.000Z",
    },
    ...overrides,
  } as Order
}

function makeItem(productId: number, qty: number, subtotal: string, name?: string) {
  return {
    id: productId * 10,
    order_id: 1,
    product_id: productId,
    qty,
    unit_price: "1000",
    subtotal,
    created_at: "2026-10-20T10:00:00.000Z",
    product: name ? ({ id: productId, name } as never) : undefined,
  } as never
}

describe("computeAnalytics", () => {
  it("returns zeroed summary for an empty list", () => {
    expect(computeAnalytics([])).toEqual({
      totalOrders: 0,
      totalRevenue: 0,
      paidRevenue: 0,
      unpaidRevenue: 0,
      statusCounts: {},
      topProducts: [],
      revenueByDay: [],
    })
  })

  it("treats a nullish list as empty instead of crashing", () => {
    expect(computeAnalytics(undefined as unknown as Order[]).totalOrders).toBe(0)
  })

  it("splits revenue into paid and unpaid buckets", () => {
    const summary = computeAnalytics([
      makeOrder({ id: 1, total_amount: 100_000, payed: 1 }),
      makeOrder({ id: 2, total_amount: 50_000, payed: 0 }),
      makeOrder({ id: 3, total_amount: 25_000, payed: 1 }),
    ])

    expect(summary.totalOrders).toBe(3)
    expect(summary.totalRevenue).toBe(175_000)
    expect(summary.paidRevenue).toBe(125_000)
    expect(summary.unpaidRevenue).toBe(50_000)
  })

  it("counts orders per status", () => {
    const summary = computeAnalytics([
      makeOrder({ id: 1, status: "new" }),
      makeOrder({ id: 2, status: "new" }),
      makeOrder({ id: 3, status: "delivered" }),
      makeOrder({ id: 4, status: "canceled" }),
    ])

    expect(summary.statusCounts).toEqual({ new: 2, delivered: 1, canceled: 1 })
  })

  it("aggregates top products across orders, sorted by revenue and capped at 5", () => {
    const orders = [
      makeOrder({
        id: 1,
        total_amount: 3000,
        products: [
          makeItem(1, 2, "2000", "Olma"),
          makeItem(2, 1, "1000", "Nok"),
        ],
      }),
      makeOrder({
        id: 2,
        total_amount: 4000,
        products: [
          makeItem(1, 1, "3000", "Olma"),
          makeItem(3, 5, "500", "Uzum"),
          makeItem(4, 1, "100", "Anor"),
          makeItem(5, 1, "100", "Banan"),
          makeItem(6, 1, "100", "Kivi"),
        ],
      }),
    ]

    const { topProducts } = computeAnalytics(orders)

    expect(topProducts).toHaveLength(5)
    expect(topProducts[0]).toEqual({
      id: 1,
      name: "Olma",
      qty: 3,
      revenue: 5000,
    })
    expect(topProducts[1]).toEqual({
      id: 2,
      name: "Nok",
      qty: 1,
      revenue: 1000,
    })
    // string subtotals must be coerced to numbers, not concatenated
    expect(topProducts[2].revenue).toBe(500)
  })

  it("falls back to a placeholder name when the product is missing", () => {
    const summary = computeAnalytics([
      makeOrder({ products: [makeItem(99, 1, "700")] }),
    ])

    expect(summary.topProducts[0].name).toBe("Noma'lum")
    expect(summary.topProducts[0].revenue).toBe(700)
  })

  it("groups revenue per calendar day", () => {
    const summary = computeAnalytics([
      // two orders on the same calendar day in local time
      makeOrder({ id: 1, created_at: "2026-10-20T08:00:00.000Z", total_amount: 100 }),
      makeOrder({ id: 2, created_at: "2026-10-20T10:30:00.000Z", total_amount: 250 }),
      makeOrder({ id: 3, created_at: "2026-10-22T12:00:00.000Z", total_amount: 400 }),
    ])

    expect(summary.revenueByDay).toHaveLength(2)
    expect(summary.revenueByDay.map((d) => d.revenue).sort((a, b) => a - b)).toEqual([
      350, 400,
    ])
  })

  it("keeps only the last 14 days of revenue", () => {
    const orders = Array.from({ length: 16 }, (_, i) =>
      makeOrder({
        id: i + 1,
        created_at: `2026-10-${String(i + 1).padStart(2, "0")}T10:00:00.000Z`,
        total_amount: i + 1,
      })
    )

    const { revenueByDay } = computeAnalytics(orders)

    expect(revenueByDay).toHaveLength(14)
  })
})

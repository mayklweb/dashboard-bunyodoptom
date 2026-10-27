import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fetchCouriers, fetchOrders } from "@/lib/orders-api"

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

describe("fetchOrders", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token")
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("sends filters as query params and normalizes each order", async () => {
    const fetchMock = vi.fn(async (..._args: unknown[]) =>
      jsonResponse({
        data: [
          {
            id: 12,
            total_amount: "150000",
            status: "delivered",
            store_name: "Chilonzor bozori",
            address: "Bunyodkor 3",
            phone: "+998901234567",
            courier_id: 4,
            courier: { id: 4, name: "Sardor" },
            created_at: "2026-10-20T09:00:00Z",
          },
        ],
        meta: { last_page: 3 },
      })
    )
    vi.stubGlobal("fetch", fetchMock)

    const result = await fetchOrders({
      search: "Ali",
      status: "delivered",
      courier: "4",
      date: "2026-10-20",
      page: 2,
    })

    const calledUrl = new URL(String(fetchMock.mock.calls[0][0]))
    expect(calledUrl.pathname).toBe("/api/v1/orders")
    expect(calledUrl.searchParams.get("search")).toBe("Ali")
    expect(calledUrl.searchParams.get("status")).toBe("delivered")
    expect(calledUrl.searchParams.get("courier_id")).toBe("4")
    expect(calledUrl.searchParams.get("date")).toBe("2026-10-20")
    expect(calledUrl.searchParams.get("page")).toBe("2")

    expect(result.lastPage).toBe(3)
    expect(result.orders[0]).toEqual({
      id: 12,
      number: "12",
      storeName: "Chilonzor bozori",
      address: "Bunyodkor 3",
      phone: "+998901234567",
      amount: 150000,
      status: "delivered",
      courierId: 4,
      courierName: "Sardor",
      createdAt: "2026-10-20T09:00:00Z",
    })
  })

  it("uses the unassigned flag for courier='none'", async () => {
    const fetchMock = vi.fn(async (..._args: unknown[]) =>
      jsonResponse({ data: [] })
    )
    vi.stubGlobal("fetch", fetchMock)

    await fetchOrders({ courier: "none" })

    const calledUrl = new URL(String(fetchMock.mock.calls[0][0]))
    expect(calledUrl.searchParams.get("unassigned")).toBe("1")
    expect(calledUrl.searchParams.has("courier_id")).toBe(false)
  })

  it("sends the bearer token", async () => {
    const fetchMock = vi.fn(async (..._args: unknown[]) =>
      jsonResponse({ data: [] })
    )
    vi.stubGlobal("fetch", fetchMock)

    await fetchOrders({})

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer test-token"
    )
  })

  it("surfaces the backend error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ message: "Server yondi" }, 500))
    )

    await expect(fetchOrders({})).rejects.toThrow("Server yondi")
  })

  it("falls back to a generic message when the error body is unreadable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("not json")
        },
      }))
    )

    await expect(fetchOrders({})).rejects.toThrow("Server xatosi")
  })
})

describe("fetchCouriers", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("normalizes names with sensible fallbacks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          data: [
            { id: 1, name: "Sardor", phone: "+998900000001" },
            { id: 2, full_name: "Dilshod" },
            { id: 3 },
          ],
        })
      )
    )

    const couriers = await fetchCouriers()

    expect(couriers).toEqual([
      { id: 1, name: "Sardor", phone: "+998900000001" },
      { id: 2, name: "Dilshod", phone: undefined },
      { id: 3, name: "Kuryer #3", phone: undefined },
    ])
  })
})

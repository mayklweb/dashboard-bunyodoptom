import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/axios", () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

import { api } from "@/lib/axios"
import { getOrder, getOrders, updateOrderStatus } from "@/lib/api/orders"

const mockedGet = vi.mocked(api.get)
const mockedPatch = vi.mocked(api.patch)

describe("orders api", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns a bare array response as-is", async () => {
    mockedGet.mockResolvedValueOnce({ data: [{ id: 1 }] } as never)

    await expect(getOrders()).resolves.toEqual([{ id: 1 }])
    expect(mockedGet).toHaveBeenCalledWith("/orders")
  })

  it("unwraps { data: [...] } responses", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: [{ id: 2 }] } } as never)

    await expect(getOrders()).resolves.toEqual([{ id: 2 }])
  })

  it("returns an empty list for unexpected shapes", async () => {
    mockedGet.mockResolvedValueOnce({ data: { items: [{ id: 3 }] } } as never)
    await expect(getOrders()).resolves.toEqual([])
  })

  it("unwraps a single order", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: { id: 5 } } } as never)

    await expect(getOrder(5)).resolves.toEqual({ id: 5 })
    expect(mockedGet).toHaveBeenCalledWith("/orders/5")
  })

  it("patches the status endpoint with the new status", async () => {
    mockedPatch.mockResolvedValueOnce({ data: { data: { id: 7 } } } as never)
    vi.spyOn(console, "log").mockImplementation(() => {})

    await updateOrderStatus(7, "delivered")

    expect(mockedPatch).toHaveBeenCalledWith("/orders/7/status", {
      status: "delivered",
    })
  })

  it("propagates axios failures", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network Error"))

    await expect(getOrders()).rejects.toThrow("Network Error")
  })
})

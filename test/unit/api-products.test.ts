import { beforeEach, describe, expect, it, vi } from "vitest"
import { createProduct, deleteProduct, getProducts, updateProduct, type ProductPayload } from "@/lib/api/products"

const product = { id: 7, name: "Olma" }
const payload: ProductPayload = { name: "Olma", price: 1000, category_id: 1, brand_id: 1, stock_qty: 5, status: "active" }

describe("products API", () => {
  beforeEach(() => {
    localStorage.setItem("token", "product-token")
    vi.unstubAllGlobals()
  })

  it("uses a valid default URL and unwraps list envelopes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [product] })))
    vi.stubGlobal("fetch", fetchMock)
    expect(await getProducts()).toEqual([product])
    expect(fetchMock.mock.calls[0][0]).toMatch(/^https:\/\/.*\/api\/v1\/products$/)
  })

  it("authenticates mutations and unwraps returned products", async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ data: product }))))
    vi.stubGlobal("fetch", fetchMock)
    expect(await createProduct(payload)).toEqual(product)
    expect(await updateProduct(7, payload)).toEqual(product)
    await deleteProduct(7)
    for (const [, init] of fetchMock.mock.calls) {
      expect(new Headers(init.headers).get("Authorization")).toBe("Bearer product-token")
    }
  })
})

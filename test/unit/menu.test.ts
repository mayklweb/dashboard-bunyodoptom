import { describe, expect, it } from "vitest"
import { getMenuForRole } from "@/lib/menu"

const urlsFor = (role: Parameters<typeof getMenuForRole>[0]) =>
  getMenuForRole(role).flatMap((g) => g.items.map((i) => i.url))

describe("getMenuForRole", () => {
  it("returns no menu without a role", () => {
    expect(getMenuForRole(null)).toEqual([])
  })

  it("gives admins every item", () => {
    const urls = urlsFor("admin")

    expect(urls).toEqual(
      expect.arrayContaining([
        "/",
        "/products",
        "/stores",
        "/categories",
        "/orders",
        "/orders-table",
        "/users",
        "/staff",
        "/notifications",
        "/settings",
      ])
    )
  })

  it("restricts couriers to their own orders", () => {
    const urls = urlsFor("courier")

    expect(urls).toContain("/")
    expect(urls).toContain("/my-orders")
    expect(urls).not.toContain("/products")
    expect(urls).not.toContain("/users")
    expect(urls).not.toContain("/settings")
  })

  it("shows only notifications under Tizim for warehouse", () => {
    const groups = getMenuForRole("warehouse")
    const tizim = groups.find((g) => g.label === "Tizim")

    expect(tizim?.items.map((i) => i.url)).toEqual(["/notifications"])
  })

  it("never returns empty groups", () => {
    for (const role of ["admin", "manager", "courier", "warehouse"] as const) {
      const groups = getMenuForRole(role)
      expect(groups.length).toBeGreaterThan(0)
      groups.forEach((group) => expect(group.items.length).toBeGreaterThan(0))
    }
  })

  it("gives couriers the notification group but no admin tooling", () => {
    const groups = getMenuForRole("courier")

    expect(groups.map((g) => g.label)).toEqual(["Asosiy", "Tizim"])
    expect(groups[1].items.map((i) => i.url)).toEqual(["/notifications"])
  })
})

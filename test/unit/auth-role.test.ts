import { beforeEach, describe, expect, it } from "vitest"
import { getStoredUser, logout, resolveRole } from "@/lib/auth"

describe("resolveRole", () => {
  it("returns null for a missing user", () => {
    expect(resolveRole(null)).toBeNull()
    expect(resolveRole(undefined)).toBeNull()
  })

  it("resolves plain role strings case-insensitively", () => {
    expect(resolveRole({ role: "admin" })).toBe("admin")
    expect(resolveRole({ role: "  Manager " })).toBe("manager")
    expect(resolveRole({ role: "COURIER" })).toBe("courier")
  })

  it("maps backend aliases to internal roles", () => {
    expect(resolveRole({ role: "superadmin" })).toBe("admin")
    expect(resolveRole({ role: "menejer" })).toBe("manager")
    expect(resolveRole({ role: "dostavchik" })).toBe("courier")
    expect(resolveRole({ role: "omborchi" })).toBe("warehouse")
  })

  it("unwraps nested role objects", () => {
    expect(resolveRole({ role: { name: "admin" } })).toBe("admin")
    expect(resolveRole({ role: { slug: "courier" } })).toBe("courier")
  })

  it("falls back to role_id only when no role name is present", () => {
    expect(resolveRole({ role_id: 1 })).toBe("admin")
    expect(resolveRole({ role_id: 2 })).toBe("manager")
    expect(resolveRole({ role_id: 3 })).toBe("courier")
    expect(resolveRole({ role_id: 99 })).toBeNull()
  })

  it("returns null for unknown roles", () => {
    expect(resolveRole({ role: "accountant" })).toBeNull()
    expect(resolveRole({})).toBeNull()
  })
})

describe("stored user helpers", () => {
  beforeEach(() => localStorage.clear())

  it("returns null when nothing is stored", () => {
    expect(getStoredUser()).toBeNull()
  })

  it("returns the parsed user", () => {
    localStorage.setItem("user", JSON.stringify({ id: 7, name: "Dilnoza" }))
    expect(getStoredUser()).toEqual({ id: 7, name: "Dilnoza" })
  })

  it("survives malformed JSON", () => {
    localStorage.setItem("user", "{not json")
    expect(getStoredUser()).toBeNull()
  })

  it("logout clears token and user but keeps other keys", () => {
    localStorage.setItem("token", "abc")
    localStorage.setItem("user", "{}")
    localStorage.setItem("theme", "dark")

    logout()

    expect(localStorage.getItem("token")).toBeNull()
    expect(localStorage.getItem("user")).toBeNull()
    expect(localStorage.getItem("theme")).toBe("dark")
  })
})

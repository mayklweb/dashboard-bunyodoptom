import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { proxy } from "@/proxy"

function visit(path: string, token?: string) {
  return proxy(new NextRequest(`https://dashboard.example${path}`, {
    headers: token ? { cookie: `token=${token}` } : {},
  }))
}

describe("route protection", () => {
  it("redirects anonymous protected requests", () => {
    expect(visit("/orders").headers.get("location")).toBe("https://dashboard.example/login")
    expect(visit("/login-history").headers.get("location")).toBe("https://dashboard.example/login")
  })
  it("permits login without a token", () => {
    expect(visit("/login").headers.get("location")).toBeNull()
  })
  it("permits authenticated pages and redirects away from login", () => {
    expect(visit("/orders", "token").headers.get("location")).toBeNull()
    expect(visit("/login", "token").headers.get("location")).toBe("https://dashboard.example/")
  })
})

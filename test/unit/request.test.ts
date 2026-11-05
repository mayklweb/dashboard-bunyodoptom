import { beforeEach, describe, expect, it, vi } from "vitest"
import { request } from "@/lib/courier-api"
import { authHeaders } from "@/lib/auth/headers"

describe("authenticated requests", () => {
  beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals() })

  it("never sends Bearer null to anonymous requests", () => {
    expect(authHeaders().has("Authorization")).toBe(false)
  })

  it("keeps caller headers and adds the session token", async () => {
    localStorage.setItem("token", "session-token")
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal("fetch", fetchMock)
    await expect(request("/orders/1", {
      method: "PATCH", headers: new Headers({ "X-Request-Id": "abc" }),
    })).resolves.toBeNull()
    const headers = new Headers(fetchMock.mock.calls[0][1].headers)
    expect(headers.get("Authorization")).toBe("Bearer session-token")
    expect(headers.get("X-Request-Id")).toBe("abc")
  })
})

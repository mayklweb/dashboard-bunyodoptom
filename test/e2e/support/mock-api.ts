import type { Page } from "@playwright/test"
import { loginSuccess, orders, staff, stores, users } from "./data"

const API_PATH = "/api/v1"
const API_HOST = "api.bunyodoptom.uz"
const MOCKY_HOST = "005c297b2f1afa3d.mokky.dev"

export interface MockOptions {
  orders?: unknown[]
  ordersStatus?: number
  ordersMessage?: string
  couriers?: unknown[]
  staff?: unknown[]
  stores?: unknown[]
  users?: unknown[]
}

function json(body: unknown, status = 200) {
  return { status, contentType: "application/json", body: JSON.stringify(body) }
}

/**
 * Intercepts every backend call the dashboard makes so E2E runs never touch
 * production. Only the two backend hosts are affected; everything else
 * (Next.js assets, HMR) passes through untouched.
 */
export async function mockApi(page: Page, options: MockOptions = {}) {
  await page.route("**/*", async (route) => {
    const request = route.request()
    const url = new URL(request.url())

    if (url.hostname === MOCKY_HOST) {
      if (url.pathname === "/users") {
        return route.fulfill(json(options.users ?? users))
      }
      return route.fulfill(json({ data: [] }))
    }

    if (url.hostname !== API_HOST) return route.continue()

    const path = url.pathname.replace(API_PATH, "")
    const method = request.method()

    if (path === "/admin/login" && method === "POST") {
      return route.fulfill(json(loginSuccess))
    }

    if (path === "/orders" && method === "GET") {
      if (options.ordersStatus && options.ordersStatus >= 400) {
        return route.fulfill(
          json({ message: options.ordersMessage ?? "Server xatosi" }, options.ordersStatus)
        )
      }
      return route.fulfill(json(options.orders ?? orders))
    }

    if (/^\/orders\/[^/]+$/.test(path) && (method === "PATCH" || method === "PUT")) {
      return route.fulfill(json({ data: { ok: true } }))
    }

    if (path === "/orders" && method === "PATCH") {
      return route.fulfill(json({ data: { ok: true } }))
    }

    if (path === "/admin/staff" && method === "GET") {
      return route.fulfill(json({ data: options.staff ?? staff }))
    }

    if (path === "/markets" && method === "GET") {
      return route.fulfill(json({ data: options.stores ?? stores }))
    }

    if (path === "/admin/staff" || path === "/markets") {
      // create / update / delete during interaction tests
      return route.fulfill(json({ data: { ok: true } }))
    }

    if (path === "/categories" || path === "/brands") {
      return route.fulfill(json({ data: [] }))
    }

    return route.fulfill(json({ data: [] }))
  })
}

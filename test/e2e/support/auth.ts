import type { Page } from "@playwright/test"

export const ADMIN_USER = {
  id: 1,
  name: "E2E Admin",
  username: "e2e",
  role: "admin",
  role_id: 1,
}

export const MANAGER_USER = {
  id: 2,
  name: "E2E Manager",
  username: "e2e-manager",
  role: "manager",
  role_id: 2,
}

export const COURIER_USER = {
  id: 3,
  name: "E2E Courier",
  username: "e2e-courier",
  role: "courier",
  role_id: 3,
}

const BASE_URL =
  process.env.E2E_BASE_URL ?? `http://127.0.0.1:${process.env.E2E_PORT ?? 3100}`

/**
 * Seeds the session the app expects: a `token` cookie for the Next middleware
 * and `token`/`user` in localStorage for the client components.
 */
export async function signIn(
  page: Page,
  user: Record<string, unknown> = ADMIN_USER
) {
  await page.context().addCookies([
    { name: "token", value: "e2e-jwt-token", url: BASE_URL },
  ])

  await page.addInitScript(
    ([token, serializedUser]) => {
      localStorage.setItem("token", token)
      localStorage.setItem("user", serializedUser)
    },
    ["e2e-jwt-token", JSON.stringify(user)] as const
  )
}

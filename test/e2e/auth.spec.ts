import { expect, test } from "@playwright/test"
import { loginSuccess } from "./support/data"
import { ADMIN_USER, signIn } from "./support/auth"
import { mockApi } from "./support/mock-api"

test.describe("authentication", () => {
  test("redirects anonymous visitors from the dashboard to the login page", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByText("Login to your account", { exact: true })).toBeVisible()
    await expect(page.getByLabel("Username")).toBeVisible()
  })

  test("shows validation errors instead of calling the API for empty input", async ({
    page,
  }) => {
    let loginCalls = 0
    await page.route("**/api/v1/admin/login", (route) => {
      loginCalls += 1
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(loginSuccess),
      })
    })

    await page.goto("/login")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(
      page.getByText("Username must be at least 4 characters")
    ).toBeVisible()
    await expect(
      page.getByText("Password must be at least 6 characters")
    ).toBeVisible()
    expect(loginCalls).toBe(0)
  })

  test("surfaces the backend message for wrong credentials", async ({ page }) => {
    await page.route("**/api/v1/admin/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Login yoki parol xato" }),
      })
    )

    await page.goto("/login")
    await page.getByLabel("Username").fill("wrong-user")
    await page.getByLabel("Password").fill("wrong-pass")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.getByText("Login yoki parol xato")).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test("stores the session and redirects to the dashboard on success", async ({
    page,
  }) => {
    await mockApi(page)

    await page.goto("/login")
    await page.getByLabel("Username").fill("admin01")
    await page.getByLabel("Password").fill("secret123")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page).toHaveURL(/\/($|\?)/, { timeout: 20_000 })
    await expect(
      page.getByRole("heading", { name: "Boshqaruv paneli" })
    ).toBeVisible()

    const session = await page.evaluate(() => ({
      token: localStorage.getItem("token"),
      user: localStorage.getItem("user"),
    }))

    expect(session.token).toBe(loginSuccess.data.token)
    expect(JSON.parse(session.user!)).toMatchObject({ id: ADMIN_USER.id })
  })

  test("sends already-authenticated users away from the login page", async ({
    page,
  }) => {
    await mockApi(page)
    await signIn(page)

    await page.goto("/login")

    await expect(page).toHaveURL(/\/($|\?)/)
  })
})

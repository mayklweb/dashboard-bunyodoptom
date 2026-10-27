import { expect, test } from "@playwright/test"
import { signIn } from "./support/auth"
import { mockApi } from "./support/mock-api"

const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  /Warning: .*not wrapped in act/i,
  /Failed to load resource: the server responded with a status of 404/i,
]

function collectErrors(page: import("@playwright/test").Page) {
  const errors: string[] = []

  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`))
  page.on("console", (message) => {
    if (message.type() !== "error") return
    const text = message.text()
    if (IGNORED_CONSOLE.some((pattern) => pattern.test(text))) return
    errors.push(`console: ${text}`)
  })

  return errors
}

async function expectNoNextErrorOverlay(page: import("@playwright/test").Page) {
  await expect(page.getByText("Application error")).toHaveCount(0)
  await expect(page.getByText("Unhandled Runtime Error")).toHaveCount(0)
}

test.describe("smoke @smoke", () => {
  test("login page renders without console errors", async ({ page }) => {
    const errors = collectErrors(page)

    await page.goto("/login")

    await expect(page.getByText("Login to your account", { exact: true })).toBeVisible()
    await expectNoNextErrorOverlay(page)
    expect(errors).toEqual([])
  })

  test("anonymous access is guarded", async ({ page }) => {
    await page.goto("/orders")
    await expect(page).toHaveURL(/\/login$/)
  })

  test("authenticated shell renders on every client-side page", async ({
    page,
  }) => {
    await signIn(page)
    await mockApi(page)

    const errors = collectErrors(page)

    const pages: Array<{ path: string; heading: string; asHeading?: boolean }> = [
      { path: "/", heading: "Boshqaruv paneli", asHeading: true },
      { path: "/orders", heading: "Buyurtmalar", asHeading: true },
      { path: "/stores", heading: "Do'konlar", asHeading: true },
      { path: "/staff", heading: "Xodimlar", asHeading: true },
      { path: "/notifications", heading: "Notifications" },
      { path: "/settings", heading: "Settings" },
    ]

    for (const { path, heading, asHeading } of pages) {
      await test.step(`loads ${path}`, async () => {
        await page.goto(path)
        await expect(
          asHeading
            ? page.getByRole("heading", { name: heading })
            : page.getByText(heading, { exact: true })
        ).toBeVisible()
        await expect(page.getByText("Bunyod Optom")).toHaveCount(1)
        await expectNoNextErrorOverlay(page)
      })
    }

    expect(errors).toEqual([])
  })

  test("sidebar navigation reaches the orders page", async ({ page }) => {
    await signIn(page)
    await mockApi(page)

    await page.goto("/")
    await page.getByRole("link", { name: "Buyurtmalar", exact: true }).click()

    await expect(page).toHaveURL(/\/orders$/)
    await expect(page.getByRole("heading", { name: "Buyurtmalar" })).toBeVisible()
  })
})

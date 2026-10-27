import { expect, test, type Page } from "@playwright/test"
import { signIn } from "./support/auth"
import { mockApi } from "./support/mock-api"

const cardWithTitle = (page: Page, title: string) =>
  page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText(title, { exact: true }) })
    .first()

test.describe("manager dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await mockApi(page)
  })

  test("renders the KPI cards computed from the orders feed", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.getByRole("heading", { name: "Boshqaruv paneli" })
    ).toBeVisible()

    await expect(cardWithTitle(page, "Jami buyurtmalar")).toContainText("3")
    await expect(cardWithTitle(page, "Yetkazildi")).toContainText("33% bajarildi")
    await expect(cardWithTitle(page, "Yo'lda")).toContainText("1")
    await expect(cardWithTitle(page, "Biriktirilmagan")).toContainText("1")
  })

  test("warns about orders that have no courier yet", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.getByText("1 ta buyurtma hali dastavshikka biriktirilmagan")
    ).toBeVisible()
  })

  test("lists couriers with their delivery counts", async ({ page }) => {
    await page.goto("/")

    const table = page
      .locator("table")
      .filter({ hasText: "Dastavshik" })
      .first()

    await expect(table).toContainText("Sardor")
    await expect(table).toContainText("Dilshod")
  })

  test("renders the latest orders with status badges", async ({ page }) => {
    await page.goto("/")

    const recent = page
      .locator('[data-slot="card"]')
      .filter({ hasText: "So'nggi buyurtmalar" })

    await expect(recent.getByText("#101 · Chilonzor bozori")).toBeVisible()
    await expect(recent.getByText("Yangi buyurtma")).toBeVisible()
  })

  test("shows the backend error when orders cannot be loaded", async ({ page }) => {
    await page.unroute("**/*")
    await mockApi(page, {
      ordersStatus: 500,
      ordersMessage: "Buyurtmalar bazasi ishlamayapti",
    })

    await page.goto("/")

    await expect(
      page.getByText("Buyurtmalar bazasi ishlamayapti")
    ).toBeVisible()
  })

  test("shows empty states when there are no orders today", async ({ page }) => {
    await page.unroute("**/*")
    await mockApi(page, { orders: [] })

    await page.goto("/")

    await expect(page.getByText("Bugun buyurtmalar yo'q")).toBeVisible()
    await expect(page.getByText("Hammasi biriktirilgan 🎉")).toBeVisible()
  })
})

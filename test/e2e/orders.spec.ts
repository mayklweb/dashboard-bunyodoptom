import { expect, test } from "@playwright/test"
import { signIn } from "./support/auth"
import { mockApi } from "./support/mock-api"

test.describe("orders page", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await mockApi(page)
  })

  test("lists orders with customer, store, amount and status", async ({ page }) => {
    await page.goto("/orders")

    await expect(page.getByRole("heading", { name: "Buyurtmalar" })).toBeVisible()

    const table = page.getByRole("table")
    await expect(table.getByText("#101")).toBeVisible()
    await expect(table.getByText("Ali Valiyev")).toBeVisible()
    await expect(table.getByText("+998901234567")).toBeVisible()
    await expect(table.getByText("Chilonzor bozori")).toBeVisible()

    const rows = table.getByRole("row")
    await expect(rows).toHaveCount(4) // header + 3 orders
  })

  test("translates payment method and status labels", async ({ page }) => {
    await page.goto("/orders")

    const table = page.getByRole("table")
    await expect(table.getByText("Naqd", { exact: true })).toBeVisible()
    await expect(table.getByText("Karta", { exact: true })).toBeVisible()
    await expect(table.getByText("To'lanmagan")).toBeVisible()
    await expect(table.getByText("Yangi buyurtma")).toBeVisible()
    await expect(table.getByText("Yo'lda")).toBeVisible()
    await expect(table.getByText("Yetkazildi")).toBeVisible()
  })

  test("opens the order drawer with products and totals", async ({ page }) => {
    await page.goto("/orders")

    const row = page.getByRole("row").filter({ hasText: "#101" })
    await row.getByRole("button").click()

    const drawer = page.getByRole("dialog")
    await expect(drawer).toBeVisible()
    await expect(drawer.getByText("Buyurtma #101")).toBeVisible()
    await expect(drawer.getByText("Ali Valiyev")).toBeVisible()
    await expect(drawer.getByText("Olma")).toBeVisible()
    await expect(drawer.getByText("Jami summa")).toBeVisible()
  })

  test("shows an empty state when the API returns no orders", async ({ page }) => {
    await page.unroute("**/*")
    await mockApi(page, { orders: [] })

    await page.goto("/orders")

    await expect(page.getByText("Buyurtmalar topilmadi")).toBeVisible()
  })

  test("keeps the page usable when the API fails", async ({ page }) => {
    await page.unroute("**/*")
    await mockApi(page, { ordersStatus: 500 })

    await page.goto("/orders")

    // the table falls back to an empty list rather than crashing
    await expect(page.getByRole("heading", { name: "Buyurtmalar" })).toBeVisible()
    await expect(page.getByText("Buyurtmalar topilmadi")).toBeVisible()
  })
})

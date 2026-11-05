import { expect, test } from "@playwright/test"
import { COURIER_USER, signIn } from "./support/auth"
import { mockApi } from "./support/mock-api"

test("shows assigned orders from regions other than Xorazm", async ({ page }) => {
  await signIn(page, COURIER_USER)
  await mockApi(page, { orders: [{
    id: 201, number: "201", status: "new", total_amount: 10000,
    market: { name: "Samarqand bozori", address: "Registon", region: "Samarqand" },
  }] })
  await page.goto("/my-orders")
  await expect(page.getByText("Samarqand bozori", { exact: true })).toBeVisible()
  await expect(page.getByText("Buyurtma #201")).toBeVisible()
})

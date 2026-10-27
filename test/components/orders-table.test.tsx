import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { OrdersTable } from "@/app/widgets/orders/OrdersTable"
import type { Order } from "@/types/order"

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 101,
    status: "new",
    payment_method: "cash",
    payed: 0,
    user_id: 1,
    market_id: 1,
    total_amount: 250_000,
    created_at: "2026-10-20T10:00:00.000Z",
    user: { id: 1, name: "Ali Valiyev", phone: "+998901234567" },
    market: {
      id: 2,
      name: "Chilonzor",
      address: "3-uy",
      region: "Toshkent",
      district: null,
    },
    products: [],
    address: {
      id: 1,
      user_id: 1,
      region: "Toshkent",
      district: null,
      address: "1-uy",
      is_default: 1,
      created_at: "2026-10-20T10:00:00.000Z",
      updated_at: "2026-10-20T10:00:00.000Z",
    },
    ...overrides,
  } as Order
}

const normalize = (value: string) => value.replace(/\u00a0|\u202f/g, " ")

describe("OrdersTable", () => {
  it("shows an empty state when there are no orders", () => {
    render(<OrdersTable orders={[]} onView={vi.fn()} />)

    expect(screen.getByText("Buyurtmalar topilmadi")).toBeInTheDocument()
    expect(screen.queryByRole("table")).not.toBeInTheDocument()
  })

  it("renders the header row and one row per order", () => {
    render(
      <OrdersTable
        orders={[makeOrder({ id: 101 }), makeOrder({ id: 102, status: "delivered" })]}
        onView={vi.fn()}
      />
    )

    const headers = screen.getAllByRole("columnheader").map((h) => h.textContent)
    expect(headers).toEqual([
      "№",
      "Mijoz",
      "Do'kon",
      "Summa",
      "To'lov",
      "Holati",
      "Sana",
      "Amallar",
    ])

    // header row + 2 body rows
    expect(screen.getAllByRole("row")).toHaveLength(3)
    expect(screen.getByText("#101")).toBeInTheDocument()
    expect(screen.getByText("#102")).toBeInTheDocument()
  })

  it("shows customer, phone, store and amount", () => {
    render(<OrdersTable orders={[makeOrder()]} onView={vi.fn()} />)

    expect(screen.getByText("Ali Valiyev")).toBeInTheDocument()
    expect(screen.getByText("+998901234567")).toBeInTheDocument()
    expect(screen.getByText("Chilonzor")).toBeInTheDocument()
    expect(
      screen.getByText(normalize(`${new Intl.NumberFormat("uz-UZ").format(250_000)} so'm`))
    ).toBeInTheDocument()
  })

  it("translates payment method and marks paid orders", () => {
    render(
      <OrdersTable
        orders={[makeOrder({ payment_method: "card", payed: 1 })]}
        onView={vi.fn()}
      />
    )

    expect(screen.getByText("Karta")).toBeInTheDocument()
    expect(screen.getByText("To'langan")).toBeInTheDocument()
    expect(screen.queryByText("To'lanmagan")).not.toBeInTheDocument()
  })

  it("marks unpaid orders", () => {
    render(<OrdersTable orders={[makeOrder({ payed: 0 })]} onView={vi.fn()} />)

    expect(screen.getByText("To'lanmagan")).toBeInTheDocument()
  })

  it("calls onView with the clicked order", async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const order = makeOrder({ id: 777 })

    render(<OrdersTable orders={[order]} onView={onView} />)

    const row = screen.getByText("#777").closest("tr")!
    await user.click(within(row).getByRole("button"))

    expect(onView).toHaveBeenCalledTimes(1)
    expect(onView).toHaveBeenCalledWith(order)
  })

  it("tolerates a missing orders prop", () => {
    // @ts-expect-error runtime guard for undefined data
    render(<OrdersTable onView={vi.fn()} />)

    expect(screen.getByText("Buyurtmalar topilmadi")).toBeInTheDocument()
  })
})

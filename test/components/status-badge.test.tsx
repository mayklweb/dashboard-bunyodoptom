import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusBadge } from "@/app/widgets/orders/StatusBadge"

describe("StatusBadge", () => {
  it.each([
    ["new", "Yangi buyurtma"],
    ["on_the_way", "Yo'lda"],
    ["delivered", "Yetkazildi"],
    ["cancelled", "Bekor qilindi"],
  ] as const)("renders the Uzbek label for %s", (status, label) => {
    render(<StatusBadge status={status} />)

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("applies a colour class per status", () => {
    const { rerender } = render(<StatusBadge status="new" />)
    expect(screen.getByText("Yangi buyurtma")).toHaveClass("bg-blue-100")

    rerender(<StatusBadge status="delivered" />)
    expect(screen.getByText("Yetkazildi")).toHaveClass("bg-green-100")

    rerender(<StatusBadge status="cancelled" />)
    expect(screen.getByText("Bekor qilindi")).toHaveClass("bg-red-100")
  })
})

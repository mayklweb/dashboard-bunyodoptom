import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatsCards } from "@/app/widgets/analytics/StatsCards"
import type { AnalyticsSummary } from "@/lib/utils/compute-analytics"

const summary: AnalyticsSummary = {
  totalOrders: 42,
  totalRevenue: 12_345_600,
  paidRevenue: 9_000_000,
  unpaidRevenue: 3_345_600,
  statusCounts: { new: 10, delivered: 32 },
  topProducts: [],
  revenueByDay: [],
}

const normalize = (value: string) => value.replace(/\u00a0|\u202f/g, " ")

describe("StatsCards", () => {
  it("renders one card per KPI with formatted money", () => {
    render(<StatsCards summary={summary} />)

    expect(screen.getByText("Jami buyurtmalar")).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()

    expect(screen.getByText("Jami summa")).toBeInTheDocument()
    expect(
      screen.getByText(
        normalize(
          `${new Intl.NumberFormat("uz-UZ").format(12_345_600)} so'm`
        )
      )
    ).toBeInTheDocument()

    expect(screen.getByText("To'langan")).toBeInTheDocument()
    expect(screen.getByText("To'lanmagan")).toBeInTheDocument()
  })

  it("shows the currency suffix on money values", () => {
    const { container } = render(<StatsCards summary={summary} />)

    expect(container.textContent?.match(/so'm/g)).toHaveLength(3)
  })

  it("renders zeros for an empty summary", () => {
    const { container } = render(
      <StatsCards
        summary={{
          totalOrders: 0,
          totalRevenue: 0,
          paidRevenue: 0,
          unpaidRevenue: 0,
          statusCounts: {},
          topProducts: [],
          revenueByDay: [],
        }}
      />
    )

    expect(screen.getByText("0")).toBeInTheDocument()
    expect(container.textContent?.match(/0 so'm/g)).toHaveLength(3)
  })
})

// app/(dashboard)/analytics/page.tsx
"use client"

import { useMemo } from "react"
import { useOrders } from "@/lib/hooks/use-orders"
import { computeAnalytics } from "@/lib/utils/compute-analytics"
import { StatsCards } from "@/app/widgets/analytics/StatsCards"
import { OrderStatusChart } from "@/app/widgets/analytics/OrderStatusChart"
import { RevenueChart } from "@/app/widgets/analytics/RevenueChart"
import { TopProductsTable } from "@/app/widgets/analytics/TopProductsTable"

export default function Analytics() {
  const { data: orders, isLoading } = useOrders()

  const summary = useMemo(() => computeAnalytics(orders ?? []), [orders])

  if (isLoading) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        Yuklanmoqda...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueChart summary={summary} />
        <OrderStatusChart summary={summary} />
      </div>

      <TopProductsTable summary={summary} />
    </div>
  )
}
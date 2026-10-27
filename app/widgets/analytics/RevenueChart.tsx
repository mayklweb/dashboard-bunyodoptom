// widgets/analytics/RevenueChart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import type { AnalyticsSummary } from "@/lib/utils/compute-analytics"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("uz-UZ").format(value)

export function RevenueChart({ summary }: { summary: AnalyticsSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          So&apos;nggi kunlar bo&apos;yicha daromad
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary.revenueByDay.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Ma&apos;lumot yo&apos;q
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatPrice(v)}
                width={70}
              />
              <Tooltip
                formatter={(value) => formatPrice(Number(value ?? 0)) + " so'm"}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

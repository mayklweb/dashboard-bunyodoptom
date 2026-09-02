// widgets/analytics/OrderStatusChart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { AnalyticsSummary } from "@/lib/utils/compute-analytics"

const statusLabel: Record<string, string> = {
  pending: "Kutilmoqda",
  processing: "Jarayonda",
  completed: "Bajarildi",
  cancelled: "Bekor qilindi",
}

const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  completed: "#22c55e",
  cancelled: "#ef4444",
}

export function OrderStatusChart({ summary }: { summary: AnalyticsSummary }) {
  const data = Object.entries(summary.statusCounts).map(([status, count]) => ({
    name: statusLabel[status] ?? status,
    value: count,
    color: statusColor[status] ?? "#94a3b8",
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Buyurtmalar holati</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Ma'lumot yo'q
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
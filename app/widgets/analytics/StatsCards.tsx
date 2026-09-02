// widgets/analytics/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Wallet, CheckCircle2, Clock } from "lucide-react"
import type { AnalyticsSummary } from "@/lib/utils/compute-analytics"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("uz-UZ").format(value) + " so'm"

export function StatsCards({ summary }: { summary: AnalyticsSummary }) {
  const cards = [
    {
      title: "Jami buyurtmalar",
      value: summary.totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      title: "Jami summa",
      value: formatPrice(summary.totalRevenue),
      icon: Wallet,
    },
    {
      title: "To'langan",
      value: formatPrice(summary.paidRevenue),
      icon: CheckCircle2,
    },
    {
      title: "To'lanmagan",
      value: formatPrice(summary.unpaidRevenue),
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
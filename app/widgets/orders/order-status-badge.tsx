// widgets/orders/order-status-badge.tsx
import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/types/order"

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Kutilmoqda", variant: "outline" },
  processing: { label: "Jarayonda", variant: "secondary" },
  completed: { label: "Bajarildi", variant: "default" },
  cancelled: { label: "Bekor qilindi", variant: "destructive" },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] ?? { label: status, variant: "outline" as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
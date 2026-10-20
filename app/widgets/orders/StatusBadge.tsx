// widgets/orders/StatusBadge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { STATUS_LABEL, type OrderStatus } from "@/lib/courier-api"

const STYLE: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  on_the_way: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  delivered: "bg-green-100 text-green-700 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn("whitespace-nowrap border-transparent", STYLE[status])}
    >
      {STATUS_LABEL[status]}
    </Badge>
  )
}
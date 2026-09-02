// widgets/orders/OrdersTable.tsx
"use client"

import { Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrderStatusBadge } from "./order-status-badge"
import type { Order } from "@/types/order"

interface OrdersTableProps {
  orders: Order[]
  onView: (order: Order) => void
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("uz-UZ").format(value) + " so'm"

const paymentLabel: Record<string, string> = {
  cash: "Naqd",
  card: "Karta",
  transfer: "O'tkazma",
}

export function OrdersTable({ orders, onView }: OrdersTableProps) {
  const safeOrders = orders ?? []

  if (safeOrders.length === 0) {
    return (
      <div className="rounded-md border border-border p-8 text-center text-muted-foreground">
        Buyurtmalar topilmadi
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Mijoz</TableHead>
            <TableHead>Do'kon</TableHead>
            <TableHead>Summa</TableHead>
            <TableHead>To'lov</TableHead>
            <TableHead>Holati</TableHead>
            <TableHead>Sana</TableHead>
            <TableHead className="text-right">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{order.user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {order.user?.phone}
                  </span>
                </div>
              </TableCell>
              <TableCell>{order.market?.name}</TableCell>
              <TableCell>{formatPrice(order.total_amount)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <span>{paymentLabel[order.payment_method] ?? order.payment_method}</span>
                  {order.payed ? (
                    <Badge variant="default" className="text-[10px]">
                      To'langan
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      To'lanmagan
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("uz-UZ")}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Button variant="ghost" size="icon" onClick={() => onView(order)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
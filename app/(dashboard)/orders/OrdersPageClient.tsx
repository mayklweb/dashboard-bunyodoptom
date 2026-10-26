// app/(dashboard)/orders/OrdersPageClient.tsx
"use client"

import { useState } from "react"
import { OrdersTable } from "@/app/widgets/orders/OrdersTable"
import { useOrders } from "@/lib/hooks/use-orders"
import type { Order } from "@/types/order"
import { OrderDetailDrawer } from "@/app/widgets/orders/OrderDetailDrawer"

export function OrdersPageClient() {
  const { data: orders, isLoading } = useOrders()


  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleView = (order: Order) => {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Buyurtmalar</h1>
      </div>

      {isLoading ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          Yuklanmoqda...
        </div>
      ) : (
        <OrdersTable orders={orders ?? []} onView={handleView} />
      )}

      <OrderDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        order={selectedOrder}
      />
    </div>
  )
}
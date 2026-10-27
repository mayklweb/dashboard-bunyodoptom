// widgets/orders/OrderDetailDialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getImageUrl } from "@/lib/utils/get-image-url"
import { useUpdateOrderStatus } from "@/lib/hooks/use-orders"
import type { Order, OrderStatus } from "@/types/order"

interface OrderDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

const formatPrice = (value: number | string) =>
  new Intl.NumberFormat("uz-UZ").format(Number(value)) + " so'm"

const paymentLabel: Record<string, string> = {
  cash: "Naqd",
  card: "Karta",
  transfer: "O'tkazma",
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Yangi" },
  { value: "on_the_way", label: "Yo'lda" },
  { value: "delivered", label: "Yetkazildi" },
  { value: "canceled", label: "Bekor qilindi" },
]

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailDialogProps) {
  const updateStatusMutation = useUpdateOrderStatus()

  if (!order) return null

  const handleStatusChange = (status: OrderStatus) => {
    updateStatusMutation.mutate({ id: order.id, status })
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <div className="w-125">
          <DialogContent className="w-full gap-0 overflow-hidden p-5">
            <DialogHeader className="flex border-b px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl">
                    Buyurtma #{order.id}
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    {new Date(order.created_at).toLocaleString("uz-UZ")}
                  </DialogDescription>
                </div>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    handleStatusChange(value as OrderStatus)
                  }
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger className="h-10 w-45 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-base"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DialogHeader>

            <div className="flex w-full flex-col gap-6 overflow-y-auto px-6 py-6">
              {/* Mijoz va do'kon ma'lumotlari */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    MIJOZ
                  </p>
                  <p className="text-base font-medium">{order.user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user?.phone}
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    DO&apos;KON
                  </p>
                  <p className="text-base font-medium">{order.market?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.market?.region}
                    {order.market?.district ? `, ${order.market.district}` : ""}
                    {order.market?.address ? `, ${order.market.address}` : ""}
                  </p>
                </div>
              </div>

              {/* Yetkazib berish manzili */}
              {order.address && (
                <div className="rounded-md border p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    YETKAZIB BERISH MANZILI
                  </p>
                  <p className="text-base">
                    {order.address.region}
                    {order.address.district
                      ? `, ${order.address.district}`
                      : ""}
                    {order.address.address ? `, ${order.address.address}` : ""}
                  </p>
                </div>
              )}

              <Separator />

              {/* Mahsulotlar ro'yxati */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium text-muted-foreground">
                  MAHSULOTLAR
                </p>
                {order.products?.map((item) => {
                  const primaryImage =
                    item.product?.images?.find((img) => img.is_primary === 1) ??
                    item.product?.images?.[0]

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-md border p-4"
                    >
                      <Avatar className="h-16 w-16 rounded-md">
                        {primaryImage && (
                          <AvatarImage
                            src={getImageUrl(primaryImage.url) ?? undefined}
                            alt={item.product?.name}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="rounded-md">
                          {item.product?.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="text-base font-medium">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.qty} x {formatPrice(item.unit_price)}
                        </p>
                      </div>

                      <p className="text-base font-semibold">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  )
                })}
              </div>

              <Separator />

              {/* Jami va to'lov */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    To&apos;lov usuli:{" "}
                    {paymentLabel[order.payment_method] ?? order.payment_method}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Holati: {order.payed ? "To'langan" : "To'lanmagan"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Jami summa</p>
                  <p className="text-2xl font-semibold">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  )
}

"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"

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

interface OrderDetailDrawerProps {
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

export function OrderDetailDrawer({
  open,
  onOpenChange,
  order,
}: OrderDetailDrawerProps) {
  const updateStatusMutation = useUpdateOrderStatus()

  if (!order) return null

  const handleStatusChange = (status: OrderStatus) => {
    updateStatusMutation.mutate({
      id: order.id,
      status,
    })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <div className="w-125">
        <DrawerContent className="h-full w-125 gap-3 p-5">
          {/* Header */}
          <DrawerHeader className="border-b px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DrawerTitle className="text-xl font-semibold">
                  Buyurtma #{order.id}
                </DrawerTitle>

                <DrawerDescription className="mt-1 text-sm">
                  {new Date(order.created_at).toLocaleString("uz-UZ")}
                </DrawerDescription>
              </div>

              <Select
                value={
                  order.status === ("cancelled" as string)
                    ? "canceled"
                    : order.status
                }
                onValueChange={(value) =>
                  handleStatusChange(value as OrderStatus)
                }
                disabled={updateStatusMutation.isPending}
              >
                <SelectTrigger className="h-10 w-40 shrink-0">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DrawerHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6 px-6 py-6">
              {/* Customer + Store */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Mijoz
                  </p>

                  <p className="font-medium">{order.user?.name || "—"}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.user?.phone || "—"}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Do&apos;kon
                  </p>

                  <p className="font-medium">{order.market?.name || "—"}</p>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {order.market?.region}

                    {order.market?.district ? `, ${order.market.district}` : ""}

                    {order.market?.address ? `, ${order.market.address}` : ""}
                  </p>
                </div>
              </div>

              {/* Delivery address */}
              {order.address && (
                <div className="rounded-lg border p-4">
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Yetkazib berish manzili
                  </p>

                  <p className="text-sm leading-6">
                    {order.address.region}

                    {order.address.district
                      ? `, ${order.address.district}`
                      : ""}

                    {order.address.address ? `, ${order.address.address}` : ""}
                  </p>
                </div>
              )}

              <Separator />

              {/* Products */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Mahsulotlar
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {order.products?.length || 0} ta
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {order.products?.map((item) => {
                    const primaryImage =
                      item.product?.images?.find(
                        (img) => img.is_primary === 1
                      ) ?? item.product?.images?.[0]

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <Avatar className="h-14 w-14 shrink-0 rounded-md">
                          {primaryImage && (
                            <AvatarImage
                              src={getImageUrl(primaryImage.url) ?? undefined}
                              alt={item.product?.name}
                              className="object-cover"
                            />
                          )}

                          <AvatarFallback className="rounded-md text-xs">
                            {item.product?.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.product?.name || "Mahsulot"}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.qty} × {formatPrice(item.unit_price)}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* Payment + Total */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        To&apos;lov usuli
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {paymentLabel[order.payment_method] ??
                          order.payment_method}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        To&apos;lov holati
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {order.payed ? "To'langan" : "To'lanmagan"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Jami summa</p>

                    <p className="mt-1 text-2xl font-bold">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </div>
    </Drawer>
  )
}

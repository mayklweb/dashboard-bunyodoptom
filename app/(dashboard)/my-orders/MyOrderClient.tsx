// widgets/orders/MyOrdersPage.tsx  (dastavshik)
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AlertCircle, Loader2, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  fetchCourierOrders,
  updateOrderStatus,
  isActiveStatus,
  formatMoney,
  todayISO,
  type CourierOrder,
  type OrderStatus,
} from "@/lib/courier-api"
import { CancelDialog } from "@/app/widgets/orders/CancelDialog"
import { StatusBadge } from "@/app/widgets/orders/StatusBadge"

type Filter = "all" | OrderStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Barchasi" },
  { key: "new", label: "Kutilmoqda" },
  { key: "on_the_way", label: "Yo'lda" },
  { key: "delivered", label: "Yetkazildi" },
  { key: "cancelled", label: "Bekor" },
]

export function MyOrdersClient() {
  const [orders, setOrders] = useState<CourierOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState(todayISO())
  const [filter, setFilter] = useState<Filter>("all")
  const [busyId, setBusyId] = useState<CourierOrder["id"] | null>(null)
  const [cancelTarget, setCancelTarget] = useState<CourierOrder | null>(null)

  const load = useCallback(async () => {
    setLoading(true)

    try {
      const result = await fetchCourierOrders(date)

      console.log("API dan kelgan natija:", result)
      console.log("Buyurtmalar soni:", result.length)

      setOrders(result)
      setError(null)
    } catch (e) {
      console.error("Buyurtmalar xatosi:", e)

      setError(e instanceof Error ? e.message : "Buyurtmalarni yuklab bo'lmadi")
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    load()
  }, [load])

  const courierDistrict = "Urganch"

  const courierRegion = "Xorazm"

  const visible = useMemo(
    () =>
      orders.filter((order) => {
        const region = order.market?.region?.trim().toLowerCase()

        const matchesRegion = region === courierRegion.trim().toLowerCase()

        const matchesStatus = filter === "all" || order.status === filter

        return matchesRegion && matchesStatus
      }),
    [orders, filter]
  )

  console.log("Barcha buyurtmalar:", orders)
  console.log("Birinchi buyurtma hududi:", orders[0]?.market)
  console.log(visible)

  async function changeStatus(
    order: CourierOrder,
    status: OrderStatus,
    reason?: string
  ) {
    setBusyId(order.id)
    try {
      await updateOrderStatus(order.id, status, reason)
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status } : o))
      )
      toast.success(
        status === "delivered"
          ? `#${order.number} yetkazildi`
          : `#${order.number} bekor qilindi`
      )
      setCancelTarget(null)
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Statusni o'zgartirib bo'lmadi"
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Mening buyurtmalarim</h1>
        <Input
          type="date"
          className="w-40"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const n =
            f.key === "all"
              ? orders.length
              : orders.filter((o) => o.status === f.key).length
          return (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
            >
              {f.label} ({n})
            </Button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : visible.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Buyurtmalar topilmadi
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => (
            <Card key={o.id}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{o.market.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Buyurtma #{o.number}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>

                {o.address && (
                  <p className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    {o.address}
                  </p>
                )}

                <p className="text-lg font-bold">{formatMoney(o.amount)}</p>

                {isActiveStatus(o.status) && (
                  <div className="flex flex-wrap gap-2">
                    {o.phone && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${o.phone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Qo&apos;ng&apos;iroq
                        </a>
                      </Button>
                    )}
                    {o.address && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            o.address
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Xaritada
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      disabled={busyId === o.id}
                      onClick={() => changeStatus(o, "delivered")}
                    >
                      Yetkazildi
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busyId === o.id}
                      onClick={() => setCancelTarget(o)}
                    >
                      Bekor qilish
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CancelDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        orderLabel={
          cancelTarget
            ? `#${cancelTarget.number} · ${cancelTarget.market.name}`
            : ""
        }
        loading={busyId !== null}
        onConfirm={(reason) =>
          cancelTarget && changeStatus(cancelTarget, "cancelled", reason)
        }
      />
    </div>
  )
}

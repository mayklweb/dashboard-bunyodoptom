// widgets/dashboard/CourierDashboard.tsx
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AlertCircle, Loader2, MapPin, Phone, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  fetchCourierOrders,
  updateOrderStatus,
  formatMoney,
  todayISO,
  type CourierOrder,
  type OrderStatus,
} from "@/lib/courier-api"
import { CancelDialog } from "@/app/widgets/orders/CancelDialog"
import { StatusBadge } from "@/app/widgets/orders/StatusBadge"
// import { CancelDialog } from "@/widgets/orders/CancelDialog"
// import { StatusBadge } from "@/widgets/orders/StatusBadge"

type Filter = "all" | OrderStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Barchasi" },
  { key: "new", label: "Kutilmoqda" },
  { key: "on_the_way", label: "Tayyorlanmoqda" },
  { key: "delivered", label: "Yetkazildi" },
]

function StatCard({
  title,
  value,
  hint,
  className,
}: {
  title: string
  value: string | number
  hint?: string
  className?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", className)}>{value}</div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}

export function CourierDashboardClient() {
  const [orders, setOrders] = useState<CourierOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const [busyId, setBusyId] = useState<CourierOrder["id"] | null>(null)
  const [cancelTarget, setCancelTarget] = useState<CourierOrder | null>(null)

  const load = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true)
    try {
      setOrders(await fetchCourierOrders(todayISO()))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ma'lumotni yuklab bo'lmadi")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Birinchi yuklash + har 60 soniyada yangi buyurtmalarni tekshirish
  useEffect(() => {
    load()
    const t = setInterval(() => load(true), 60_000)
    return () => clearInterval(t)
  }, [load])

  const stats = useMemo(() => {
    const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length
    const delivered = orders.filter((o) => o.status === "delivered")
    const total = orders.length
    return {
      total,
      delivered: delivered.length,
      new: count("new"),
      on_the_way: count("on_the_way"),
      cancelled: count("cancelled"),
      collected: delivered.reduce((sum, o) => sum + o.amount, 0),
      percent: total ? Math.round((delivered.length / total) * 100) : 0,
    }
  }, [orders])

  // Joriy buyurtma: avval yo'ldagi, bo'lmasa birinchi yangi
  const current = useMemo(
    () =>
      orders.find((o) => o.status === "new") ??
      orders.find((o) => o.status === "new") ??
      null,
    [orders]
  )

  const visible = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  )

  async function changeStatus(
    order: CourierOrder,
    status: OrderStatus,
    reason?: string
  ) {
    setBusyId(order.id)
    try {
      await updateOrderStatus(order.id, status, reason)
      // Tez ko'rinishi uchun lokal yangilaymiz, keyin serverdan qayta olamiz
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status } : o))
      )
      setError(null)
      setCancelTarget(null)
      toast.success(
        status === "delivered"
          ? `#${order.number} yetkazildi`
          : `#${order.number} bekor qilindi`
      )
      load(true)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Statusni o'zgartirib bo'lmadi")
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 p-4">
      {/* SARLAVHA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Bugungi dastavkalar</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("uz-UZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => load(true)}
          disabled={refreshing}
        >
          <RefreshCw
            className={cn("mr-2 h-4 w-4", refreshing && "animate-spin")}
          />
          Yangilash
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 1. BUGUNGI KO'RSATKICHLAR */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          title="Yetkazildi"
          value={`${stats.delivered} / ${stats.total}`}
          hint={`${stats.percent}% bajarildi`}
          className="text-green-600"
        />
        <StatCard
          title="Kutilmoqda"
          value={stats.new}
          hint="Yangi buyurtmalar"
          className="text-blue-600"
        />
        <StatCard
          title="Yo'lsda"
          value={stats.on_the_way}
          hint="Yetkazilishi kerak"
          className="text-amber-600"
        />
        <StatCard
          title="Bekor qilingan"
          value={stats.cancelled}
          className="text-red-600"
        />
      </div>

      {/* Bajarilish progressi */}
      <Progress value={stats.percent} className="h-2" />

      {/* 2. JORIY BUYURTMA */}
      {current ? (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Navbatdagi buyurtma
              </CardTitle>
              <StatusBadge status={current.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-lg font-semibold">{current.market.name}</p>
              <p className="text-sm text-muted-foreground">
                Buyurtma #{current.number}
              </p>
            </div>

            {current.address && (
              <p className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {current.address}
              </p>
            )}

            <p className="text-xl font-bold">{formatMoney(current.amount)}</p>

            <div className="grid grid-cols-2 gap-2">
              {current.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${current.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Qo&apos;ng&apos;iroq
                  </a>
                </Button>
              )}
              {current.address && (
                <Button variant="outline" asChild>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      current.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Xaritada
                  </a>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                disabled={busyId === current.id}
                onClick={() => changeStatus(current, "delivered")}
              >
                Yetkazildi
              </Button>
              <Button
                variant="destructive"
                disabled={busyId === current.id}
                onClick={() => setCancelTarget(current)}
              >
                Bekor qilish
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {stats.total === 0
              ? "Bugun sizga buyurtma biriktirilmagan"
              : "Barcha buyurtmalar bajarildi 🎉"}
          </CardContent>
        </Card>
      )}

      {/* 3. BUGUNGI BUYURTMALAR RO'YXATI */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Buyurtmalar ro&apos;yxati</CardTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            {FILTERS.map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={filter === f.key ? "default" : "outline"}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {visible.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Buyurtmalar topilmadi
            </p>
          )}
          {visible.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  #{o.number} · {o.market.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {o.address || "Manzil ko'rsatilmagan"}
                </p>
              </div>
              <div className="shrink-0 space-y-1 text-right">
                <p className="text-sm font-semibold">{formatMoney(o.amount)}</p>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. YIG'ILGAN SUMMA */}
      <StatCard
        title="Bugun yetkazilgan buyurtmalar summasi"
        value={formatMoney(stats.collected)}
      />

      <CancelDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        orderLabel={
          cancelTarget ? `#${cancelTarget.number} · ${cancelTarget.market.name}` : ""
        }
        loading={busyId !== null}
        onConfirm={(reason) =>
          cancelTarget && changeStatus(cancelTarget, "cancelled", reason)
        }
      />
    </div>
  )
}
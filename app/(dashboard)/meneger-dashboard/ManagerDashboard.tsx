// widgets/dashboard/ManagerDashboard.tsx
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle, Loader2, RefreshCw, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatMoney, todayISO } from "@/lib/courier-api"
import {
  assignOrders,
  fetchAllOrdersForDate,
  fetchCouriers,
  type Courier,
  type ManagerOrder,
} from "@/lib/orders-api"
import { StatusBadge } from "@/app/widgets/orders/StatusBadge"

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

export function ManagerDashboardClient() {
  const [orders, setOrders] = useState<ManagerOrder[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assigningId, setAssigningId] = useState<ManagerOrder["id"] | null>(null)

  const load = useCallback(async () => {
    try {
      const [o, c] = await Promise.all([
        fetchAllOrdersForDate(todayISO()),
        fetchCouriers(),
      ])
      setOrders(o)
      setCouriers(c)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ma'lumotni yuklab bo'lmadi")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setRefreshing(true)
    void load()
  }, [load])

  // Birinchi yuklash + har 60 soniyada yangilash
  useEffect(() => {
    // load() faqat so'rov javobidan keyin setState qiladi
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
    const t = setInterval(refresh, 60_000)
    return () => clearInterval(t)
  }, [load, refresh])

  const stats = useMemo(() => {
    const by = (s: ManagerOrder["status"]) =>
      orders.filter((o) => o.status === s)
    const delivered = by("delivered")
    const unassigned = orders.filter(
      (o) => !o.courierId && (o.status === "new" || o.status === "on_the_way")
    )
    return {
      total: orders.length,
      unassigned,
      onTheWay: by("on_the_way").length,
      delivered: delivered.length,
      cancelled: by("cancelled").length,
      revenue: delivered.reduce((s, o) => s + o.amount, 0),
      percent: orders.length
        ? Math.round((delivered.length / orders.length) * 100)
        : 0,
    }
  }, [orders])

  // Har bir dastavshik bo'yicha statistika (buyurtmasi yo'qlar ham ko'rinadi)
  const perCourier = useMemo(() => {
    return couriers
      .map((c) => {
        const mine = orders.filter((o) => String(o.courierId) === String(c.id))
        const count = (s: ManagerOrder["status"]) =>
          mine.filter((o) => o.status === s).length
        const delivered = mine.filter((o) => o.status === "delivered")
        return {
          id: c.id,
          name: c.name,
          total: mine.length,
          delivered: delivered.length,
          onTheWay: count("on_the_way"),
          pending: count("new"),
          cancelled: count("cancelled"),
          amount: delivered.reduce((s, o) => s + o.amount, 0),
          percent: mine.length
            ? Math.round((delivered.length / mine.length) * 100)
            : 0,
        }
      })
      .sort((a, b) => b.total - a.total)
  }, [couriers, orders])

  const chartData = perCourier
    .filter((c) => c.total > 0)
    .map((c) => ({
      name: c.name,
      Yetkazildi: c.delivered,
      "Yo'lda": c.onTheWay,
      Kutilmoqda: c.pending,
      Bekor: c.cancelled,
    }))

  async function quickAssign(order: ManagerOrder, courierId: string) {
    setAssigningId(order.id)
    try {
      await assignOrders([order.id], courierId)
      const name = couriers.find((c) => String(c.id) === courierId)?.name
      toast.success(`#${order.number} ${name ?? "dastavshik"}ga biriktirildi`)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Biriktirib bo'lmadi")
    } finally {
      setAssigningId(null)
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
    <div className="space-y-4 p-4">
      {/* SARLAVHA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Boshqaruv paneli</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("uz-UZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · bugungi dastavkalar
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
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

      {/* DIQQAT: biriktirilmagan buyurtmalar */}
      {stats.unassigned.length > 0 && (
        <Alert className="border-amber-300 bg-amber-50 text-amber-900">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            <span>
              {stats.unassigned.length} ta buyurtma hali dastavshikka
              biriktirilmagan
            </span>
            <Button size="sm" asChild>
              <Link href="/orders">Buyurtmalarga o&apos;tish</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* KO'RSATKICHLAR */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Jami buyurtmalar" value={stats.total} />
        <StatCard
          title="Yetkazildi"
          value={stats.delivered}
          hint={`${stats.percent}% bajarildi`}
          className="text-green-600"
        />
        <StatCard
          title="Yo'lda"
          value={stats.onTheWay}
          className="text-amber-600"
        />
        <StatCard
          title="Biriktirilmagan"
          value={stats.unassigned.length}
          className={stats.unassigned.length ? "text-red-600" : undefined}
        />
        <StatCard
          title="Yetkazilgan summa"
          value={formatMoney(stats.revenue)}
          hint={stats.cancelled ? `${stats.cancelled} ta bekor qilingan` : undefined}
        />
      </div>

      <Progress value={stats.percent} className="h-2" />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* GRAFIK: dastavshiklar kesimida */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Dastavshiklar bo&apos;yicha buyurtmalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Bugun biriktirilgan buyurtmalar yo&apos;q
              </p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Yetkazildi" stackId="a" fill="#16a34a" />
                    <Bar dataKey="Yo'lda" stackId="a" fill="#d97706" />
                    <Bar dataKey="Kutilmoqda" stackId="a" fill="#2563eb" />
                    <Bar dataKey="Bekor" stackId="a" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* TEZ BIRIKTIRISH */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Biriktirilmagan buyurtmalar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.unassigned.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Hammasi biriktirilgan 🎉
              </p>
            ) : (
              stats.unassigned.slice(0, 6).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-2 rounded-lg border p-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      #{o.number} · {o.storeName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatMoney(o.amount)}
                      {o.address ? ` · ${o.address}` : ""}
                    </p>
                  </div>
                  <Select
                    disabled={assigningId === o.id}
                    onValueChange={(v) => quickAssign(o, v)}
                  >
                    <SelectTrigger className="h-8 w-40 shrink-0">
                      <SelectValue placeholder="Biriktirish" />
                    </SelectTrigger>
                    <SelectContent>
                      {couriers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))
            )}
            {stats.unassigned.length > 6 && (
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/orders">
                  Yana {stats.unassigned.length - 6} ta — hammasini ko&apos;rish
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* DASTAVSHIKLAR JADVALI */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Dastavshiklar ish natijasi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dastavshik</TableHead>
                <TableHead className="text-center">Jami</TableHead>
                <TableHead className="text-center">Yetkazildi</TableHead>
                <TableHead className="text-center">Yo&apos;lda</TableHead>
                <TableHead className="min-w-32">Bajarilish</TableHead>
                <TableHead className="text-right">Summa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perCourier.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-20 text-center text-muted-foreground"
                  >
                    Dastavshiklar topilmadi
                  </TableCell>
                </TableRow>
              )}
              {perCourier.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-center">{c.total}</TableCell>
                  <TableCell className="text-center text-green-600">
                    {c.delivered}
                  </TableCell>
                  <TableCell className="text-center text-amber-600">
                    {c.onTheWay}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={c.percent} className="h-1.5" />
                      <span className="w-9 text-xs text-muted-foreground">
                        {c.percent}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {formatMoney(c.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SO'NGGI BUYURTMALAR */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">So&apos;nggi buyurtmalar</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">Hammasi</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {orders.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Bugun buyurtmalar yo&apos;q
            </p>
          )}
          {orders.slice(0, 8).map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  #{o.number} · {o.storeName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {o.courierName ?? "Biriktirilmagan"}
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
    </div>
  )
}
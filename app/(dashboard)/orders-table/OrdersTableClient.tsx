// widgets/orders/OrdersCalendar.tsx
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

/* ====== TAXMIN QILINGAN MAYDONLAR — o'zingizniki bilan almashtiring ====== */
const orderDistrict = (o: ManagerOrder) =>
  ((o as any).district as string | undefined) ?? "Tumansiz"
const courierDistrict = (c: Courier) =>
  ((c as any).district as string | undefined) ?? "Tumansiz"
/* ======================================================================== */

const DAY_NAMES = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"]

const STATUS_COLOR: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  on_the_way: "bg-amber-100 text-amber-800 border-amber-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

function toISO(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${day}`
}

function fromISO(iso: string) {
  return new Date(`${iso}T00:00:00`)
}

function mondayOf(iso: string) {
  const d = fromISO(iso)
  const shift = (d.getDay() + 6) % 7 // Dushanba = 0
  d.setDate(d.getDate() - shift)
  return d
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

const UNASSIGNED = "__unassigned__"

export function OrdersTableClient() {
  const [weekStart, setWeekStart] = useState(() => mondayOf(todayISO()))
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [ordersByDay, setOrdersByDay] = useState<Record<string, ManagerOrder[]>>(
    {}
  )
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ManagerOrder | null>(null)
  const [assigning, setAssigning] = useState(false)

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [cs, ...perDay] = await Promise.all([
        fetchCouriers(),
        ...days.map((d) => fetchAllOrdersForDate(toISO(d))),
      ])
      setCouriers(cs)
      const map: Record<string, ManagerOrder[]> = {}
      days.forEach((d, i) => (map[toISO(d)] = perDay[i] as ManagerOrder[]))
      setOrdersByDay(map)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yuklab bo'lmadi")
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    load()
  }, [load])

  // Ustunlar: tuman -> dastavshiklar (+ oxirida "Biriktirilmagan")
  const groups = useMemo(() => {
    const m = new Map<string, Courier[]>()
    couriers.forEach((c) => {
      const k = courierDistrict(c)
      m.set(k, [...(m.get(k) ?? []), c])
    })
    return Array.from(m.entries()).map(([district, list]) => ({
      district,
      list,
    }))
  }, [couriers])

  function cellOrders(iso: string, courierId: string) {
    const all = ordersByDay[iso] ?? []
    if (courierId === UNASSIGNED) return all.filter((o) => !o.courierId)
    return all.filter((o) => String(o.courierId) === courierId)
  }

  async function assign(order: ManagerOrder, courierId: string) {
    setAssigning(true)
    try {
      await assignOrders([order.id], courierId)
      toast.success(`#${order.number} biriktirildi`)
      setSelected(null)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Biriktirib bo'lmadi")
    } finally {
      setAssigning(false)
    }
  }

  const today = todayISO()
  const rangeLabel = `${days[0].toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "short",
  })} – ${days[6].toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`

  return (
    <div className="space-y-4 p-4">
      {/* SARLAVHA */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">Buyurtmalar kalendari</h1>
          <p className="text-sm text-muted-foreground">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(mondayOf(todayISO()))}
          >
            Bugun
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setWeekStart((w) => addDays(w, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setWeekStart((w) => addDays(w, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* JADVAL */}
      <div className="relative overflow-x-auto rounded-xl border bg-card">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr>
              <th rowSpan={2} className="w-20 border-b border-r bg-muted/50 p-2" />
              {groups.map((g) => (
                <th
                  key={g.district}
                  colSpan={g.list.length}
                  className="border-b border-r bg-muted/50 p-2 text-center font-semibold"
                >
                  {g.district}
                </th>
              ))}
              <th className="border-b bg-red-50 p-2 text-center font-semibold text-red-700">
                Biriktirilmagan
              </th>
            </tr>
            <tr>
              {groups.flatMap((g) =>
                g.list.map((c) => (
                  <th
                    key={c.id}
                    className="min-w-32 border-b border-r bg-muted/30 p-2 text-center text-xs font-medium"
                  >
                    {c.name}
                  </th>
                ))
              )}
              <th className="min-w-32 border-b bg-red-50/50 p-2" />
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => {
              const iso = toISO(d)
              const isToday = iso === today
              const columns = [
                ...groups.flatMap((g) => g.list.map((c) => String(c.id))),
                UNASSIGNED,
              ]
              return (
                <tr key={iso} className="align-top">
                  <td
                    className={cn(
                      "border-b border-r p-2 text-center",
                      isToday && "bg-primary/10 font-bold"
                    )}
                  >
                    <div className="text-xs text-muted-foreground">
                      {DAY_NAMES[i]}
                    </div>
                    <div className="text-lg">{d.getDate()}</div>
                  </td>
                  {columns.map((cid) => (
                    <td
                      key={cid}
                      className={cn(
                        "h-20 border-b border-r p-1",
                        isToday && "bg-primary/5"
                      )}
                    >
                      <div className="space-y-1">
                        {cellOrders(iso, cid).map((o) => (
                          <button
                            key={o.id}
                            onClick={() => setSelected(o)}
                            className={cn(
                              "w-full truncate rounded-md border px-2 py-1 text-left text-xs transition hover:brightness-95",
                              STATUS_COLOR[o.status] ?? "bg-muted"
                            )}
                          >
                            #{o.number} · {o.storeName}
                          </button>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-sm">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>
                  #{selected.number} · {selected.storeName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Holati</span>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Summa</span>
                  <span className="font-semibold">
                    {formatMoney(selected.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tuman</span>
                  <span>{orderDistrict(selected)}</span>
                </div>
                {selected.address && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Manzil</span>
                    <span className="text-right">{selected.address}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dastavshik</span>
                  <span>{selected.courierName ?? "Biriktirilmagan"}</span>
                </div>

                <div className="space-y-1 border-t pt-3">
                  <p className="text-xs text-muted-foreground">
                    Dastavshikka biriktirish
                  </p>
                  <Select
                    disabled={assigning}
                    onValueChange={(v) => assign(selected, v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Dastavshikni tanlang" />
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
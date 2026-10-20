// widgets/dashboard/RoleDashboard.tsx
// Bosh sahifada (app/page.tsx) faqat shuni render qiling: <RoleDashboard />
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { getStoredUser, resolveRole, type Role } from "@/lib/auth"
import { CourierDashboardClient } from "./courier-dashboard/CourierDashboardClient"
import { ManagerDashboardClient } from "./meneger-dashboard/ManagerDashboard"

export default function Page() {
  const [role, setRole] = useState<Role | null | undefined>(undefined)

  const router = useRouter()

  useEffect(() => setRole(resolveRole(getStoredUser())), [])

  // Omborchi uchun dashboard yo'q, to'g'ridan-to'g'ri mahsulotlarga yo'naltiramiz
  useEffect(() => {
    if (role === "warehouse") router.replace("/products")
  }, [role, router])

  if (role === undefined || role === "warehouse") {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (role === "courier") return <CourierDashboardClient />
  if (role === "manager" || role === "admin") return <ManagerDashboardClient />

  return (
    <p className="p-6 text-muted-foreground">
      Rolingiz aniqlanmadi. Qayta kiring yoki administratorga murojaat qiling.
    </p>
  )
}
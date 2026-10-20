// widgets/staff/StaffFormDialog.tsx
"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useCreateStaff, useUpdateStaff } from "@/lib/hooks/use-staff"
import { Staff } from "@/types/staff"
import { StaffPayload } from "@/lib/api/staffs"

interface StaffFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff?: Staff | null
}

const emptyForm: StaffPayload = {
  name: "",
  phone: "",
  password: "",
  role: "courier",
  region: "",
  district: "",
}

export function StaffFormDialog({ open, onOpenChange, staff }: StaffFormDialogProps) {
  const [form, setForm] = useState<StaffPayload>(emptyForm)
  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff()

  const isEdit = Boolean(staff)
  const loading = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (staff) {
      setForm({
        name: staff.name,
        phone: staff.phone,
        password: "",
        role: staff.role,
        region: staff.region ?? "",
        district: staff.district ?? "",
      })
    } else {
      setForm(emptyForm)
    }
  }, [staff, open])

  const handleChange = (key: keyof StaffPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const digits = form.phone.replace(/\D/g, "")
    const phone = digits.startsWith("998") ? digits.slice(3) : digits

    if (!form.name.trim()) return toast.error("Ism familiyani kiriting")
    if (!/^\d{9}$/.test(phone)) return toast.error("Telefon raqami 9 ta raqamdan iborat bo'lishi kerak")
    if (!isEdit && (form.password ?? "").length < 6)
      return toast.error("Parol kamida 6 ta belgidan iborat bo'lsin")
    if (isEdit && form.password && form.password.length < 6)
      return toast.error("Parol kamida 6 ta belgidan iborat bo'lsin")

    const payload: StaffPayload = { ...form, name: form.name.trim(), phone }
    if (!payload.password) delete payload.password // tahrirda bo'sh parol yuborilmaydi

    if (isEdit && staff) {
      updateMutation.mutate(
        { id: staff.id, payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-110 max-w-[calc(100%-2rem)] gap-0 p-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-4">
          <DialogTitle className="text-lg">
            {isEdit ? "Ishchini tahrirlash" : "Yangi ishchi qo'shish"}
          </DialogTitle>
          <DialogDescription>
            Ishchi ma'lumotlarini to'ldiring va saqlang.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Ism familiya</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Masalan: Azizbek Karimov"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="901234567"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Lavozim</Label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="courier">Kuryer</option>
                <option value="warehouse">Omborchi</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">
              Parol{isEdit ? " (o'zgartirmasangiz bo'sh qoldiring)" : ""}
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password ?? ""}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Kamida 6 ta belgi"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="region">Viloyat</Label>
              <Input
                id="region"
                value={form.region}
                onChange={(e) => handleChange("region", e.target.value)}
                placeholder="Xorazm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district">Tuman</Label>
              <Input
                id="district"
                value={form.district}
                onChange={(e) => handleChange("district", e.target.value)}
                placeholder="Urganch"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
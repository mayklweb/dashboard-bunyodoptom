// widgets/addresses/AddressFormDialog.tsx
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
import { useCreateAddress, useUpdateAddress } from "@/lib/hooks/use-addresses"
import type { Address } from "@/types/address"
import type { AddressPayload } from "@/lib/api/addresses"
import { toast } from "sonner"

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: Address | null
}

const emptyForm: AddressPayload = {
  name: "",
  region: "",
  district: "",
  address: "",
}

export function AddressFormDialog({
  open,
  onOpenChange,
  address,
}: AddressFormDialogProps) {
  const [form, setForm] = useState<AddressPayload>(emptyForm)
  const createMutation = useCreateAddress()
  const updateMutation = useUpdateAddress()

  const isEdit = Boolean(address)
  const loading = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (address) {
      setForm({
        name: address.name,
        region: address.region,
        district: address.district,
        address: address.address,
      })
    } else {
      setForm(emptyForm)
    }
  }, [address, open])

  const handleChange = (key: keyof AddressPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return toast.error("Nomini kiriting")
    if (!form.region.trim()) return toast.error("Viloyatni kiriting")
    if (!form.district.trim()) return toast.error("Tumanni kiriting")
    if (!form.address.trim()) return toast.error("Manzilni kiriting")

    if (isEdit && address) {
      updateMutation.mutate(
        { id: address.id, payload: form },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createMutation.mutate(form, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-110 max-w-[calc(100%-2rem)] gap-0 p-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-4">
          <DialogTitle className="text-lg">
            {isEdit ? "Manzilni tahrirlash" : "Yangi manzil qo'shish"}
          </DialogTitle>
          <DialogDescription>
            Manzil ma'lumotlarini to'ldiring va saqlang.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nomi</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Masalan: Bosh ombor"
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">To'liq manzil</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Ko'cha, uy raqami..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
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
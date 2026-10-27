// widgets/orders/CancelDialog.tsx
"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderLabel: string
  loading?: boolean
  onConfirm: (reason: string) => void
}

export function CancelDialog({
  open,
  onOpenChange,
  orderLabel,
  loading,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buyurtmani bekor qilish</DialogTitle>
          <DialogDescription>{orderLabel}</DialogDescription>
        </DialogHeader>

        {/* Dialog yopilganda unmount bo'ladi, shu sabab matn har safar tozalanadi */}
        <CancelForm
          loading={loading}
          onConfirm={onConfirm}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function CancelForm({
  loading,
  onConfirm,
  onClose,
}: {
  loading?: boolean
  onConfirm: (reason: string) => void
  onClose: () => void
}) {
  const [reason, setReason] = useState("")
  const [touched, setTouched] = useState(false)

  const invalid = touched && !reason.trim()

  return (
    <>
      <div className="space-y-1">
        <Textarea
          placeholder="Bekor qilish sababini yozing..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={invalid}
          rows={4}
        />
        {invalid && <p className="text-sm text-red-500">Sabab majburiy</p>}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Orqaga
        </Button>
        <Button
          variant="destructive"
          disabled={loading}
          onClick={() => {
            setTouched(true)
            if (reason.trim()) onConfirm(reason.trim())
          }}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Bekor qilish
        </Button>
      </DialogFooter>
    </>
  )
}

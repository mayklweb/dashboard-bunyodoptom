// widgets/orders/CancelDialog.tsx
"use client"

import { useEffect, useState } from "react"
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
  const [reason, setReason] = useState("")
  const [touched, setTouched] = useState(false)

  // Dialog har safar ochilganda matn tozalanadi
  useEffect(() => {
    if (open) {
      setReason("")
      setTouched(false)
    }
  }, [open])

  const invalid = touched && !reason.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buyurtmani bekor qilish</DialogTitle>
          <DialogDescription>{orderLabel}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          <Textarea
            placeholder="Bekor qilish sababini yozing..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={invalid}
            rows={4}
          />
          {invalid && (
            <p className="text-sm text-red-500">Sabab majburiy</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
      </DialogContent>
    </Dialog>
  )
}
// widgets/addresses/DeleteAddressDialog.tsx
"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Address } from "@/types/address"

interface DeleteAddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address: Address | null
  onConfirm: () => void
  loading: boolean
}

export function DeleteAddressDialog({
  open,
  onOpenChange,
  address,
  onConfirm,
  loading,
}: DeleteAddressDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Manzilni o'chirish
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            <strong>{address?.name}</strong> manzilini o'chirmoqchimisiz? Bu
            amalni ortga qaytarib bo'lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="text-base">
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="text-base bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "O'chirilmoqda..." : "O'chirish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// widgets/shops/DeleteShopDialog.tsx
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
import type { Store } from "@/types/store"

interface DeleteStoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: Store | null
  onConfirm: () => void
  loading: boolean
}

export function DeleteStoreDialog({
  open,
  onOpenChange,
  store,
  onConfirm,
  loading,
}: DeleteStoreDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Do&apos;konni o&apos;chirish</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            <strong>{store?.name}</strong> do&apos;konini o&apos;chirmoqchimisiz? Bu amalni
            ortga qaytarib bo&apos;lmaydi.
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
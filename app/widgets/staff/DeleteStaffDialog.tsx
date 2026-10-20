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
import { Staff } from "@/types/staff"

interface DeleteStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff: Staff | null
  onConfirm: () => void
  loading: boolean
}

export function DeleteStaffDialog({
  open,
  onOpenChange,
  staff,
  onConfirm,
  loading,
}: DeleteStaffDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Xodimni o'chirish</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            <strong>{staff?.name}</strong> Xodimini o'chirmoqchimisiz? Bu amalni
            ortga qaytarib bo'lmaydi.
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
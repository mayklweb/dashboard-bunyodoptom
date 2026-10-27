// widgets/products/DeleteProductDialog.tsx
"use client"

import { useState } from "react"
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
import { deleteProduct } from "@/lib/api/products"
import type { Product } from "@/types/product"
import { toast } from "sonner"

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSuccess: (id: number) => void
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: DeleteProductDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!product) return
    setLoading(true)
    try {
      await deleteProduct(product.id)
      toast.success("Mahsulot o'chirildi")
      onSuccess(product.id)
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "O'chirishda xatolik"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mahsulotni o&apos;chirish</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{product?.name}</strong> mahsulotini o&apos;chirmoqchimisiz? Bu
            amalni ortga qaytarib bo&apos;lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "O'chirilmoqda..." : "O'chirish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
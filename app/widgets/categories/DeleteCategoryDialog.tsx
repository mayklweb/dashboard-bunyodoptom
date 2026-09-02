// widgets/categories/DeleteCategoryDialog.tsx
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
import { deleteCategory } from "@/lib/api/categories"
import type { Category } from "@/types/category"
import { toast } from "sonner"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSuccess: (id: number) => void
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!category) return
    setLoading(true)
    try {
      await deleteCategory(category.id)
      toast.success("Kategoriya o'chirildi")
      onSuccess(category.id)
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
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Kategoriyani o'chirish
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            <strong>{category?.name}</strong> kategoriyasini o'chirmoqchimisiz?
            Bu amalni ortga qaytarib bo'lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant={"secondary"}
            size={"lg"}
            disabled={loading}
            className="text-base"
          >
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            size={"lg"}
            variant={"destructive"}
            className="text-base text-destructive-foreground bg-destructive hover:bg-destructive/90"
          >
            {loading ? "O'chirilmoqda..." : "O'chirish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
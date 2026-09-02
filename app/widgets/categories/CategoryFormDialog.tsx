// widgets/categories/CategoryFormDialog.tsx

"use client"

import { useEffect, useRef, useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createCategory, updateCategory } from "@/lib/api/categories"
import { getImageUrl } from "@/lib/utils/get-image-url"
import type { Category } from "@/types/category"
import { toast } from "sonner"
import { ImagePlus, Loader2, Upload } from "lucide-react"

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSuccess: (category: Category) => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryFormDialogProps) {
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = Boolean(category)

  // --------------------------------------------------
  // Initialize form
  // --------------------------------------------------

  useEffect(() => {
    if (!open) return

    if (category) {
      setName(category.name)
      setPreviewUrl(getImageUrl(category.image))
    } else {
      setName("")
      setPreviewUrl(null)
    }

    setImageFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [category, open])

  // --------------------------------------------------
  // Cleanup preview URL
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // --------------------------------------------------
  // Image
  // --------------------------------------------------

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Optional client-side validation
    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm faylini tanlang")
      return
    }

    setImageFile(file)

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleSelectImage = () => {
    fileInputRef.current?.click()
  }

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      toast.error("Kategoriya nomini kiriting")
      return
    }

    setLoading(true)

    try {
      const result =
        isEdit && category
          ? await updateCategory(category.id, trimmedName, imageFile)
          : await createCategory(trimmedName, imageFile)

      toast.success(isEdit ? "Kategoriya yangilandi" : "Kategoriya qo'shildi")

      onSuccess(result)
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) {
          onOpenChange(value)
        }
      }}
    >
      <DialogContent className="w-120 max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-5 text-left">
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
          </DialogTitle>

          <DialogDescription className="text-sm">
            Kategoriya nomi va rasmini kiriting.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="space-y-6 px-6 py-6">
            {/* Image */}
            <div className="space-y-3">
              <div>
                <Label>Rasm</Label>

                <p className="mt-1 text-xs text-muted-foreground">
                  Kategoriya uchun rasm tanlang.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Avatar
                  className="h-24 w-24 shrink-0 cursor-pointer rounded-lg border bg-muted transition-colors hover:bg-muted/80"
                  onClick={handleSelectImage}
                >
                  {previewUrl ? (
                    <AvatarImage
                      src={previewUrl}
                      alt="Kategoriya rasmi"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      <ImagePlus className="h-7 w-7 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectImage}
                    disabled={loading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Rasm tanlash
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    PNG, JPG yoki WEBP
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="category-name">Kategoriya nomi</Label>

              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: ШОКОЛАТ"
                disabled={loading}
                autoComplete="off"
              />

              <p className="text-xs text-muted-foreground">
                Kategoriya nomi foydalanuvchilarga ko'rsatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t bg-muted/20 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Bekor qilish
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {loading ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

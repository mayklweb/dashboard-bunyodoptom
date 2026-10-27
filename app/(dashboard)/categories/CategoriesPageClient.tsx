// app/(dashboard)/categories/CategoriesPageClient.tsx
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoriesTable } from "@/app/widgets/categories/CategoriesTable"
import { CategoryFormDialog } from "@/app/widgets/categories/CategoryFormDialog"
import { DeleteCategoryDialog } from "@/app/widgets/categories/DeleteCategoryDialog"
import type { Category } from "@/types/category"

interface CategoriesPageClientProps {
  initialCategories: Category[]
}

export function CategoriesPageClient({
  initialCategories,
}: CategoriesPageClientProps) {
  const [categories, setCategories] = useState<Category[]>(
    initialCategories ?? []
  )
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )

  const handleAddClick = () => {
    setSelectedCategory(null)
    setFormOpen(true)
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setFormOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setDeleteOpen(true)
  }

  const handleFormSuccess = (category: Category) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id)
      if (exists) return prev.map((c) => (c.id === category.id ? category : c))
      return [category, ...prev]
    })
  }

  const handleDeleteSuccess = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kategoriyalar</h1>
        <Button size={"lg"} variant="default" onClick={handleAddClick}>
          <Plus />
          Kategoriya qo&apos;shish
        </Button>
      </div>

      <CategoriesTable
        categories={categories}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
        onSuccess={handleFormSuccess}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

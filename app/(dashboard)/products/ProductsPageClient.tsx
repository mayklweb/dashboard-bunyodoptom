// app/(dashboard)/products/ProductsPageClient.tsx
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/app/widgets/products/ProductsTable"
import { ProductFormDrawer } from "@/app/widgets/products/ProductFormDrawer"
import { DeleteProductDialog } from "@/app/widgets/products/DeleteProductDialog"
import type { Product } from "@/types/product"
import { ProductFormDialog } from "@/app/widgets/products/ProductFormDialog"

interface ProductsPageClientProps {
  initialProducts: Product[]
}

export function ProductsPageClient({
  initialProducts,
}: ProductsPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleAddClick = () => {
    setSelectedProduct(null)
    setFormOpen(true)
    console.log("Add tugma bosildi, formOpen:", true) // vaqtinchalik log
  }

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setFormOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setDeleteOpen(true)
  }

  const handleFormSuccess = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) return prev.map((p) => (p.id === product.id ? product : p))
      return [product, ...prev]
    })
  }

  const handleDeleteSuccess = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mahsulotlar</h1>
        <Button variant="default" size={"lg"} onClick={handleAddClick}>
          <Plus />
          Mahsulot qo'shish
        </Button>
      </div>

      <ProductsTable
        products={products}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />

      {/* <ProductFormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      /> */}

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={selectedProduct}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

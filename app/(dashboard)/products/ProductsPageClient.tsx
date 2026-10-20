"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/app/widgets/products/ProductsTable"
import { ProductFormDrawer } from "@/app/widgets/products/ProductFormDrawer"
import { DeleteProductDialog } from "@/app/widgets/products/DeleteProductDialog"

import type { Product } from "@/types/product"
import type { ProductsPagination } from "./page"

const API_URL = "https://api.bunyodoptom.uz/api/v1/products"

interface ProductsPageClientProps {
  initialProducts: Product[]
  initialPagination: ProductsPagination
}

interface CatalogItem {
  id: number
  name: string
}

function getItems(json: unknown): CatalogItem[] {
  if (Array.isArray(json)) return json as CatalogItem[]

  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>

    if (Array.isArray(obj.data)) return obj.data as CatalogItem[]
    if (Array.isArray(obj.categories)) return obj.categories as CatalogItem[]
    if (Array.isArray(obj.brands)) return obj.brands as CatalogItem[]
  }

  return []
}

export function ProductsPageClient({
  initialProducts,
  initialPagination,
}: ProductsPageClientProps) {
  const [products, setProducts] = useState(initialProducts)
  const [categories, setCategories] = useState<CatalogItem[]>([])
  const [brands, setBrands] = useState<CatalogItem[]>([])
  const [pagination, setPagination] = useState(initialPagination)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialPagination.limit)

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("https://api.bunyodoptom.uz/api/v1/categories"),
          fetch("https://api.bunyodoptom.uz/api/v1/brands"),
        ])

        if (!categoriesRes.ok || !brandsRes.ok) {
          throw new Error("Kataloglarni yuklashda xatolik")
        }

        const [categoriesJson, brandsJson] = await Promise.all([
          categoriesRes.json(),
          brandsRes.json(),
        ])

        setCategories(getItems(categoriesJson))
        setBrands(getItems(brandsJson))
      } catch (error) {
        console.error("Kategoriyalar yoki brandlar yuklanmadi:", error)
      }
    }

    loadCatalogs()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const offset = (page - 1) * limit

        const res = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`, {
          cache: "no-store",
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error(`API xatoligi: ${res.status}`)
        }

        const json = await res.json()

        const data: Product[] = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json.products)
              ? json.products
              : []

        setProducts(data)

        setPagination(
          json.pagination ?? {
            total: data.length,
            offset,
            limit,
            hasMore: false,
          }
        )
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }

        setError(
          err instanceof Error ? err.message : "Mahsulotlarni yuklashda xatolik"
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [page, limit])

  const handleAddClick = () => {
    setSelectedProduct(null)
    setFormOpen(true)
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
      const exists = prev.some((item) => item.id === product.id)

      if (exists) {
        return prev.map((item) => (item.id === product.id ? product : item))
      }

      // Yangi mahsulot birinchi sahifaga qo'shiladi.
      if (page === 1) {
        return [product, ...prev].slice(0, limit)
      }

      return prev
    })

    setPagination((prev) => ({
      ...prev,
      total: prev.total + 1,
    }))
  }

  const handleDeleteSuccess = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))

    setPagination((prev) => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
    }))

    // Oxirgi mahsulot o'chirilganda oldingi sahifaga o'tish.
    if (products.length === 1 && page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mahsulotlar</h1>

        <Button size="lg" onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Mahsulot qo'shish
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">
          Mahsulotlar yuklanmoqda...
        </p>
      )}

      <ProductsTable
        products={products}
        categories={categories}
        brands={brands}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        page={page}
        limit={limit}
        total={pagination.total}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value)
          setPage(1)
        }}
      />

      <ProductFormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={selectedProduct}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

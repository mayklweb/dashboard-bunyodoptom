import { ProductsPageClient } from "./ProductsPageClient"
import type { Product } from "@/types/product"

const API_URL = "https://api.bunyodoptom.uz/api/v1/products"

export interface ProductsPagination {
  total: number
  offset: number
  limit: number
  hasMore: boolean
}

async function getProducts() {
  const res = await fetch(`${API_URL}?offset=0&limit=20`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Mahsulotlarni yuklashda xatolik: ${res.status}`)
  }

  const json = await res.json()

  const products: Product[] = Array.isArray(json)
    ? json
    : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.products)
        ? json.products
        : []

  const pagination: ProductsPagination = json.pagination ?? {
    total: products.length,
    offset: 0,
    limit: 20,
    hasMore: false,
  }

  return { products, pagination }
}

export default async function ProductsPage() {
  const { products, pagination } = await getProducts()

  return (
    <ProductsPageClient
      initialProducts={products}
      initialPagination={pagination}
    />
  )
}

// app/(dashboard)/products/page.tsx
import { ProductsPageClient } from "./ProductsPageClient"
import type { Product } from "@/types/product"

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`https://api.bunyodoptom.uz/api/v1/products`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Mahsulotlarni yuklashda xatolik: ${res.status}`)
  }

  const json = await res.json()
  return Array.isArray(json) ? json : json.data ?? []
}

export default async function ProductsPage() {
  const products = await getProducts()

  return <ProductsPageClient initialProducts={products} />
}
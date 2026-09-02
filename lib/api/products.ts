// lib/api/products.ts
import type { Product } from "@/types/product"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface ProductPayload {
  category_id: number
  name: string
  price: number
  kg_price?: number | null
  piece_price?: number | null
  kg?: number | null
  piece?: number | null
  stock_qty: number
  description?: string | null
  status: "active" | "inactive" | "draft"
  brand_id: number
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" })
  if (!res.ok) throw new Error("Mahsulotlarni yuklashda xatolik")
  return res.json()
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Mahsulot qo'shishda xatolik")
  return res.json()
}

export async function updateProduct(
  id: number,
  payload: Partial<ProductPayload>
): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Mahsulotni yangilashda xatolik")
  return res.json()
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Mahsulotni o'chirishda xatolik")
}

export async function uploadProductImages(
  productId: number,
  files: File[]
): Promise<void> {
  const formData = new FormData()
  files.forEach((file) => formData.append("images", file))

  const res = await fetch(`${API_URL}/products/${productId}/images`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) throw new Error("Rasmlarni yuklashda xatolik")
}
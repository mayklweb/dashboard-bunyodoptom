// lib/api/products.ts
import type { Product } from "@/types/product"

import { API_BASE_URL } from "@/lib/api-config"
import { authHeaders } from "@/lib/auth/headers"

const API_URL = API_BASE_URL

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
  const res = await fetch(`${API_URL}/products`, { cache: "no-store", headers: authHeaders() })
  if (!res.ok) throw new Error("Mahsulotlarni yuklashda xatolik")
  const json = await res.json()
  return json.data ?? json
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Mahsulot qo'shishda xatolik")
  const json = await res.json()
  return json.data ?? json
}

export async function updateProduct(
  id: number,
  payload: Partial<ProductPayload>
): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Mahsulotni yangilashda xatolik")
  const json = await res.json()
  return json.data ?? json
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
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
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Rasmlarni yuklashda xatolik")
}
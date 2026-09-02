// types/product.ts
export interface ProductImage {
  id: number
  product_id: number
  url: string
  is_primary: 0 | 1
  sort_order: number
  created_at: string
}

export interface Product {
  id: number
  category_id: number
  name: string
  slug: string
  price: number
  kg_price: number | null
  piece_price: number | null
  kg: number | null
  piece: number | null
  stock_qty: number
  description: string | null
  status: "active" | "inactive" | "draft"
  created_at: string
  updated_at: string
  brand_id: number
  images: ProductImage[]
}
export interface ProductImage {
  id: number
  product_id: number
  url: string
  is_primary: number
  sort_order: number
  created_at: string
}

export interface Product {
  id: number
  category_id: number
  brand_id: number | null
  name: string
  slug: string | null
  price: number | null
  kg_price: number | null
  piece_price: number | null
  kg: number | null
  piece: number | null
  stock_qty: number
  description: string | null
  status: "active" | "inactive" | "draft"
  created_at: string
  updated_at: string
  images: ProductImage[]
}

export interface ProductsResponse {
  products: Product[]
  pagination: {
    total: number
    offset: number
    limit: number
    hasMore: boolean
  }
}

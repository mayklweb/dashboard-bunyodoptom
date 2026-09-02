// types/order.ts
export interface OrderUser {
  id: number
  name: string
  phone: string
}

export interface OrderMarket {
  id: number
  name: string
  address: string
  region: string
  district: string | null
}

export interface OrderProductImage {
  id: number
  product_id: number
  url: string
  is_primary: 0 | 1
  sort_order: number
  created_at: string
}

export interface OrderProduct {
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
  status: string
  created_at: string
  updated_at: string
  brand_id: number
  images: OrderProductImage[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  qty: number
  unit_price: string
  subtotal: string
  created_at: string
  product: OrderProduct
}

export interface OrderAddress {
  id: number
  user_id: number
  region: string
  district: string | null
  address: string
  is_default: 0 | 1
  created_at: string
  updated_at: string
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"

export type PaymentMethod = "cash" | "card" | "transfer"

export interface Order {
  id: number
  status: OrderStatus
  payment_method: PaymentMethod
  payed: 0 | 1
  user_id: number
  market_id: number
  total_amount: number
  created_at: string
  user: OrderUser
  market: OrderMarket
  products: OrderItem[]
  address: OrderAddress
}
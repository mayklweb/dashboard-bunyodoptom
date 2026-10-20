// types/staff.ts
export interface Staff {
  id: number
  uid: string
  name: string
  phone: string
  role: "courier" | "warehouse"
  region: string | null
  district: string | null
  created_at: string
}

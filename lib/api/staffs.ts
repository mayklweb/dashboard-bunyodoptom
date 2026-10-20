import { api } from "@/lib/axios"
import { Staff } from "@/types/staff"

// export interface StaffPayload {
//   name: string
//   phone: string
//   region: string
//   district: string
//   address: string
// }

// lib/api/staffs.ts
export interface StaffPayload {
  name: string
  phone: string
  password?: string
  role: "courier" | "warehouse"
  region: string
  district: string
}



export async function getStaff(): Promise<Staff[]> {
  const res = await api.get("/admin/staff")
  return Array.isArray(res.data) ? res.data : (res.data.data ?? [])
}

export async function createStaff(payload: StaffPayload): Promise<Staff> {
  const res = await api.post("/admin/staff", payload)
  return res.data.data ?? res.data
}

export async function updateStaff(
  id: number,
  payload: StaffPayload
): Promise<Staff> {
  const res = await api.patch(`/admin/staff/${id}`, payload)
  return res.data.data ?? res.data
}

export async function deleteStaff(id: number): Promise<void> {
  await api.delete(`/admin/staff/${id}`)
}



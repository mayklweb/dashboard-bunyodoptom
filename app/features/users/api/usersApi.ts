import { $api } from "@/app/shared/api/api"

export type User = {
  id: number
  username: string
  role: string
  phone: string
  joinedDate: Date
}

export const fetchUsersApi = async (): Promise<User[]> => {
  const res = await $api.get("/users")
  return res.data
}

export const createUsersApi = async (payload: any) => {
  const res = await $api.post("/users", payload)
  return res.data
}

export const updateUsersApi = async (id: number, payload: any) => {
  const res = await $api.patch(`/users/${id}`, payload)
  return res.data
}

export const deleteUsersApi = async (id: number) => {
  const res = await $api.delete(`/users/${id}`)
  return res.data
}

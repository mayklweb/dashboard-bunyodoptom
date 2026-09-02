// lib/api/stores.ts
import { api } from "@/lib/axios"
import type { Store } from "@/types/store"

export interface StorePayload {
  name: string
  region: string
  district: string
  address: string
}

export async function getStores(): Promise<Store[]> {
  const res = await api.get("/markets")
  return Array.isArray(res.data) ? res.data : (res.data.data ?? [])
}

export async function createStore(payload: StorePayload): Promise<Store> {
  const res = await api.post("/markets", payload)
  return res.data.data ?? res.data
}

export async function updateStore(
  id: number,
  payload: StorePayload
): Promise<Store> {
  const res = await api.patch(`/markets/${id}`, payload)
  return res.data.data ?? res.data
}

export async function deleteStore(id: number): Promise<void> {
  await api.delete(`/markets/${id}`)
}
// lib/api/addresses.ts
import { api } from "@/lib/axios"
import type { Address } from "@/types/address"

export interface AddressPayload {
  name: string
  region: string
  district: string
  address: string
}

export async function getAddresses(): Promise<Address[]> {
  const res = await api.get("/addresses")
  return Array.isArray(res.data) ? res.data : (res.data.data ?? [])
}

export async function createAddress(
  payload: AddressPayload
): Promise<Address> {
  const res = await api.post("/addresses", payload)
  return res.data.data ?? res.data
}

export async function updateAddress(
  id: number,
  payload: AddressPayload
): Promise<Address> {
  const res = await api.patch(`/addresses/${id}`, payload)
  return res.data.data ?? res.data
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/addresses/${id}`)
}
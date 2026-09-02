// lib/hooks/use-addresses.ts
"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  type AddressPayload,
} from "@/lib/api/addresses"
import { toast } from "sonner"

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddressPayload) => createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
      toast.success("Manzil qo'shildi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AddressPayload }) =>
      updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
      toast.success("Manzil yangilandi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
      toast.success("Manzil o'chirildi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}
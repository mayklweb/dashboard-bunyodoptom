// lib/hooks/use-stores.ts
"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getStores,
  createStore,
  updateStore,
  deleteStore,
  type StorePayload,
} from "@/lib/api/stores"
import type { Store } from "@/types/store"
import { toast } from "sonner"

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  })
}

export function useCreateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StorePayload) => createStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      toast.success("Do'kon qo'shildi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}

export function useUpdateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: StorePayload }) =>
      updateStore(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      toast.success("Do'kon yangilandi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}

export function useDeleteStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      toast.success("Do'kon o'chirildi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}
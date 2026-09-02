// lib/hooks/use-orders.ts
"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getOrders, updateOrderStatus } from "@/lib/api/orders"
import type { OrderStatus } from "@/types/order"
import { toast } from "sonner"

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Buyurtma statusi yangilandi")
    },
    onError: (error) => {
      console.error("Status yangilashda xatolik:", error)
      toast.error(
        error instanceof Error ? error.message : "Xatolik yuz berdi"
      )
    },
  })
}
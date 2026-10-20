// lib/hooks/use-stores.ts
"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"
import { createStaff, deleteStaff, getStaff, StaffPayload, updateStaff } from "../api/staffs"

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: getStaff,
  })
}

export function useCreateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StaffPayload) => createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      toast.success("Xodim qo'shildi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}

export function useUpdateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: StaffPayload }) =>
      updateStaff(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      toast.success("Xodim yangilandi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}

export function useDeleteStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] })
      toast.success("Xodim o'chirildi")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Xatolik yuz berdi")
    },
  })
}
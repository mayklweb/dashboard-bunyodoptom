// app/(dashboard)/stores/StoresPageClient.tsx
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StoresTable } from "@/app/widgets/stores/StoreTable"
import { StoreFormDialog } from "@/app/widgets/stores/StoreFormDialog"
import { DeleteStoreDialog } from "@/app/widgets/stores/DeleteStoreDialog"
import { useStores, useDeleteStore } from "@/lib/hooks/use-stores"
import type { Store } from "@/types/store"

export function StoresPageClient() {
  const { data: stores, isLoading } = useStores()
  const deleteStoreMutation = useDeleteStore()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const handleAddClick = () => {
    setSelectedStore(null)
    setFormOpen(true)
  }

  const handleEditClick = (store: Store) => {
    setSelectedStore(store)
    setFormOpen(true)
  }

  const handleDeleteClick = (store: Store) => {
    setSelectedStore(store)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedStore) return
    deleteStoreMutation.mutate(selectedStore.id, {
      onSuccess: () => setDeleteOpen(false),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Do'konlar</h1>
        <Button size={"lg"} onClick={handleAddClick}>
          <Plus />
          Do'kon qo'shish
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          Yuklanmoqda...
        </div>
      ) : (
        <div className="rounded-md bg-white dark:bg-card">
          <StoresTable
            stores={stores ?? []}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      <StoreFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        store={selectedStore}
      />

      <DeleteStoreDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        store={selectedStore}
        onConfirm={handleConfirmDelete}
        loading={deleteStoreMutation.isPending}
      />
    </div>
  )
}

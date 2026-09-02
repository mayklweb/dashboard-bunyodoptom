// app/(dashboard)/addresses/AddressesPageClient.tsx
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddressesTable } from "@/app/widgets/addresses/AddressesTable"
import { AddressFormDialog } from "@/app/widgets/addresses/AddressFormDialog"
import { DeleteAddressDialog } from "@/app/widgets/addresses/DeleteAddressDialog"
import { useAddresses, useDeleteAddress } from "@/lib/hooks/use-addresses"
import type { Address } from "@/types/address"

export function AddressesPageClient() {
  const { data: addresses, isLoading } = useAddresses()
  const deleteAddressMutation = useDeleteAddress()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

  const handleAddClick = () => {
    setSelectedAddress(null)
    setFormOpen(true)
  }

  const handleEditClick = (address: Address) => {
    setSelectedAddress(address)
    setFormOpen(true)
  }

  const handleDeleteClick = (address: Address) => {
    setSelectedAddress(address)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedAddress) return
    deleteAddressMutation.mutate(selectedAddress.id, {
      onSuccess: () => setDeleteOpen(false),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manzillar</h1>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Manzil qo'shish
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          Yuklanmoqda...
        </div>
      ) : (
        <AddressesTable
          addresses={addresses ?? []}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <AddressFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        address={selectedAddress}
      />

      <DeleteAddressDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        address={selectedAddress}
        onConfirm={handleConfirmDelete}
        loading={deleteAddressMutation.isPending}
      />
    </div>
  )
}
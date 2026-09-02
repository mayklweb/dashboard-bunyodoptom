// widgets/addresses/AddressesTable.tsx
"use client"

import { Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Address } from "@/types/address"

interface AddressesTableProps {
  addresses: Address[]
  onEdit: (address: Address) => void
  onDelete: (address: Address) => void
}

export function AddressesTable({
  addresses,
  onEdit,
  onDelete,
}: AddressesTableProps) {
  const safeAddresses = addresses ?? []

  if (safeAddresses.length === 0) {
    return (
      <div className="rounded-md border border-border p-8 text-center text-muted-foreground">
        Manzillar topilmadi
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomi</TableHead>
            <TableHead>Viloyat</TableHead>
            <TableHead>Tuman</TableHead>
            <TableHead>Manzil</TableHead>
            <TableHead className="text-right">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeAddresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell className="font-medium">{address.name}</TableCell>
              <TableCell>{address.region}</TableCell>
              <TableCell>{address.district}</TableCell>
              <TableCell className="text-muted-foreground">
                {address.address}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(address)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(address)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

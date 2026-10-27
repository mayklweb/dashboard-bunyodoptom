// widgets/shops/ShopsTable.tsx
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
import type { Store } from "@/types/store"

interface StoresTableProps {
  stores: Store[]
  onEdit: (Store: Store) => void
  onDelete: (Store: Store) => void
}

export function StoresTable({ stores, onEdit, onDelete }: StoresTableProps) {
  const safeStores = stores ?? []

  if (safeStores.length === 0) {
    return (
      <div className="rounded-md border border-border p-8 text-center text-muted-foreground">
        Do&apos;konlar topilmadi
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
          {safeStores.map((store) => (
            <TableRow key={store.id}>
              <TableCell className="font-medium">{store.name}</TableCell>
              <TableCell>{store.region}</TableCell>
              <TableCell>{store.district}</TableCell>
              <TableCell className="text-muted-foreground">
                {store.address}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(store)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(store)}
                  >
                    <Trash2 className="h-4 w-4" />
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

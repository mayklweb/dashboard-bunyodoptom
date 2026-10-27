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
import { Staff } from "@/types/staff"
// import type { Store } from "@/types/store"

interface StaffTableProps {
  staff: Staff[]
  onEdit: (Staff: Staff) => void
  onDelete: (Staff: Staff) => void
}

export function StaffTable({ staff, onEdit, onDelete }: StaffTableProps) {
  const safeStaff = staff ?? []

  if (safeStaff.length === 0) {
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
          {safeStaff.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>{staff.region}</TableCell>
              <TableCell>{staff.district}</TableCell>
              {/* <TableCell className="text-muted-foreground">
                {staff.address}
              </TableCell> */}
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(staff)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(staff)}
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

"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Staff } from "@/types/staff"
import { useDeleteStaff, useStaff } from "@/lib/hooks/use-staff"
import { DeleteStaffDialog } from "@/app/widgets/staff/DeleteStaffDialog"
import { StaffFormDialog } from "@/app/widgets/staff/StaffFormDialog"
import { StaffTable } from "@/app/widgets/staff/StaffTable"

export function StaffPageClient() {
  const { data: staff, isLoading } = useStaff()
  const deleteStaffMutation = useDeleteStaff()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)

  const handleAddClick = () => {
    setSelectedStaff(null)
    setFormOpen(true)
  }

  const handleEditClick = (staff: Staff) => {
    setSelectedStaff(staff)
    setFormOpen(true)
  }

  const handleDeleteClick = (staff: Staff) => {
    setSelectedStaff(staff)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedStaff) return
    deleteStaffMutation.mutate(selectedStaff.id, {
      onSuccess: () => setDeleteOpen(false),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Xodimlar</h1>
        <Button size={"lg"} onClick={handleAddClick}>
          <Plus />
          Xodimlar
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          Yuklanmoqda...
        </div>
      ) : (
        <div className="rounded-md bg-white dark:bg-card">
          <StaffTable
            staff={staff ?? []}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      <StaffFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        staff={selectedStaff}
      />

      <DeleteStaffDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        staff={selectedStaff}
        onConfirm={handleConfirmDelete}
        loading={deleteStaffMutation.isPending}
      />
    </div>
  )
}

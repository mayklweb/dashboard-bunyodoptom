"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "./user-table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import UserFormDialog from "./user-form"
import DeleteUserDialog from "./delete-user-dialog"

import {
  useCreateUsers,
  useDeleteUsers,
  useEditUsers,
  useUsers,
} from "@/app/features/users/hooks/useUsers"

import { User } from "./data"

function Users() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

  const createUser = useCreateUsers()
  const deleteUser = useDeleteUsers()
  const editUser = useEditUsers()

  const { data: usersDataRaw, isLoading, isError } = useUsers()
  const usersData: User[] = (usersDataRaw as User[]) ?? []

  // --------------------------------------------------
  // Loading / Error
  // --------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Foydalanuvchilar yuklanmoqda...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">
            Ma&apos;lumotlarni yuklashda xatolik yuz berdi
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Iltimos, sahifani qayta yuklab ko&apos;ring.
          </p>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // Create
  // --------------------------------------------------

  const handleAddUser = (newUser: Omit<User, "id">) => {
    createUser.mutate(newUser, {
      onSuccess: () => {
        setIsFormOpen(false)
        setEditingUser(null)
      },
    })
  }

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDeleteUser = (id: number) => {
    deleteUser.mutate(id, {
      onSuccess: () => {
        setDeletingUserId(null)
      },
    })
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEditUser = (updatedUser: User) => {
    editUser.mutate(
      {
        id: updatedUser.id,
        data: {
          username: updatedUser.username,
          role: updatedUser.role,
        },
      },
      {
        onSuccess: () => {
          setEditingUser(null)
          setIsFormOpen(false)
        },
      }
    )
  }

  // --------------------------------------------------
  // Open form
  // --------------------------------------------------

  const handleOpenForm = (user?: User) => {
    setEditingUser(user ?? null)
    setIsFormOpen(true)
  }

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = (user: User | Omit<User, "id">) => {
    if (editingUser) {
      handleEditUser(user as User)
    } else {
      handleAddUser(user as Omit<User, "id">)
    }
  }

  // --------------------------------------------------
  // Close form
  // --------------------------------------------------

  const handleCloseForm = (open: boolean) => {
    setIsFormOpen(open)

    if (!open) {
      setEditingUser(null)
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="h-full">
      <div className="space-y-6">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between px-0">
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Foydalanuvchilar
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Tizimdagi foydalanuvchilarni boshqaring.
            </p>
          </div>

          <Button onClick={() => handleOpenForm()} size="lg">
            <Plus />
            Foydalanuvchi qo&apos;shish
          </Button>
        </CardHeader>

        {/* Users Table */}
        <CardContent className="px-0">
          <UsersTable
            users={usersData}
            onEdit={(user) => handleOpenForm(user as User)}
            onDelete={(userId: number) => setDeletingUserId(userId)}
          />
        </CardContent>

        {/* User Form */}
        <UserFormDialog
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          user={editingUser}
          onSubmit={handleSubmit}
        />

        {/* Delete Dialog */}
        {deletingUserId !== null && (
          <DeleteUserDialog
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                setDeletingUserId(null)
              }
            }}
            userId={deletingUserId}
            userName={
              usersData.find((user) => user.id === deletingUserId)?.username ??
              ""
            }
            onDelete={handleDeleteUser}
          />
        )}
      </div>
    </div>
  )
}

export default Users

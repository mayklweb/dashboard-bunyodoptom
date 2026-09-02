"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserAvatar } from "./user-avatar"
import { Edit2, Trash2, MoreHorizontal } from "lucide-react"
import { User } from "@/app/features/users/api/usersApi"

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (userId: number) => void
}

const roleColors: Record<string, string> = {
  Admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  User: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  Guest: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">User</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Role</TableHead>
            <TableHead className="font-semibold">Joined</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, i) => (
            <TableRow
              key={i}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell>
                <UserAvatar username={user.username} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.phone}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`${roleColors[user.role]} border-0`}
                >
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {formatDate(user.joinedDate)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export type UserRole = "Admin" | "Manager" | "User" | "Guest"
export type UserStatus = "Active" | "Pending" | "Inactive"

export type User = {
  id: number
  username: string
  phone: string
  role: UserRole
  joinedDate: Date
  avatar?: string
}

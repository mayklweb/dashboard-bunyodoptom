"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User, UserRole } from "./data"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useEffect } from "react"

const userFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  role: z.enum(["Admin", "Manager", "User", "Guest"] as const),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (user: User | Omit<User, "id">) => void
  user?: User | null
}

export default function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
}: UserFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const isEditing = !!user

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      phone: "",
      role: "User",
    },
  })

  // Reset form when user prop changes or dialog opens
  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          username: user.username || "",
          phone: user.phone || "",
          role: user.role || "User",
        })
      } else {
        form.reset({
          username: "",
          phone: "",
          role: "User",
        })
      }
    }
  }, [open, user, form])

  const handleSubmit = async (values: UserFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (isEditing && user) {
        await onSubmit({
          id: user.id,
          username: values.username,
          phone: values.phone,
          role: values.role as UserRole,
          joinedDate: user.joinedDate,
        })
      } else {
        await onSubmit({
          username: values.username,
          phone: values.phone,
          role: values.role as UserRole,
          joinedDate: new Date(),
        })
      }

      setSuccess(true)

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while saving the user. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset states when closing
      setError(null)
      setSuccess(false)
      form.reset({
        username: "",
        phone: "",
        role: "User",
      })
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-90">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user information below."
              : "Create a new user account with the details below."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              User {isEditing ? "updated" : "created"} successfully!
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || success}>
                {isLoading
                  ? "Saving..."
                  : success
                    ? "Saved!"
                    : isEditing
                      ? "Save Changes"
                      : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

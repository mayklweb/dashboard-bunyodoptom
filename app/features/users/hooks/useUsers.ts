import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createUsersApi,
  deleteUsersApi,
  fetchUsersApi,
  updateUsersApi,
} from "../api/usersApi"
import { User } from "@/app/(dashboard)/users/data"

export const UsersKeys = {
  all: ["users"] as const,
  one: (id: string) => ["users", id] as const,
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: UsersKeys.all,
    queryFn: fetchUsersApi,
  })
}

export function useCreateUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUsersApi,
    onSuccess: (newUser: User) => {
      queryClient.setQueryData<User[]>(UsersKeys.all, (old) => [
        ...(old ?? []),
        newUser,
      ])
    },
  })
}

type UpdateUserPayload = {
  id: number
  data: Partial<User>
}

export function useEditUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserPayload) => updateUsersApi(id, data),

    onSuccess: (updated: User) => {
      queryClient.setQueryData<User[]>(UsersKeys.all, (old) =>
        (old ?? []).map((u) => (u.id === updated.id ? updated : u))
      )
    },
  })
}

type ContextType = {
  previous: User[] | undefined
}

export function useDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation<number, Error, number, ContextType>({
    mutationFn: (id) => deleteUsersApi(id),

    onMutate: async (id): Promise<ContextType> => {
      await queryClient.cancelQueries({ queryKey: UsersKeys.all })

      const previous = queryClient.getQueryData<User[]>(UsersKeys.all)

      queryClient.setQueryData<User[]>(UsersKeys.all, (old) =>
        (old ?? []).filter((u) => u.id !== id)
      )

      return { previous }
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(UsersKeys.all, context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.all })
    },
  })
}

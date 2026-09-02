import { useQuery } from "@tanstack/react-query"
import { fetchProductsApi, fetchProductByIdApi } from "../api/productApi"

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await fetchProductsApi()
      return data.data // agar backend { data: [...] } qaytarsa
    },
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await fetchProductByIdApi(id)
      return data.data
    },
    enabled: !!id, // id bo‘lmasa fetch qilmaydi
  })
}

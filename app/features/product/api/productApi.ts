import { $api } from "@/app/shared/api/api"

export const fetchProductsApi = () => $api.get("/products")
export const fetchProductByIdApi = (id: number) => $api.get(`/products/${id}`)

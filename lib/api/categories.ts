// lib/api/categories.ts
// export interface Category {
//   id: number
//   name: string
// }

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`https://api.bunyodoptom.uz/api/v1/categories`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Kategoriyalarni yuklashda xatolik")
  const json = await res.json()
  return Array.isArray(json) ? json : json.data ?? []
}

// lib/api/categories.ts
import type { Category } from "@/types/category"

// export async function getCategories(): Promise<Category[]> {
//   const res = await fetch(
//     `https://api.bunyodoptom.uz/api/v1/categories/categories`,
//     { cache: "no-store" }
//   )
//   if (!res.ok) throw new Error("Kategoriyalarni yuklashda xatolik")
//   const json = await res.json()
//   return Array.isArray(json) ? json : (json.data ?? [])
// }

export async function createCategory(
  name: string,
  image?: File | null
): Promise<Category> {
  const formData = new FormData()
  formData.append("name", name)
  if (image) formData.append("image", image)

  const res = await fetch(
    `https://api.bunyodoptom.uz/api/v1/categories/categories`,
    {
      method: "POST",
      body: formData,
    }
  )
  if (!res.ok) throw new Error("Kategoriya qo'shishda xatolik")
  const json = await res.json()
  return json.data ?? json
}

export async function updateCategory(
  id: number,
  name: string,
  image?: File | null
): Promise<Category> {
  const formData = new FormData()
  formData.append("name", name)
  if (image) formData.append("image", image)

  const res = await fetch(
    `https://api.bunyodoptom.uz/api/v1/categories/categories/${id}`,
    {
      method: "PATCH",
      body: formData,
    }
  )
  if (!res.ok) throw new Error("Kategoriyani yangilashda xatolik")
  const json = await res.json()
  return json.data ?? json
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(
    `https://api.bunyodoptom.uz/api/v1/categories/categories/${id}`,
    {
      method: "DELETE",
    }
  )
  if (!res.ok) throw new Error("Kategoriyani o'chirishda xatolik")
}

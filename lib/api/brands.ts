// lib/api/brands.ts
export interface Brand {
  id: number
  name: string
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(`https://api.bunyodoptom.uz/api/v1/brands`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Brendlarni yuklashda xatolik")
  const json = await res.json()
  return Array.isArray(json) ? json : json.data ?? []
}
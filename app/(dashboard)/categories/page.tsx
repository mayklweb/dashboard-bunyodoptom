// app/(dashboard)/categories/page.tsx
import { getCategories } from "@/lib/api/categories"
import { CategoriesPageClient } from "./CategoriesPageClient"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesPageClient initialCategories={categories} />
}
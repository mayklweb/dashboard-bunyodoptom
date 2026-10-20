// widgets/products/ProductFormDrawer.tsx
"use client"

import { useEffect, useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createProduct,
  updateProduct,
  type ProductPayload,
} from "@/lib/api/products"
import { getCategories } from "@/lib/api/categories"
import { getBrands, type Brand } from "@/lib/api/brands"
import type { Product } from "@/types/product"
import { toast } from "sonner"
import { Category } from "@/types/category"

interface ProductFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSuccess: (product: Product) => void
}

const emptyForm: ProductPayload = {
  category_id: 0,
  name: "",
  price: 0,
  kg_price: null,
  piece_price: null,
  kg: null,
  piece: null,
  stock_qty: 0,
  description: null,
  status: "active",
  brand_id: 0,
}

export function ProductFormDrawer({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDrawerProps) {
  const [form, setForm] = useState<ProductPayload>(emptyForm)
  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [optionsLoading, setOptionsLoading] = useState(false)

  const isEdit = Boolean(product)

  useEffect(() => {
    if (!open) return

    setOptionsLoading(true)
    Promise.all([getCategories(), getBrands()])
      .then(([categoriesData, brandsData]) => {
        setCategories(categoriesData)
        setBrands(brandsData)
      })
      .catch(() => {
        toast.error("Kategoriya/brend ro'yxatini yuklashda xatolik")
      })
      .finally(() => setOptionsLoading(false))
  }, [open])

  useEffect(() => {
    if (product) {
      setForm({
        category_id: product.category_id,
        name: product.name,
        price: product.price ?? 0,
        kg_price: product.kg_price,
        piece_price: product.piece_price,
        kg: product.kg,
        piece: product.piece,
        stock_qty: product.stock_qty,
        description: product.description,
        status: product.status,
        brand_id: product.brand_id ?? 0,
      })
    } else {
      setForm(emptyForm)
    }
  }, [product, open])

  const handleChange = <K extends keyof ProductPayload>(
    key: K,
    value: ProductPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Mahsulot nomini kiriting")
      return
    }
    if (!form.category_id) {
      toast.error("Kategoriyani tanlang")
      return
    }
    if (!form.brand_id) {
      toast.error("Brendni tanlang")
      return
    }
    if (form.price <= 0) {
      toast.error("Narxni to'g'ri kiriting")
      return
    }

    setLoading(true)
    try {
      const result =
        isEdit && product
          ? await updateProduct(product.id, form)
          : await createProduct(form)

      toast.success(isEdit ? "Mahsulot yangilandi" : "Mahsulot qo'shildi")
      onSuccess(result)
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Nomalum xatolik yuz berdi"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      {/* Mobil: to'liq kenglik | Tablet: o'rtacha | Desktop: max-w-150 */}
      <DrawerContent className="h-full w-full sm:max-w-md md:max-w-lg lg:max-w-150">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
          </DrawerTitle>
          <DrawerDescription>
            Mahsulot ma'lumotlarini to'ldiring va saqlang.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-5 overflow-y-auto px-4 pb-4 sm:px-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Mahsulot nomi</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="РОФФЕ ШК МБ 2КГ"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category_id">Kategoriya</Label>
            <Select
              value={form.category_id ? String(form.category_id) : ""}
              onValueChange={(value) =>
                handleChange("category_id", Number(value))
              }
              disabled={optionsLoading}
            >
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue
                  placeholder={
                    optionsLoading ? "Yuklanmoqda..." : "Kategoriyani tanlang"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brand_id">Brend</Label>
            <Select
              value={form.brand_id ? String(form.brand_id) : ""}
              onValueChange={(value) => handleChange("brand_id", Number(value))}
              disabled={optionsLoading}
            >
              <SelectTrigger id="brand_id" className="w-full">
                <SelectValue
                  placeholder={
                    optionsLoading ? "Yuklanmoqda..." : "Brendni tanlang"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={String(brand.id)}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobilda 1 ustun, sm dan boshlab 2 ustun */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Narx (so'm)</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                value={form.price || ""}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                placeholder="77000"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stock_qty">Qoldiq</Label>
              <Input
                id="stock_qty"
                type="number"
                inputMode="numeric"
                value={form.stock_qty || ""}
                onChange={(e) =>
                  handleChange("stock_qty", Number(e.target.value))
                }
                placeholder="991"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="kg">Og'irligi (kg)</Label>
              <Input
                id="kg"
                type="number"
                inputMode="decimal"
                step="0.01"
                value={form.kg ?? ""}
                onChange={(e) =>
                  handleChange(
                    "kg",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="2"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="kg_price">1 kg narxi</Label>
              <Input
                id="kg_price"
                type="number"
                inputMode="decimal"
                value={form.kg_price ?? ""}
                onChange={(e) =>
                  handleChange(
                    "kg_price",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="38500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="piece">Dona soni</Label>
              <Input
                id="piece"
                type="number"
                inputMode="numeric"
                value={form.piece ?? ""}
                onChange={(e) =>
                  handleChange(
                    "piece",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="—"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="piece_price">1 dona narxi</Label>
              <Input
                id="piece_price"
                type="number"
                inputMode="decimal"
                value={form.piece_price ?? ""}
                onChange={(e) =>
                  handleChange(
                    "piece_price",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="—"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                handleChange("status", value as ProductPayload["status"])
              }
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Tavsif</Label>
            <Textarea
              id="description"
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              placeholder="Mahsulot haqida qo'shimcha ma'lumot..."
            />
          </div>
        </div>

        {/* Mobilda tugmalar ustma-ust va to'liq kenglikda, sm dan boshlab yonma-yon */}
        <DrawerFooter className="flex flex-col-reverse gap-2 border-t sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            size={"lg"}
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            size={"lg"}
            className="w-full sm:w-auto"
          >
            {loading ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
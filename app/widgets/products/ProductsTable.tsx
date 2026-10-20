import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

interface ProductsTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  categories: { id: number; name: string }[]
  brands: { id: number; name: string }[]
}

const statusVariant: Record<
  Product["status"],
  "default" | "secondary" | "destructive"
> = {
  active: "default",
  inactive: "secondary",
  draft: "destructive",
}

const formatPrice = (value: number | null) => {
  if (value === null) return "—"
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm"
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  categories,
  brands,
}: ProductsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rasm</TableHead>
              <TableHead>Nomi</TableHead>
              <TableHead>Kategoriya</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Narx</TableHead>
              <TableHead>KG narxi</TableHead>
              <TableHead>Dona narxi</TableHead>
              <TableHead>KG</TableHead>
              <TableHead>Dona</TableHead>
              <TableHead>Qoldiq</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => {
              const primaryImage =
                product.images?.find((img) => img.is_primary === 1) ??
                product.images?.[0]

              const categoryName = categories.find(
                (item) => item.id === product.category_id
              )?.name

              const brandName = brands.find(
                (item) => item.id === product.brand_id
              )?.name

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Avatar className="rounded-md">
                      {primaryImage && (
                        <AvatarImage
                          src={primaryImage.url}
                          alt={product.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="rounded-md">
                        {product.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {product.slug}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{categoryName ?? "—"}</TableCell>
                  <TableCell>{brandName ?? "—"}</TableCell>

                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{formatPrice(product.kg_price)}</TableCell>
                  <TableCell>{formatPrice(product.piece_price)}</TableCell>
                  <TableCell>{product.kg ?? "—"}</TableCell>
                  <TableCell>{product.piece ?? "—"}</TableCell>
                  <TableCell>{product.stock_qty}</TableCell>

                  <TableCell>
                    <Badge variant={statusVariant[product.status]}>
                      {product.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Mahsulotni tahrirlash"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Mahsulotni o'chirish"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>
            {start}–{end} / {total} ta mahsulot
          </span>

          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-foreground"
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            aria-label="Sahifadagi mahsulotlar soni"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} ta
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Oldingi sahifa"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="min-w-24 text-center text-sm">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            aria-label="Keyingi sahifa"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

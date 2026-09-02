// widgets/products/ProductsTable.tsx
import { Pencil, Trash2 } from "lucide-react"
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
}

const statusVariant: Record<Product["status"], "default" | "secondary" | "destructive"> = {
  active: "default",
  inactive: "secondary",
  draft: "destructive",
}

const formatPrice = (value: number | null) => {
  if (value === null) return "—"
  return new Intl.NumberFormat("uz-UZ").format(value) + " so'm"
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-15">Rasm</TableHead>
            <TableHead>Nomi</TableHead>
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
              product.images.find((img) => img.is_primary === 1) ??
              product.images[0]

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
                      onClick={() => onEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
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
  )
}
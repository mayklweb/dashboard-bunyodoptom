// widgets/analytics/TopProductsTable.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AnalyticsSummary } from "@/lib/utils/compute-analytics"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("uz-UZ").format(value) + " so'm"

export function TopProductsTable({ summary }: { summary: AnalyticsSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Eng ko&apos;p sotilgan mahsulotlar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {summary.topProducts.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Ma&apos;lumot yo&apos;q
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mahsulot</TableHead>
                <TableHead className="text-right">Miqdor</TableHead>
                <TableHead className="text-right">Daromad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.qty}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(product.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
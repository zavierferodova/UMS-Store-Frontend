import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Product } from "@/domain/model/product";
import { Page } from "@/lib/page";

interface ProductsTableProps {
  products: Page<Product>;
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex justify-center">No</div>
          </TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Harga</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.content.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex justify-center">{index + 1}</div>
            </TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category.name}</TableCell>
            <TableCell>{product.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

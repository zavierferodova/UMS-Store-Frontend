import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Product } from "@/domain/model/product";
import { IPaginationResponse } from "@/domain/model/response";
import { toTitleCase } from "@/lib/string";

interface ProductsTableProps {
  products: IPaginationResponse<Product>;
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
        {products.data.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex justify-center">{index + 1}</div>
            </TableCell>
            <TableCell>
              {product.skus.map((sku) => { return <div key={sku.sku}>{sku.sku}<br/></div>; })}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category?.name ?? "-"}</TableCell>
            <TableCell>{product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

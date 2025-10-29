import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Product } from '@/domain/model/product';
import { IPaginationResponse } from '@/domain/model/response';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { isAdmin } from '@/lib/role';
import { localeDateFormat } from '@/lib/utils';
import { panelRoutes } from '@/routes/route';
import Image from 'next/image';
import { DialogImagePreview } from '@/components/panel/DialogImagePreview';
import { useState } from 'react';

interface ProductsTableProps {
  products: IPaginationResponse<Product>;
}

export function ProductsTable({ products }: ProductsTableProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState('');

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">
              <div className="flex justify-center">No</div>
            </TableHead>
            <TableHead>Gambar</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead>Diubah</TableHead>
            {isAdmin(user) && <TableHead className="text-center">Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex justify-center">
                  {(products.meta.page - 1) * products.meta.limit + index + 1}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <div className="w-15 h-15 relative rounded-sm overflow-hidden">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[0]?.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setCurrentImagePreview(product.images[0]?.image);
                          setShowImageDialog(true);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {product.skus.length > 0
                  ? product.skus
                      .map((sku) => sku.sku)
                      .map((sku, index) => <div key={index}>{sku}</div>)
                  : '-'}
              </TableCell>
              <TableCell>
                <Link
                  href={panelRoutes.productEdit(product.id)}
                  className="font-medium hover:underline"
                >
                  {product.name}
                </Link>
              </TableCell>
              <TableCell>{product.category?.name || '-'}</TableCell>
              <TableCell>
                {product.price.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                })}
              </TableCell>
              <TableCell>{localeDateFormat(product.created_at)}</TableCell>
              <TableCell>{localeDateFormat(product.updated_at)}</TableCell>
              {isAdmin(user) && (
                <TableCell>
                  <div className="flex justify-center">
                    <span className="justify-center">
                      {!product.is_deleted ? 'Aktif' : 'Dihapus'}
                    </span>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DialogImagePreview
        isOpen={showImageDialog}
        onOpenChange={(open) => {
          setShowImageDialog(open);
        }}
        src={currentImagePreview}
      />
    </>
  );
}

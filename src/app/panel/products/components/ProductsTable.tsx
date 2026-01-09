import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { ProductSingleSKU } from '@/domain/model/product';
import { IPaginationResponse } from '@/domain/model/response';
import { useSession } from 'next-auth/react';
import { isAdmin } from '@/lib/role';
import { localeDateFormat } from '@/lib/utils';
import { panelRoutes } from '@/routes/route';
import { DialogImagePreview } from '@/components/panel/DialogImagePreview';
import { useState } from 'react';
import { ImageIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductsTableProps {
  products: IPaginationResponse<ProductSingleSKU>;
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
            <TableHead>Stok</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead>Diubah</TableHead>
            {isAdmin(user) && <TableHead className="text-center">Penghapusan</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product, index) => (
            <TableRow key={product.sku.sku}>
              <TableCell>
                <div className="flex justify-center">
                  {(products.meta.page - 1) * products.meta.limit + index + 1}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="relative h-15 w-15 overflow-hidden rounded-sm">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[0]?.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="h-full w-full cursor-pointer bg-gray-200"
                        onClick={() => {
                          setCurrentImagePreview(product.images[0]?.image);
                          setShowImageDialog(true);
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.sku ? product.sku.sku : '-'}</TableCell>
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
              <TableCell>{product.sku.stock}</TableCell>
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

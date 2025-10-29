import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { IPaginationResponse } from '@/domain/model/response';
import { useSession } from 'next-auth/react';
import { localeDateFormat } from '@/lib/utils';
import { PurchaseOrder } from '@/domain/model/purchase-order';
import { isAdmin } from '@/lib/role';

interface PurchaseOrdersTableProps {
  purchaseOrders: IPaginationResponse<PurchaseOrder>;
}

export function PurchaseOrdersTable({ purchaseOrders }: PurchaseOrdersTableProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">
              <div className="flex justify-center">No</div>
            </TableHead>
            <TableHead>Kode PO</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead>Diubah</TableHead>
            <TableHead>Draft</TableHead>
            <TableHead>Selesai</TableHead>
            {isAdmin(user) && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.data.map((po, index) => (
            <TableRow key={po.id}>
              <TableCell>
                <div className="flex justify-center">
                  {(purchaseOrders.meta.page - 1) * purchaseOrders.meta.limit + index + 1}
                </div>
              </TableCell>
              <TableCell className="font-medium">{po.code}</TableCell>
              <TableCell>{po.supplier.name}</TableCell>
              <TableCell className="capitalize">{po.payout}</TableCell>
              <TableCell>{localeDateFormat(po.created_at)}</TableCell>
              <TableCell>{localeDateFormat(po.updated_at)}</TableCell>
              <TableCell className="capitalize">{po.draft ? 'Ya' : 'Tidak'}</TableCell>
              <TableCell className="capitalize">{po.completed ? 'Ya' : 'Tidak'}</TableCell>
              {isAdmin(user) && <TableCell>{po.is_deleted ? 'Dihapus' : 'Aktif'}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

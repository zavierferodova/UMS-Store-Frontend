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
import Link from 'next/link';
import { panelRoutes } from '@/routes/route';

export interface PurchaseOrdersTableProps {
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
            <TableHead>Pengentri</TableHead>
            <TableHead>Approver</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead>Diubah</TableHead>
            <TableHead>Status</TableHead>
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
              <TableCell className="font-medium">
                <Link href={panelRoutes.purchaseOrderEdit(po.id)} className="hover:underline">
                  {po.code}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={panelRoutes.supplierEdit(po.supplier.id)}
                  className="font-medium hover:underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecorationThickness: '2px' }}
                >
                  <span className="hover:underline decoration-2 underline-offset-2 transition-all">
                    {po.supplier.name}
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                {isAdmin(user) ? (
                  <Link
                    href={panelRoutes.userEdit(po.requester.id)}
                    className="font-medium hover:underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecorationThickness: '2px' }}
                  >
                    <span className="hover:underline decoration-2 underline-offset-2 transition-all">
                      {po.requester.name}
                    </span>
                  </Link>
                ) : (
                  <span>{po.requester.name}</span>
                )}
              </TableCell>
              <TableCell>
                {po.approver ? (
                  isAdmin(user) ? (
                    <Link
                      href={panelRoutes.userEdit(po.approver.id)}
                      className="font-medium hover:underline cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecorationThickness: '2px' }}
                    >
                      <span className="hover:underline decoration-2 underline-offset-2 transition-all">
                        {po.approver.name}
                      </span>
                    </Link>
                  ) : (
                    <span>{po.approver.name}</span>
                  )
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="capitalize">{po.payout}</TableCell>
              <TableCell>{localeDateFormat(po.created_at)}</TableCell>
              <TableCell>{localeDateFormat(po.updated_at)}</TableCell>
              <TableCell className="capitalize">{po.status.replace('_', ' ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

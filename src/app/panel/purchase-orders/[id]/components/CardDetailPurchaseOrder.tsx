import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PurchaseOrder } from '@/domain/model/purchase-order';
import { localeDateFormat } from '@/lib/utils';
import { panelRoutes } from '@/routes/route';
import Link from 'next/link';

export interface CardDetailPurchaseOrderProps {
  purchaseOrder: PurchaseOrder;
  className?: string;
}

export function CardDetailPurchaseOrder({
  purchaseOrder,
  className,
}: CardDetailPurchaseOrderProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Purchase Order</CardTitle>
        <CardDescription>Detail informasi utama purchase order yang disimpan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Informasi Dasar</h4>
            <div className="grid grid-cols-[120px_10px_1fr] gap-1">
              <div>Status</div>
              <div>:</div>
              <div className="text-muted-foreground capitalize">
                {purchaseOrder.status.replace('_', ' ')}
              </div>

              <div>Kode</div>
              <div>:</div>
              <div className="text-muted-foreground">{purchaseOrder.code}</div>

              <div>Supplier</div>
              <div>:</div>
              <div className="text-muted-foreground">
                <Link
                  href={panelRoutes.supplierEdit(purchaseOrder.supplier.id)}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {purchaseOrder.supplier.name}
                </Link>
              </div>

              <div>Pembayaran</div>
              <div>:</div>
              <div className="text-muted-foreground capitalize">{purchaseOrder.payout}</div>

              <div>Dibuat</div>
              <div>:</div>
              <div className="text-muted-foreground">
                {localeDateFormat(purchaseOrder.created_at)}
              </div>

              <div>Diperbarui</div>
              <div>:</div>
              <div className="text-muted-foreground">
                {localeDateFormat(purchaseOrder.updated_at)}
              </div>
            </div>
          </div>

          <Separator className="my-2 mb-4" />

          <div className="space-y-2">
            <h4 className="font-medium">Informasi Pengentri</h4>
            <div className="grid grid-cols-[120px_10px_1fr] gap-1">
              <div>Nama</div>
              <div>:</div>
              <div className="text-muted-foreground">{purchaseOrder.requester.name}</div>

              <div>Email</div>
              <div>:</div>
              <div className="text-muted-foreground">{purchaseOrder.requester.email || '-'}</div>

              <div>Telepon</div>
              <div>:</div>
              <div className="text-muted-foreground">{purchaseOrder.requester.phone || '-'}</div>

              <div>Alamat</div>
              <div>:</div>
              <div className="text-muted-foreground">{purchaseOrder.requester.address || '-'}</div>
            </div>
          </div>

          <Separator className="my-2 mb-4" />

          <div className="space-y-2">
            <h4 className="font-medium">Catatan Tambahan</h4>
            <div className="text-muted-foreground">
              {purchaseOrder.note ? purchaseOrder.note : '-'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

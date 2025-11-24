import { purchaseOrderDataServer } from '@/data/purchase-order';
import { notFound } from 'next/navigation';
import PurchaseOrderDetailContainer from './container';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PurchaseOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const purchaseOrder = await purchaseOrderDataServer.getPurchaseOrder(id);

  if (!purchaseOrder) {
    notFound();
  }

  return <PurchaseOrderDetailContainer purchaseOrder={purchaseOrder} />;
}

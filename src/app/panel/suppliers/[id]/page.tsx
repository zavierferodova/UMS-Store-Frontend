import { supplierDataServer } from '@/data/supplier';
import { SupplierPageContainer } from './container';
import { notFound } from 'next/navigation';

export default async function SupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await supplierDataServer.getSupplier(id);

  if (!supplier) {
    notFound();
  }

  return <SupplierPageContainer supplier={supplier} />;
}

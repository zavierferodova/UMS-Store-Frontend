import { supplierDataServer } from '@/data/supplier';
import { SupplierPageContainer } from './container';
import { PanelNotFound } from '@/components/panel/PanelNotFound';

export default async function SupplierPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supplier = await supplierDataServer.getSupplier(id);

  if (!supplier) {
    return <PanelNotFound message="Supplier tidak dapat dimuat!" />;
  }

  return <SupplierPageContainer supplier={supplier} />;
}

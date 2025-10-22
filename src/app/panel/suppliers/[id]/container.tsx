'use client';
import { usePanelHeader } from '@/components/panel/Header';
import { panelRoutes } from '@/routes/route';
import { useEffect } from 'react';
import { EditSupplierForm } from './components/EditSupplierForm';
import { Supplier } from '@/domain/model/supplier';

export type SupplierPageContainerProps = {
  supplier: Supplier;
};

export function SupplierPageContainer({ supplier }: SupplierPageContainerProps) {
  const { setMenu } = usePanelHeader();

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Pemasok',
        href: panelRoutes.suppliers,
      },
      {
        name: 'Detail',
        href: '',
      },
    ]);
  }, [setMenu]);

  return (
    <>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4">
          <EditSupplierForm supplier={supplier} />
        </div>
      </div>
    </>
  );
}

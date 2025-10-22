'use client';
import { usePanelHeader } from '@/components/panel/Header';
import { panelRoutes } from '@/routes/route';
import { useEffect } from 'react';
import { AddSupplierForm } from './components/AddSupplierForm';

export default function AddSupplierPage() {
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
        name: 'Tambah',
        href: '',
      },
    ]);
  }, [setMenu]);

  return (
    <>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4">
          <AddSupplierForm />
        </div>
      </div>
    </>
  );
}

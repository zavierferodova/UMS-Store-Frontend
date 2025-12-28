'use client';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect } from 'react';
import { panelRoutes } from '@/routes/route';
import { AddCouponForm } from './components/AddCouponForm';

export default function AddCouponPage() {
  const { setMenu } = usePanelHeader();
  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Kupon',
        href: panelRoutes.coupons,
      },
      {
        name: 'Tambah',
        href: panelRoutes.addCoupon,
      },
    ]);
  }, [setMenu]);

  return <AddCouponForm />;
}

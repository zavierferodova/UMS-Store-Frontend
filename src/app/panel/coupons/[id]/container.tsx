'use client';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect } from 'react';
import { panelRoutes } from '@/routes/route';
import { EditCouponForm } from './components/EditCouponForm';
import { Coupon } from '@/domain/model/coupon';

interface CouponPageContainerProps {
  coupon: Coupon;
}

export function CouponPageContainer({ coupon }: CouponPageContainerProps) {
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
        name: 'Edit',
        href: panelRoutes.editCoupon(coupon.id),
      },
    ]);
  }, [setMenu, coupon.id]);

  return <EditCouponForm coupon={coupon} />;
}

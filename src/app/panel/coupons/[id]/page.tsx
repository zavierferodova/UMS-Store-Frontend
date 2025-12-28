import { couponDataServer } from '@/data/coupon';
import { CouponPageContainer } from './container';
import { notFound } from 'next/navigation';

export default async function CouponDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await couponDataServer.getCoupon(id);

  if (!coupon) {
    notFound();
  }

  return <CouponPageContainer coupon={coupon} />;
}

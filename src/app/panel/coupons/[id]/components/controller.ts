import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, CouponFormValues } from './validation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import couponData from '@/data/coupon';
import { panelRoutes } from '@/routes/route';
import { Coupon } from '@/domain/model/coupon';

export function useController(coupon: Coupon) {
  const router = useRouter();
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: coupon.name,
      is_disabled: coupon.is_disabled ?? false,
      start_time: new Date(coupon.start_time),
      end_time: new Date(coupon.end_time),
    },
  });

  const onSubmit = async (values: CouponFormValues) => {
    const response = await couponData.updateCoupon(coupon.id, {
      name: values.name,
      disabled: values.is_disabled,
      start_time: values.start_time.toISOString(),
      end_time: values.end_time.toISOString(),
    });

    if (response) {
      toast.success('Kupon berhasil diperbarui');
      router.push(panelRoutes.coupons);
      router.refresh();
    } else {
      toast.error('Gagal memperbarui kupon');
    }
  };

  return {
    form,
    onSubmit,
  };
}

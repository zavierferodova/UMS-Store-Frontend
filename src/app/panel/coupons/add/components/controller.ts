import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, CouponFormValues } from './validation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import couponData from '@/data/coupon';
import { panelRoutes } from '@/routes/route';
import { CouponType } from '@/domain/model/coupon';

export function useController() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: CouponType.voucher,
      voucher_value: 0,
      discount_percentage: 0,
      start_time: new Date(),
      end_time: new Date(),
    },
  });

  const onSubmit = async (values: CouponFormValues) => {
    const response = await couponData.createCoupon({
      name: values.name,
      type: values.type,
      voucher_value: values.type === CouponType.voucher ? values.voucher_value : undefined,
      discount_percentage:
        values.type === CouponType.discount ? values.discount_percentage : undefined,
      start_time: values.start_time.toISOString(),
      end_time: values.end_time.toISOString(),
    });

    if (response) {
      toast.success('Kupon berhasil dibuat');
      router.push(panelRoutes.coupons);
      router.refresh();
    } else {
      toast.error('Gagal membuat kupon');
    }
  };

  return {
    form,
    onSubmit,
  };
}

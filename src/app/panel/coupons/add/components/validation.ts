import { z } from 'zod';
import { CouponType } from '@/domain/model/coupon';

export const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Nama kupon tidak boleh kosong' }),
    type: z.nativeEnum(CouponType, { message: 'Tipe kupon harus dipilih' }),
    voucher_value: z.coerce.number().optional(),
    discount_percentage: z.coerce.number().optional(),
    start_time: z.date({ message: 'Waktu mulai harus diisi' }),
    end_time: z.date({ message: 'Waktu selesai harus diisi' }),
  })
  .refine(
    (data) => {
      if (data.type === CouponType.voucher) {
        return !!data.voucher_value && data.voucher_value > 0;
      }
      return true;
    },
    {
      message: 'Nilai voucher harus diisi',
      path: ['voucher_value'],
    },
  )
  .refine(
    (data) => {
      if (data.type === CouponType.discount) {
        return (
          !!data.discount_percentage &&
          data.discount_percentage > 0 &&
          data.discount_percentage <= 100
        );
      }
      return true;
    },
    {
      message: 'Persentase diskon harus diisi (1-100)',
      path: ['discount_percentage'],
    },
  )
  .refine(
    (data) => {
      return data.end_time > data.start_time;
    },
    {
      message: 'Waktu selesai harus lebih besar dari waktu mulai',
      path: ['end_time'],
    },
  );

export type CouponFormValues = z.infer<typeof formSchema>;

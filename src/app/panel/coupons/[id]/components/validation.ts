import { z } from 'zod';

export const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Nama kupon tidak boleh kosong' }),
    is_disabled: z.boolean(),
    start_time: z.date({ message: 'Waktu mulai harus diisi' }),
    end_time: z.date({ message: 'Waktu selesai harus diisi' }),
  })
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

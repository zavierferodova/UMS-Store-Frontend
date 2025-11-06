import { z } from 'zod';
import { POPayout } from '@/domain/model/purchase-order';

export const purchaseOrderItemSchema = z.object({
  product_sku: z.string().min(1, { message: 'SKU produk tidak boleh kosong' }),
  price: z
    .number({ message: 'Harga harus berupa angka' })
    .positive({ message: 'Harga harus lebih dari 0' }),
  amounts: z
    .number({ message: 'Jumlah harus berupa angka' })
    .int({ message: 'Jumlah harus berupa bilangan bulat' })
    .positive({ message: 'Jumlah harus lebih dari 0' }),
  supplier_discount: z
    .number({ message: 'Diskon harus berupa angka' })
    .min(0, { message: 'Diskon tidak boleh kurang dari 0' })
    .max(100, { message: 'Diskon tidak boleh lebih dari 100' })
    .optional(),
});

export const formSchema = z.object({
  supplier: z
    .object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      phone: z.string(),
      email: z.string().nullable(),
      address: z.string().nullable(),
      discount: z.number().nullable(),
      sales: z.array(z.object({ name: z.string(), phone: z.string() })).nullable(),
      is_deleted: z.boolean(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .optional()
    .refine((val) => !!val && !!val.id, { message: 'Supplier tidak boleh kosong' }),
  payout: z.enum(POPayout, { message: 'Metode pembayaran tidak boleh kosong' }),
  note: z.string().optional(),
  items: z.array(purchaseOrderItemSchema),
});

export type PurchaseOrderItem = z.infer<typeof purchaseOrderItemSchema>;
export type FormValues = z.infer<typeof formSchema>;

import { z } from 'zod';
import { ImageFile } from '@/components/panel/form/ProductImagesInput';
import productData from '@/data/product';

export const formSchema = z.object({
  name: z.string().min(1, { message: 'Nama produk tidak boleh kosong' }),
  description: z.string().min(1, { message: 'Deskripsi produk tidak boleh kosong' }),
  category: z.any().refine((value) => typeof value === 'string' && value.trim() !== '', {
    message: 'Kategori produk tidak boleh kosong',
  }),
  images: z
    .array(z.any())
    .refine((images) => images.every((image: ImageFile) => image.file?.size || 0 <= 8 * 1024), {
      message: 'Ukuran gambar maksimal 8KB',
    })
    .refine(
      (images) =>
        images.every((image: ImageFile) =>
          ['image/jpeg', 'image/webp', 'image/png'].includes(image.file?.type || ''),
        ),
      { message: 'Hanya format JPG, PNG, WEBP yang diizinkan' },
    ),
  skus: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z
          .string()
          .min(1, { message: 'SKU tidak boleh kosong' })
          .refine(
            async (sku) => {
              if (sku.trim() === '') return false;
              const available = await productData.checkSKU(sku);
              return available;
            },
            { message: 'SKU sudah ada' },
          ),
        supplier: z.string().nullable().optional(),
      }),
    )
    .min(1, { message: 'SKU produk minimal 1' })
    .refine(
      (skus) => {
        const skuValues = skus.map((s) => s.sku.trim().toLowerCase());
        return new Set(skuValues).size === skuValues.length;
      },
      { message: 'SKU tidak boleh sama' },
    ),
  additionalInfo: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional()
    .refine(
      (items) => {
        if (!items) return true;
        const labels = items.map((item) => (item.label ?? '').trim().toLowerCase());
        return new Set(labels).size === labels.length;
      },
      { message: 'Label harus unik' },
    ),
});

export type FormValues = z.infer<typeof formSchema>;

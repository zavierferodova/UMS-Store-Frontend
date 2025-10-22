import { formSchema as addFormSchema } from '@/app/panel/products/add/components/validation';
import { ImageFile } from '@/components/panel/Form/ProductImagesInput';
import productData from '@/data/product';
import { z } from 'zod';

export const formSchema = addFormSchema.extend({
  skus: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z.string().min(1, { message: 'SKU tidak boleh kosong' }),
      }),
    )
    .min(1, { message: 'SKU produk minimal 1' })
    .superRefine(async (skus, ctx) => {
      for (const [index, skuObj] of skus.entries()) {
        // Skip validation if this is an existing record (has an ID)
        if (skuObj.id) continue;

        const sku = skuObj.sku.trim();
        if (sku === '') {
          ctx.addIssue({
            code: 'custom',
            message: 'SKU tidak boleh kosong',
            path: [index, 'sku'],
          });
          continue;
        }

        const isAvailable = await productData.checkSKU(sku);
        if (!isAvailable) {
          ctx.addIssue({
            code: 'custom',
            message: 'SKU sudah ada',
            path: [index, 'sku'],
          });
        }
      }
    })
    .refine(
      (skus) => {
        const skuValues = skus.map((s) => s.sku.trim().toLowerCase());
        return new Set(skuValues).size === skuValues.length;
      },
      { message: 'SKU tidak boleh sama' },
    ),
  images: z
    .array(z.any())
    .min(1, { message: 'Gambar tidak boleh kosong' })
    .refine(
      (images: ImageFile[]) => {
        return images.some((image) => (image.file?.size ? !(image.file.size <= 8 * 1024) : true));
      },
      { message: 'Ukuran gambar maksimal 8KB' },
    )
    .refine(
      (images: ImageFile[]) => {
        return images.some((image) =>
          image.file ? !['image/jpeg', 'image/png'].includes(image.file.type) : true,
        );
      },
      { message: 'Hanya format JPG, PNG yang diizinkan' },
    ),
  active: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;

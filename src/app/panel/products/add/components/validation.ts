import { z } from "zod";
import { ImageFile } from "@/components/panel/Form/ProductImagesInput";
import productData from "@/data/product";

export const formSchema = z.object({
  name: z.string().min(1, { message: "Nama produk tidak boleh kosong" }),
  description: z
    .string()
    .min(1, { message: "Deskripsi produk tidak boleh kosong" }),
  price: z.number()
    .min(0, { message: "Harga tidak boleh negatif" })
    .min(1, { message: "Harga produk tidak boleh kosong" }),
  category: z
    .string()
    .min(1, { message: "Kategori produk tidak boleh kosong" }),
  images: z
    .array(z.any())
    .min(1, { message: "Gambar tidak boleh kosong" })
    .refine(
      (files) =>
        files.every((file: ImageFile) => file?.file?.size <= 5 * 1024 * 1024),
      { message: "Ukuran gambar maksimal 5MB" }
    )
    .refine(
      (files) =>
        files.every((file: ImageFile) =>
          ["image/jpeg", "image/png"].includes(file?.file?.type)
        ),
      { message: "Hanya format JPG, PNG yang diizinkan" }
    ),
  skus: z
    .array(
      z
        .string()
        .min(1, { message: "SKU tidak boleh kosong" })
        .refine(
          async (sku) => {
            if (sku.trim() === "") return false;
            const available = await productData.checkSKU(sku);
            return available;
          },
          { message: "SKU sudah ada" }
        )
    )
    .min(1, { message: "SKU produk minimal 1" }),
  additionalInfo: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional()
    .refine(
      (items) => {
        if (!items) return true;
        const labels = items.map((item) =>
          (item.label ?? "").trim().toLowerCase()
        );
        return new Set(labels).size === labels.length;
      },
      { message: "Label harus unik" }
    ),
});

export type FormValues = z.infer<typeof formSchema>;

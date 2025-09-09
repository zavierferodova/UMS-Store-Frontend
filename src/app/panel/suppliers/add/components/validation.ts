import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  phone: z
    .string()
    .min(1, "No telp tidak boleh kosong")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
  email: z.string().email("Email tidak valid").or(z.literal("")).optional(),
  address: z.string().min(1, "Alamat tidak boleh kosong"),
  discount: z
    .string()
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((val) => val >= 0 && val <= 100, {
      message: "Diskon harus antara 0–100",
    })
    .transform(val => val.toString()),
});

export type FormValues = z.infer<typeof formSchema>;
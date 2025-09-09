import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  gender: z.enum(["male", "female"]).or(z.string().optional()),
  phone: z.string().regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka").or(z.string().optional()),
  address: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
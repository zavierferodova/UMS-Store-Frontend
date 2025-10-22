import { z } from 'zod';

export const formSchema = z.object({
  email: z.email('Email tidak valid'),
  username: z
    .string()
    .regex(/^$|^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore')
    .or(z.string().optional()),
});

export const avatarSchema = z.object({
  profileImage: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Gambar tidak boleh kosong')
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Ukuran gambar maksimal 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Hanya format JPG, PNG, dan WEBP yang diizinkan',
    )
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;
export type AvatarFormValues = z.infer<typeof avatarSchema>;

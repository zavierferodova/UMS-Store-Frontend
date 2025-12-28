import { z } from 'zod';

export const createCodeSchema = z.object({
  code: z.string().min(3, 'Kode minimal 3 karakter'),
  stock: z.coerce.number().min(1, 'Stok minimal 1'),
});

export const updateCodeSchema = z.object({
  stock: z.coerce.number().min(0, 'Stok tidak boleh negatif'),
  disabled: z.boolean().optional(),
});

export type CreateCodeFormValues = z.infer<typeof createCodeSchema>;
export type UpdateCodeFormValues = z.infer<typeof updateCodeSchema>;

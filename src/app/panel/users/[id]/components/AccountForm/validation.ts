import { z } from 'zod';

export const formSchema = z.object({
  email: z.email('Email tidak valid'),
  username: z
    .string()
    .regex(/^$|^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore')
    .or(z.string().optional()),
  role: z.enum(['admin', 'procurement', 'cashier']).or(z.string().optional()),
});

export type FormValues = z.infer<typeof formSchema>;

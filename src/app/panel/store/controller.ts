import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import StoreData from '@/data/store';
import { Store } from '@/domain/model/store';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nama toko tidak boleh kosong' }),
  address: z.string().min(1, { message: 'Alamat tidak boleh kosong' }),
  phone: z.string().min(1, { message: 'Nomor telepon tidak boleh kosong' }),
  email: z.string().email({ message: 'Email tidak valid' }).optional().or(z.literal('')),
  site: z.string().url({ message: 'URL tidak valid' }).optional().or(z.literal('')),
});

export function useController(initialData: Store | null) {
  const [loading, setLoading] = useState(false);
  const storeData = new StoreData(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      site: initialData?.site || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = await storeData.updateStore({
      ...values,
      email: values.email || null,
      site: values.site || null,
    });

    if (result) {
      toast.success('Data toko berhasil disimpan');
      form.reset({
        name: result.name,
        address: result.address,
        phone: result.phone,
        email: result.email || '',
        site: result.site || '',
      });
    } else {
      toast.error('Gagal menyimpan data toko');
    }
    setLoading(false);
  }

  return { form, onSubmit, loading };
}

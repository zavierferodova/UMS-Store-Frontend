import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from './validation';
import { ImageFile } from '@/components/panel/form/ProductImagesInput';
import productData from '@/data/product';
import { toast } from 'sonner';

export const useController = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      images: [] as ImageFile[],
      skus: [{ sku: '' }],
      additionalInfo: [{ label: '', value: '' }],
    },
  });

  const onSubmit = async (data: FormValues) => {
    const promise = new Promise(async (resolve, reject) => {
      const product = await productData.addProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        images: data.images.map((image) => image.file),
        skus: data.skus.map((sku) => sku.sku),
        additional_info:
          data.additionalInfo?.map((info) => ({ label: info.label, value: info.value })) || [],
      });

      if (product) {
        resolve(product);
      } else {
        reject(new Error('Gagal menambahkan produk'));
      }
    });

    toast.promise(promise, {
      loading: 'Menambahkan produk...',
      success: () => {
        form.reset();
        return 'Produk berhasil ditambahkan';
      },
      error: 'Gagal menambahkan produk',
    });
  };

  return {
    form,
    onSubmit,
  };
};

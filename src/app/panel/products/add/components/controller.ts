import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from './validation';
import { ImageFile } from '@/app/panel/products/add/components/ProductImagesInput';
import productData from '@/data/product';
import { toast } from 'sonner';

export const useController = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      images: [] as ImageFile[],
      skus: [{ sku: '', supplier: null }],
      additionalInfo: [{ label: '', value: '' }],
    },
  });

  const onSubmit = async (data: FormValues) => {
    const promise = new Promise(async (resolve, reject) => {
      const product = await productData.addProduct({
        name: data.name,
        description: data.description,
        category: data.category,
        images: data.images.map((image) => image.file),
        skus: data.skus.map((sku) => ({ sku: sku.sku, supplier: sku.supplier })),
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

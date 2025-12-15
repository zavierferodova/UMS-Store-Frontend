import productData from '@/data/product';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from './validation';
import { toast } from 'sonner';
import { Product } from '@/domain/model/product';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { panelRoutes } from '@/routes/route';
import { useRouter } from 'next/navigation';

export const useController = (product: Product) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      category: product.category?.id,
      images: product.images.map((image) => ({ id: image.id, src: image.image })),
      skus: product.skus.map((sku) => ({
        id: sku.id,
        sku: sku.sku,
        supplier: sku.supplier?.id || null,
        supplierName: sku.supplier?.name || null,
        stock: sku.stock,
      })),
      additionalInfo:
        !product.additional_info || product.additional_info.length === 0
          ? [{ label: '', value: '' }]
          : product.additional_info.map((info) => ({ label: info.label, value: info.value })),
      active: !product.is_deleted,
    },
  });

  const updateProductForm = async () => {
    const promise = new Promise<Product>((resolve, reject) => {
      productData.getProduct(product.id).then((response) => {
        if (response) {
          resolve(response);
        } else {
          reject(new Error('Gagal memuat produk'));
        }
      });
    });

    toast.promise(promise, {
      loading: 'Memuat data baru...',
      success: (newProduct) => {
        setCurrentProduct(newProduct);
        form.reset({
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category?.id,
          images: newProduct.images.map((image) => ({ id: image.id, src: image.image })),
          skus: newProduct.skus.map((sku) => ({
            id: sku.id,
            sku: sku.sku,
            supplier: sku.supplier?.id || null,
            supplierName: sku.supplier?.name || null,
            stock: sku.stock,
          })),
          additionalInfo:
            !newProduct.additional_info || newProduct.additional_info.length === 0
              ? [{ label: '', value: '' }]
              : newProduct.additional_info.map((info) => ({
                  label: info.label,
                  value: info.value,
                })),
          active: !newProduct.is_deleted,
        });
        return 'Produk berhasil dimuat';
      },
      error: 'Gagal memuat produk',
    });
  };

  const onDelete = () => {
    setDeleteDialogOpen(false);
    const promise = new Promise<boolean>(async (resolve, reject) => {
      const success = await productData.deleteProduct(product.id);
      if (success) {
        resolve(success);
      } else {
        reject(new Error('Gagal menghapus produk'));
      }
    });

    toast.promise(promise, {
      loading: 'Menghapus produk...',
      success: () => {
        router.push(panelRoutes.products);
        return 'Produk berhasil dihapus';
      },
      error: 'Gagal menghapus produk',
    });
  };

  const onSubmit = async (data: FormValues) => {
    const promise = new Promise(async (resolve, reject) => {
      const oldSkus = data.skus.filter((sku) => sku.id);
      const newSkus = data.skus.filter((sku) => !sku.id);

      const updatedProduct = await productData.updateProduct(product.id, {
        name: data.name,
        description: data.description,
        category: data.category,
        images: data.images.map((img) => ({ id: img.id, file: img.file, src: img.src })),
        skus: [...oldSkus, ...newSkus].map((s) => ({
          id: s.id,
          sku: s.sku,
          supplier: s.supplier,
        })),
        additional_info:
          data.additionalInfo?.map((info) => ({ label: info.label, value: info.value })) || [],
        is_deleted: !data.active,
      });

      if (updatedProduct) {
        resolve(updatedProduct);
      } else {
        reject(new Error('Gagal memperbarui produk'));
      }
    });

    toast.promise(promise, {
      loading: 'Memperbarui produk...',
      success: () => {
        updateProductForm();
        return 'Produk berhasil diperbarui';
      },
      error: 'Gagal memperbarui produk',
    });
  };

  return {
    form,
    user,
    deleteDialogOpen,
    onSubmit,
    onDelete,
    setDeleteDialogOpen,
    currentProduct,
  };
};

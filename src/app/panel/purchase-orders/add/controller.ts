import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProductSingleSKU } from '@/domain/model/product';
import { PurchaseOrderProduct } from '@/app/panel/purchase-orders/add/components/PurchaseOrderProductsList';
import { formSchema, FormValues } from './validation';
import purchaseOrderData from '@/data/purchase-order';
import { POPayout } from '@/domain/model/purchase-order';
import { panelRoutes } from '@/routes/route';

export function useController() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<PurchaseOrderProduct[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: undefined,
      payout: '' as POPayout,
      note: '',
      items: [],
    },
  });

  const handleProductSelect = (product: ProductSingleSKU) => {
    const exists = selectedProducts.find((p) => p.product.sku.sku === product.sku.sku);
    if (exists) {
      toast.error('Produk telah dipilih!');
      return;
    }
    setSelectedProducts((prev) => [...prev, { product, stock: 0 }]);
    toast.success(`${product.name} ditambahkan`);
  };

  const handleStockChange = (productId: string, stock: number) => {
    setSelectedProducts((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, stock } : item)),
    );
  };

  const handleRemoveProduct = (productSKU: string) => {
    const product = selectedProducts.find((p) => p.product.sku.sku === productSKU);
    setSelectedProducts((prev) => prev.filter((item) => item.product.sku.sku !== productSKU));
    if (product) {
      toast.success(`${product.product.name} dihapus`);
    }
  };

  const onSubmit = async (data: FormValues, draft: boolean = false) => {
    if (!session?.user?.id) {
      toast.error('Sesi tidak ditemukan. Silakan login kembali.');
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      if (data.supplier) {
        const purchaseOrder = await purchaseOrderData.addPurchaseOrder({
          user_id: session.user.id,
          supplier_id: data.supplier.id,
          payout: data.payout as POPayout,
          note: data.note,
          draft: draft,
        });
        if (purchaseOrder) {
          resolve(purchaseOrder);
        } else {
          reject(new Error('Gagal menyimpan purchase order'));
        }
      }
    });

    toast.promise(promise, {
      loading: draft ? 'Menyimpan draft...' : 'Menyimpan purchase order...',
      success: () => {
        setShowConfirmDialog(false);
        form.reset();
        setSelectedProducts([]);
        router.push(panelRoutes.purchaseOrders);
        return draft ? 'Draft berhasil disimpan' : 'Purchase order berhasil disimpan';
      },
      error: draft ? 'Gagal menyimpan draft' : 'Gagal menyimpan purchase order',
    });
  };

  const handleSaveDraft = () => {
    form.handleSubmit((data) => onSubmit(data, true))();
  };

  const handleSave = () => {
    form.handleSubmit((data) => onSubmit(data, false))();
  };

  return {
    form,
    showConfirmDialog,
    selectedProducts,
    setShowConfirmDialog,
    handleProductSelect,
    handleStockChange,
    handleRemoveProduct,
    handleSaveDraft,
    handleSave,
  };
}

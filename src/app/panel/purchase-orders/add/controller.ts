import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProductSingleSKU } from '@/domain/model/product';
import { formSchema, FormValues } from './validation';
import purchaseOrderData from '@/data/purchase-order';
import { PurchaseOrderPayout, PurchaseOrderStatus } from '@/domain/model/purchase-order';
import { panelRoutes } from '@/routes/route';

export function useController() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductSingleSKU[]>([]);
  const [searchProductText, setSearchProductText] = useState('');

  const filteredProducts = selectedProducts.filter((p) => {
    const text = searchProductText.trim().toLowerCase();
    if (!text) return true;
    return p.sku.sku.toLowerCase().includes(text) || p.name.toLowerCase().includes(text);
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: undefined,
      payout: '' as PurchaseOrderPayout,
      note: '',
      items: [],
    },
  });

  const handleProductSelect = (product: ProductSingleSKU) => {
    const exists = selectedProducts.find((p) => p.sku.sku === product.sku.sku);
    if (exists) {
      toast.error('Produk telah dipilih!');
      return;
    }
    setSelectedProducts((prev) => [...prev, { ...product }]);
    toast.success(`${product.name} ditambahkan`);
  };

  const handleRemoveProduct = (productSKU: string) => {
    const product = selectedProducts.find((p) => p.sku.sku === productSKU);
    setSelectedProducts((prev) => prev.filter((item) => item.sku.sku !== productSKU));
    if (product) {
      toast.success(`${product.name} dihapus`);
    }
  };

  const onSubmit = async (data: FormValues, status: PurchaseOrderStatus) => {
    if (!session?.user?.id) {
      toast.error('Sesi tidak ditemukan. Silakan login kembali.');
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      if (data.supplier) {
        const purchaseOrder = await purchaseOrderData.addPurchaseOrder({
          requester_id: session.user.id,
          supplier_id: data.supplier.id,
          payout: data.payout as PurchaseOrderPayout,
          note: data.note,
          status: status,
          items: form.getValues().items.map((item) => ({
            product_sku: item.product_sku,
            price: item.price,
            amounts: item.amounts,
            supplier_discount: item.supplier_discount,
          })),
        });

        if (purchaseOrder) {
          resolve(purchaseOrder);
        } else {
          reject(new Error('Gagal menyimpan purchase order'));
        }
      }
    });

    const successDispatcher = () => {
      setShowConfirmDialog(false);
      form.reset();
      setSelectedProducts([]);
      router.push(panelRoutes.purchaseOrders);
    };

    switch (status) {
      case PurchaseOrderStatus.WAITING_APPROVAL:
        toast.promise(promise, {
          loading: 'Menyimpan purchase order...',
          success: () => {
            successDispatcher();
            return 'Purchase order berhasil disimpan';
          },
          error: 'Gagal menyimpan purchase order',
        });
        break;
      case PurchaseOrderStatus.DRAFT:
        toast.promise(promise, {
          loading: 'Menyimpan draft...',
          success: () => {
            successDispatcher();
            return 'Draft berhasil disimpan';
          },
          error: 'Gagal menyimpan draft',
        });
        break;
    }
  };

  const handleSaveDraft = () => {
    form.handleSubmit((data) => onSubmit(data, PurchaseOrderStatus.DRAFT))();
  };

  const handleSave = () => {
    form.handleSubmit((data) => onSubmit(data, PurchaseOrderStatus.WAITING_APPROVAL))();
  };

  return {
    form,
    showConfirmDialog,
    selectedProducts,
    searchProductText,
    filteredProducts,
    setShowConfirmDialog,
    handleProductSelect,
    handleRemoveProduct,
    handleSaveDraft,
    handleSave,
    setSearchProductText,
  };
}

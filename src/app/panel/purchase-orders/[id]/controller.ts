import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ProductSingleSKU } from '@/domain/model/product';
import { formSchema, FormValues } from './validation';
import purchaseOrderData from '@/data/purchase-order';
import {
  PurchaseOrderPayout,
  PurchaseOrder,
  PurchaseOrderStatus,
} from '@/domain/model/purchase-order';
import { panelRoutes } from '@/routes/route';
import { ConfirmationType } from './components/ConfirmationDialog';

export function useController(purchaseOrder: PurchaseOrder) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmationType, setConfirmationType] = useState<ConfirmationType>(null);
  const [searchProductText, setSearchProductText] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductSingleSKU[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: undefined,
      payout: '' as PurchaseOrderPayout,
      note: '',
      items: [],
    },
  });

  const filteredProducts = selectedProducts.filter((p) => {
    const text = searchProductText.trim().toLowerCase();
    if (!text) return true;
    return p.sku.sku.toLowerCase().includes(text) || p.name.toLowerCase().includes(text);
  });

  useEffect(() => {
    if (purchaseOrder) {
      form.reset({
        supplier: purchaseOrder.supplier,
        payout: purchaseOrder.payout as PurchaseOrderPayout,
        note: purchaseOrder.note || '',
        items: purchaseOrder.items.map((item) => ({
          product_sku: item.product.sku.sku,
          price: item.price,
          amounts: item.amounts,
          supplier_discount: item.supplier_discount,
        })),
      });

      const products: ProductSingleSKU[] = purchaseOrder.items.map((item) => ({
        ...item.product,
      }));

      setSelectedProducts(products);
    }
  }, [purchaseOrder, form]);

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

  const onSubmit = async (
    data: FormValues,
    status: PurchaseOrderStatus,
    rejectionMessage?: string,
  ) => {
    if (!session?.user?.id) {
      toast.error('Sesi tidak ditemukan. Silakan login kembali.');
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      if (data.supplier) {
        if (status === PurchaseOrderStatus.DRAFT) {
          const replaceResponse = await purchaseOrderData.replacePurchaseOrderItems(
            purchaseOrder.id,
            {
              items: form.getValues().items.map((item) => ({
                product_sku: item.product_sku,
                price: item.price,
                amounts: item.amounts,
                supplier_discount: item.supplier_discount,
              })),
            },
          );

          if (!replaceResponse) {
            reject(new Error('Gagal menyimpan purchase order'));
            return;
          }
        }

        const updateResponse = await purchaseOrderData.updatePurchaseOrder(purchaseOrder.id, {
          payout: data.payout as PurchaseOrderPayout,
          note: data.note,
          status: status,
          rejection_message: rejectionMessage,
          approver_id: status === PurchaseOrderStatus.APPROVED ? session.user.id : undefined,
        });

        if (updateResponse) {
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
      case PurchaseOrderStatus.DRAFT:
        toast.promise(promise, {
          loading: 'Menyimpan draft...',
          success: () => {
            successDispatcher();
            return 'Draft berhasil disimpan';
          },
          error: 'Gagal menyimpan draft',
        });
      case PurchaseOrderStatus.CANCELLED:
        toast.promise(promise, {
          loading: 'Membatalkan purchase order...',
          success: () => {
            successDispatcher();
            return 'Purchase order berhasil dibatalkan';
          },
          error: 'Gagal membatalkan purchase order',
        });
        break;
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
      case PurchaseOrderStatus.APPROVED:
        toast.promise(promise, {
          loading: 'Menyetujui purchase order...',
          success: () => {
            successDispatcher();
            return 'Purchase order berhasil disetujui';
          },
          error: 'Gagal menyetujui purchase order',
        });
        break;
      case PurchaseOrderStatus.REJECTED:
        toast.promise(promise, {
          loading: 'Menolak purchase order...',
          success: () => {
            successDispatcher();
            return 'Purchase order berhasil ditolak';
          },
          error: 'Gagal menolak purchase order',
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

  const handleApprove = () => {
    form.handleSubmit((data) => onSubmit(data, PurchaseOrderStatus.APPROVED))();
  };

  const handleReject = (rejectionMessage: string) => {
    form.handleSubmit((data) => onSubmit(data, PurchaseOrderStatus.REJECTED, rejectionMessage))();
  };

  const handleCancel = () => {
    form.handleSubmit((data) => onSubmit(data, PurchaseOrderStatus.CANCELLED))();
  };

  const openConfirmDialog = (type: ConfirmationType) => {
    setConfirmationType(type);
    setShowConfirmDialog(true);
  };

  const handleConfirm = (rejectionReason?: string) => {
    switch (confirmationType) {
      case 'save':
        handleSave();
        break;
      case 'cancel':
        handleCancel();
        break;
      case 'reject':
        if (rejectionReason) {
          handleReject(rejectionReason);
        }
        break;
      case 'approve':
        handleApprove();
        break;
    }
  };

  return {
    form,
    showConfirmDialog,
    confirmationType,
    selectedProducts,
    searchProductText,
    filteredProducts,
    showRejectionDialog,
    setShowConfirmDialog,
    setSearchProductText,
    setShowRejectionDialog,
    openConfirmDialog,
    handleConfirm,
    handleProductSelect,
    handleRemoveProduct,
    handleSaveDraft,
  };
}

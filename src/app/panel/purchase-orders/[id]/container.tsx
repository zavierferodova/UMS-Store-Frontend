'use client';

import { useController } from './controller';
import { useSession } from 'next-auth/react';
import { isAdmin, isProcurement } from '@/lib/role';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { RejectionMessageDialog } from './components/RejectionMessageDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PoProductsList } from '@/app/panel/purchase-orders/add/components/PoProductsList';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { panelRoutes } from '@/routes/route';
import { useEffect } from 'react';
import { usePanelHeader } from '@/components/panel/Header';
import { PurchaseOrder, PurchaseOrderStatus } from '@/domain/model/purchase-order';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { SearchProductCommand } from '@/components/panel/Form/SearchProductCommand';
import { CardInputPurchaseOrder } from '../add/components/CardInputPurchaseOrder';
import { CardDetailPurchaseOrder } from './components/CardDetailPurchaseOrder';

import { SpinAnimation } from '@/components/animation/SpinAnimation';

interface PurchaseOrderDetailContainerProps {
  purchaseOrder: PurchaseOrder;
}

export default function PurchaseOrderDetailContainer({
  purchaseOrder,
}: PurchaseOrderDetailContainerProps) {
  const {
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
  } = useController(purchaseOrder);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const { setMenu } = usePanelHeader();
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;
  const status = purchaseOrder.status;

  const readonlyProcurementStatuses = [
    PurchaseOrderStatus.WAITING_APPROVAL,
    PurchaseOrderStatus.APPROVED,
    PurchaseOrderStatus.COMPLETED,
    PurchaseOrderStatus.CANCELED,
  ];

  const readonlyAdminStatuses = [
    PurchaseOrderStatus.WAITING_APPROVAL,
    PurchaseOrderStatus.APPROVED,
    PurchaseOrderStatus.REJECTED,
    PurchaseOrderStatus.COMPLETED,
    PurchaseOrderStatus.CANCELED,
  ];

  let readonly = false;

  if (isProcurement(user)) {
    if (readonlyProcurementStatuses.includes(status)) {
      readonly = true;
    }
  } else if (isAdmin(user)) {
    if (readonlyAdminStatuses.includes(status)) {
      readonly = true;
    }
  }

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Purchase Order',
        href: panelRoutes.purchaseOrders,
      },
      {
        name: 'Detail',
        href: '#',
      },
    ]);
  }, [setMenu]);

  if (sessionStatus === 'loading') {
    return <SpinAnimation />;
  }

  return (
    <Form {...form}>
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-6">
          {!readonly && (
            <CardInputPurchaseOrder
              purchaseOrder={purchaseOrder}
              form={form}
              className="lg:w-[30%]"
            />
          )}
          {readonly && (
            <CardDetailPurchaseOrder purchaseOrder={purchaseOrder} className="lg:w-[30%]" />
          )}

          <div className="lg:w-[65%]">
            <Card style={{ height: 'max-content' }}>
              <CardHeader>
                <CardTitle>Produk</CardTitle>
                <CardDescription>Cari dan tambahkan produk yang akan di-order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-end items-center gap-2">
                      <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <Search className="w-4 h-4" />
                        </span>
                        <Input
                          type="text"
                          placeholder="Cari produk berdasarkan SKU atau nama..."
                          className="pl-9 w-full"
                          value={searchProductText}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchProductText(e.target.value)
                          }
                        />
                      </div>
                      {!readonly && (
                        <Button
                          type="button"
                          variant="default"
                          className="cursor-pointer ml-2"
                          onClick={() => setShowProductSearch(true)}
                        >
                          <Plus className="w-4 h-4" />
                          Tambah
                        </Button>
                      )}
                      <SearchProductCommand
                        open={showProductSearch}
                        onOpenChange={setShowProductSearch}
                        onProductSelect={handleProductSelect}
                        selectedProducts={selectedProducts}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <PoProductsList
                            products={filteredProducts}
                            onRemove={handleRemoveProduct}
                            readonly={readonly}
                            form={form}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
              {(() => {
                if (isAdmin(user) && status === PurchaseOrderStatus.WAITING_APPROVAL) {
                  return (
                    <>
                      <Button
                        type="button"
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => openConfirmDialog('approve')}
                        disabled={form.formState.isSubmitting}
                      >
                        Setujui
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => openConfirmDialog('cancel')}
                        disabled={form.formState.isSubmitting}
                      >
                        Tolak
                      </Button>
                    </>
                  );
                }

                if (isProcurement(user) && status === PurchaseOrderStatus.WAITING_APPROVAL) {
                  return (
                    <Button
                      type="button"
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => openConfirmDialog('cancel')}
                      disabled={form.formState.isSubmitting}
                    >
                      Batalkan
                    </Button>
                  );
                }

                if (status === PurchaseOrderStatus.REJECTED) {
                  return (
                    <>
                      <Button
                        type="button"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => setShowRejectionDialog(true)}
                      >
                        Lihat Alasan
                      </Button>
                      {isProcurement(user) && (
                        <Button
                          type="button"
                          variant="default"
                          className="cursor-pointer"
                          onClick={() => openConfirmDialog('save')}
                          disabled={form.formState.isSubmitting}
                        >
                          Kirim Ulang
                        </Button>
                      )}
                    </>
                  );
                }

                if (
                  (isProcurement(user) || isAdmin(user)) &&
                  status === PurchaseOrderStatus.DRAFT
                ) {
                  return (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={handleSaveDraft}
                        disabled={form.formState.isSubmitting}
                      >
                        Simpan Draft
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => openConfirmDialog('save')}
                        disabled={form.formState.isSubmitting}
                      >
                        Simpan
                      </Button>
                    </>
                  );
                }

                return null;
              })()}
            </div>
          </div>
        </div>

        <ConfirmationDialog
          open={showConfirmDialog}
          type={confirmationType}
          isLoading={form.formState.isSubmitting}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirm}
        />

        <RejectionMessageDialog
          open={showRejectionDialog}
          onOpenChange={setShowRejectionDialog}
          rejectionMessage={purchaseOrder.rejection_message || 'Tidak ada alasan penolakan'}
        />
      </div>
    </Form>
  );
}

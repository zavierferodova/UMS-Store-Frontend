'use client';

import { useController } from './controller';
import { CardInputPurchaseOrder } from './components/CardInputPurchaseOrder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchProductCommand } from '@/components/panel/form/SearchProductCommand';
import { PoProductsTableInput } from '@/components/panel/form/PoProductsTableInput';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { panelRoutes } from '@/routes/route';
import { useEffect, useState } from 'react';
import { usePanelHeader } from '@/components/panel/Header';
import { Plus, Search } from 'lucide-react';

export default function AddPurchaseOrderPage() {
  const {
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
  } = useController();
  const { setMenu } = usePanelHeader();
  const [showProductSearch, setShowProductSearch] = useState(false);

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
        name: 'Tambah',
        href: '#',
      },
    ]);
  }, [setMenu]);

  return (
    <Form {...form}>
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-6">
          <CardInputPurchaseOrder form={form} className="lg:w-[30%]" />

          <div className="lg:w-[70%]">
            <Card style={{ height: 'max-content' }}>
              <CardHeader>
                <CardTitle>Produk</CardTitle>
                <CardDescription>Cari dan tambahkan produk yang akan di-order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-end items-center gap-2">
                      <div className="relative w-full mr-2">
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
                      <Button
                        type="button"
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => setShowProductSearch(true)}
                      >
                        <Plus className="w-4 h-4" />
                        Tambah
                      </Button>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <PoProductsTableInput
                            products={filteredProducts}
                            onRemove={handleRemoveProduct}
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

            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-8">
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
                onClick={() => setShowConfirmDialog(true)}
                disabled={form.formState.isSubmitting}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>

        <SearchProductCommand
          open={showProductSearch}
          onOpenChange={setShowProductSearch}
          onProductSelect={handleProductSelect}
          selectedProducts={selectedProducts}
          supplierId={form.watch('supplier')?.id}
        />

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Simpan Purchase Order</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menyimpan purchase order ini? Setelah disimpan, purchase
                order tidak dapat diedit. Permintaan purchase order akan ditinjau oleh admin
                terlebih dahulu.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="cursor-pointer">
                  Batal
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="default"
                onClick={handleSave}
                className="cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Menyimpan...' : 'Ya, Simpan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
}

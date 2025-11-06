'use client';

import { useController } from './controller';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectSupplierSearch } from '@/components/panel/Form/SelectSupplierSearch';
import { SearchProductInput } from '@/components/panel/Form/SearchProductInput';
import { PurchaseOrderProductsList } from '@/app/panel/purchase-orders/add/components/PurchaseOrderProductsList';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { panelRoutes } from '@/routes/route';
import { useEffect } from 'react';
import { usePanelHeader } from '@/components/panel/Header';

export default function AddPurchaseOrderPage() {
  const {
    form,
    showConfirmDialog,
    selectedProducts,
    setShowConfirmDialog,
    handleProductSelect,
    handleStockChange,
    handleRemoveProduct,
    handleSaveDraft,
    handleSave,
  } = useController();
  const { setMenu } = usePanelHeader();

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
        <Card>
          <CardHeader>
            <CardTitle>Tambah Purchase Order</CardTitle>
            <CardDescription>
              Buat purchase order baru dengan mengisi form di bawah ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Supplier</FormLabel>
                    <FormControl>
                      <SelectSupplierSearch
                        value={field.value ?? null}
                        onChange={(supplier) => field.onChange(supplier)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pembayaran</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full hover:bg-accent cursor-pointer">
                          <SelectValue placeholder="Pilih metode pembayaran..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="cash">
                          Cash
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="partnership">
                          Partnership
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tulis catatan tambahan untuk purchase order..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Produk</CardTitle>
            <CardDescription>Cari dan tambahkan produk yang akan di-order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <SearchProductInput
                  onProductSelect={handleProductSelect}
                  selectedProducts={selectedProducts.map((p) => p.product)}
                />
              </div>

              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <PurchaseOrderProductsList
                        products={selectedProducts}
                        onStockChange={handleStockChange}
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

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Simpan Purchase Order</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menyimpan purchase order ini? Setelah disimpan, purchase
                order tidak dapat diedit.
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

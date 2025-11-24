'use client';

import { useController } from './controller';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectSupplierSearch } from '@/components/panel/Form/SelectSupplierSearch';
import { SearchProductCommand } from '@/components/panel/Form/SearchProductCommand';
import { PoProductsList } from '@/app/panel/purchase-orders/add/components/PoProductsList';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
          <Card className="lg:w-[30%]">
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

          <Card className="lg:w-[70%]">
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
                        <PoProductsList
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
        </div>

        <SearchProductCommand
          open={showProductSearch}
          onOpenChange={setShowProductSearch}
          onProductSelect={handleProductSelect}
          selectedProducts={selectedProducts}
        />

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

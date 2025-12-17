import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SelectProductCategory } from '@/components/panel/form/SelectProductCategory';
import {
  ProductImagesInput,
  ImageFile,
} from '@/app/panel/products/add/components/ProductImagesInput';
import { ProductSKUInput } from '@/app/panel/purchase-orders/add/components/ProductSKUInput';
import { ProductAdditionalInputs } from '@/app/panel/products/add/components/ProductAdditionalInputs';
import { useController } from './controller';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Product } from '@/domain/model/product';
import { isAdmin } from '@/lib/role';

export function ProductDetailForm({ product }: { product: Product }) {
  const { form, user, deleteDialogOpen, onSubmit, onDelete, setDeleteDialogOpen, currentProduct } =
    useController(product);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <Card>
              <CardHeader>
                <CardTitle>Detail Produk</CardTitle>
                <CardDescription>Informasi dasar tentang produk</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gambar Produk</FormLabel>
                      <FormControl>
                        <ProductImagesInput
                          images={field.value}
                          onImagesChange={(newImages: ImageFile[]) => {
                            field.onChange(newImages);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama produk"
                          maxLength={128}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>Kategori Produk*</FormLabel>
                      <FormControl>
                        <SelectProductCategory
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          error={!!error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Produk*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukkan deskripsi produk"
                          className="min-h-32"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informasi Tambahan</FormLabel>
                      <FormControl>
                        <ProductAdditionalInputs
                          additionalInfo={field.value || []}
                          onAdditionalInfoChange={(newInfo) => {
                            field.onChange(newInfo);
                          }}
                          errors={
                            Array.isArray(form.formState.errors.additionalInfo)
                              ? form.formState.errors.additionalInfo.map((err) => ({
                                  label: err?.label?.message,
                                  value: err?.value?.message,
                                }))
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isAdmin(user) && (
                  <div className="mb-10">
                    <FormLabel className="mb-1">Status Produk</FormLabel>
                    <FormDescription className="text-sm text-muted-foreground">
                      Aktifkan kembali produk yang telah dihapus
                    </FormDescription>
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-start gap-2 h-full">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary cursor-pointer"
                            />
                          </FormControl>
                          <div className="font-normal text-sm">
                            {field.value ? 'Aktif' : 'Tidak Aktif'}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6 min-w-0">
            <Card>
              <CardHeader>
                <CardTitle>SKU Produk</CardTitle>
                <CardDescription>Daftar SKU dan Supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="skus"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ProductSKUInput
                          skus={field.value}
                          onSkusChange={(newSkus) => {
                            field.onChange(newSkus);
                          }}
                          errors={
                            Array.isArray(form.formState.errors.skus)
                              ? form.formState.errors.skus
                              : undefined
                          }
                          isEditMode={true}
                          originalSkus={currentProduct.skus.map((s) => ({
                            id: s.id,
                            sku: s.sku,
                            supplier: s.supplier?.id || null,
                            supplierName: s.supplier?.name || null,
                            stock: s.stock,
                          }))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end items-center gap-2 mt-4">
              <Button type="submit" className="cursor-pointer">
                Simpan
              </Button>
              {!isAdmin(user) && (
                <Button
                  type="button"
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Hapus
                </Button>
              )}
            </div>
          </div>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah anda yakin untuk menghapus produk ?</AlertDialogTitle>
              <AlertDialogDescription>
                Produk akan dihapus dan tidak akan muncul di katalog penjualan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="cursor-pointer bg-destructive hover:bg-destructive/90"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </FormProvider>
  );
}

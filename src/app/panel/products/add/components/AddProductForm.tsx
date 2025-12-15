import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SelectProductCategory } from '@/components/panel/form/SelectProductCategory';
import { ProductImagesInput, ImageFile } from '@/components/panel/form/ProductImagesInput';
import { ProductSKUInput } from '@/app/panel/purchase-orders/add/components/ProductSKUInput';
import { ProductAdditionalInputs } from '@/components/panel/form/ProductAdditionalInputs';
import { useController } from './controller';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export function AddProductForm() {
  const { form, onSubmit } = useController();

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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer">
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

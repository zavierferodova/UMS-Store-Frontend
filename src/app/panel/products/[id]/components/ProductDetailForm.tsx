import React from "react";
import { FormProvider } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectProductCategory } from "@/components/panel/Form/SelectProductCategory";
import {
  ProductImagesInput,
  ImageFile,
} from "@/components/panel/Form/ProductImagesInput";
import { MultiSkuInput } from "@/components/panel/Form/MultiSkuInput";
import { ProductAdditionalInputs } from "@/components/panel/Form/ProductAdditionalInputs";
import { useController } from "./controller";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Product } from "@/domain/model/product";

export function ProductDetailForm({ product }: { product: Product }) { 
  const { form, onSubmit } = useController(product);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center mb-6"
      >
        <div className="w-full max-w-4xl">
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
                name="skus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU Produk</FormLabel>
                    <FormControl>
                      <MultiSkuInput
                        skus={field.value}
                        onSkusChange={(newSkus) => {
                          field.onChange(newSkus);
                        }}
                        errors={(() => {
                          const skuErrors = form.formState.errors.skus;
                          if (!skuErrors) return [];
                          
                          if (Array.isArray(skuErrors)) {
                            return skuErrors.map((error: { sku?: { message: string } }) => (error?.sku?.message ?? ''));
                          }
                          
                          return [];
                        })()}
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
                    <FormLabel>Nama Produk</FormLabel>
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga (IDR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Masukkan harga produk"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
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
                    <FormLabel>Kategori Produk</FormLabel>
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
                    <FormLabel>Deskripsi Produk</FormLabel>
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
                        errors={Array.isArray(form.formState.errors.additionalInfo) 
                          ? form.formState.errors.additionalInfo.map(err => ({
                              label: err?.label?.message,
                              value: err?.value?.message
                            }))
                          : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" className="cursor-pointer">
                  Simpan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
}
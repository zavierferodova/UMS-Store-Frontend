import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useController } from './controller';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Coupon, CouponType } from '@/domain/model/coupon';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

interface EditCouponFormProps {
  coupon: Coupon;
}

export function EditCouponForm({ coupon }: EditCouponFormProps) {
  const { form, onSubmit } = useController(coupon);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Kupon</CardTitle>
            <CardDescription>Perbarui informasi kupon</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kupon</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama kupon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <FormLabel>Tipe Kupon</FormLabel>
              <Input value={coupon.type === CouponType.voucher ? 'Voucher' : 'Diskon'} disabled />
            </div>

            {coupon.type === CouponType.voucher && (
              <div className="grid gap-2">
                <FormLabel>Nilai Voucher</FormLabel>
                <Input value={formatCurrency(coupon.voucher_value || 0)} disabled />
              </div>
            )}

            {coupon.type === CouponType.discount && (
              <div className="grid gap-2">
                <FormLabel>Persentase Diskon</FormLabel>
                <Input value={`${coupon.discount_percentage}%`} disabled />
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Mulai</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="block"
                        value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          if (!isNaN(date.getTime())) {
                            field.onChange(date);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Selesai</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="block"
                        value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          if (!isNaN(date.getTime())) {
                            field.onChange(date);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="disabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Nonaktifkan Kupon</FormLabel>
                    <CardDescription>
                      Kupon tidak akan bisa digunakan jika dinonaktifkan
                    </CardDescription>
                  </div>
                  <FormControl>
                    <Switch
                      className="cursor-pointer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="mt-3 flex justify-end">
          <Button className="cursor-pointer" type="submit">
            Update
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

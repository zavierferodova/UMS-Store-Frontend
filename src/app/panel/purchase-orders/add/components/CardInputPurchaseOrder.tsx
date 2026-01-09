import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../validation';
import { SelectSupplierSearch } from '@/components/panel/form/SelectSupplierSearch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { PurchaseOrder } from '@/domain/model/purchase-order';
import { Separator } from '@/components/ui/separator';

export interface CardInputPurchaseOrderProps {
  form: UseFormReturn<FormValues>;
  purchaseOrder?: PurchaseOrder;
  className?: string;
}

export function CardInputPurchaseOrder({
  form,
  className,
  purchaseOrder,
}: CardInputPurchaseOrderProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Purchase Order</CardTitle>
        <CardDescription>Detail informasi utama purchase order yang disimpan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchaseOrder && (
            <>
              <div className="grid grid-cols-[120px_10px_1fr] gap-1">
                <div className="text-sm font-medium">Status</div>
                <div>:</div>
                <div className="text-muted-foreground text-sm capitalize">
                  {purchaseOrder?.status.replace('_', ' ')}
                </div>

                <div className="text-sm font-medium">Kode</div>
                <div>:</div>
                <div className="text-muted-foreground text-sm">{purchaseOrder?.code}</div>
              </div>

              <Separator className="mb-6" />
            </>
          )}

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
                    <SelectTrigger className="hover:bg-accent w-full cursor-pointer">
                      <SelectValue placeholder="Pilih metode pembayaran..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="cash">
                      Tunai
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="partnership">
                      Konsiyasi
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
  );
}

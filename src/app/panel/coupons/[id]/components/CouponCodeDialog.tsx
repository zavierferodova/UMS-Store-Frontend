import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
  createCodeSchema,
  updateCodeSchema,
  CreateCodeFormValues,
  UpdateCodeFormValues,
} from './codes-validation';
import { CouponCode } from '@/domain/model/coupon';
import couponData from '@/data/coupon';

interface CouponCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'update';
  initialData?: CouponCode;
  onSubmit: (values: any) => Promise<boolean>;
}

export function CouponCodeDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: CouponCodeDialogProps) {
  const form = useForm<any>({
    resolver: zodResolver(mode === 'create' ? createCodeSchema : updateCodeSchema),
    defaultValues: {
      code: '',
      stock: 0,
      disabled: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === 'update' && initialData) {
        form.reset({
          stock: initialData.stock,
          disabled: initialData.disabled,
        });
      } else {
        form.reset({
          code: '',
          stock: 0,
          disabled: false,
        });
      }
    }
  }, [open, mode, initialData, form]);

  const handleSubmit = async (values: any) => {
    if (mode === 'create') {
      const availability = await couponData.checkCouponCode(values.code);
      if (availability && !availability.is_available) {
        form.setError('code', {
          type: 'manual',
          message: 'Kode kupon sudah digunakan',
        });
        return;
      }
    }

    const success = await onSubmit(values);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah Kode Kupon' : 'Edit Kode Kupon'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Buat kode kupon baru untuk kupon ini.'
              : 'Perbarui stok atau status kode kupon.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {mode === 'create' && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: DISKON50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : e.target.valueAsNumber;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === 'update' && (
              <FormField
                control={form.control}
                name="disabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Nonaktifkan</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        className="cursor-pointer"
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto cursor-pointer">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

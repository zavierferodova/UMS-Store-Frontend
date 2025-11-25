'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SelectSupplierSearch } from '@/components/panel/Form/SelectSupplierSearch';
import { Supplier } from '@/domain/model/supplier';
import { PaymentMethod } from '@/domain/model/payment-method';
import paymentMethodData from '@/data/payment-method';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { isAdmin } from '@/lib/role';

const formSchema = z.object({
  supplier: z.custom<Supplier>().refine((val) => val !== null && val !== undefined, {
    message: 'Supplier harus dipilih',
  }),
  name: z.string().min(1, { message: 'Nama pembayaran harus diisi' }),
  owner: z.string().min(1, { message: 'Pemilik harus diisi' }),
  account_number: z.string().min(1, { message: 'Nomor rekening harus diisi' }),
  active: z.boolean().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export interface DialogPaymentMethodProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editData?: PaymentMethod | null;
}

export function DialogPaymentMethod({
  open,
  onOpenChange,
  onSuccess,
  editData,
}: DialogPaymentMethodProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!editData;
  const { data: session } = useSession();
  const user = session?.user;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: null as unknown as Supplier,
      name: '',
      owner: '',
      account_number: '',
      active: true,
    },
  });

  useEffect(() => {
    if (editData && open) {
      form.reset({
        supplier: { id: editData.supplier.id } as Supplier,
        name: editData.name,
        owner: editData.owner,
        account_number: editData.account_number,
        active: !editData.is_deleted,
      });
    } else if (!open) {
      form.reset({
        supplier: null as unknown as Supplier,
        name: '',
        owner: '',
        account_number: '',
        active: true,
      });
    }
  }, [editData, open, form]);

  const onSubmit = async (data: FormSchema) => {
    setIsSubmitting(true);
    try {
      let result;

      if (isEditMode && editData) {
        const updateData: {
          name: string;
          owner: string;
          account_number: string;
          is_deleted?: boolean;
        } = {
          name: data.name,
          owner: data.owner,
          account_number: data.account_number,
        };

        // Only include active field if user is admin and value is defined
        if (isAdmin(user) && data.active !== undefined) {
          updateData.is_deleted = !data.active;
        }

        result = await paymentMethodData.updatePaymentMethod(editData.id, updateData);

        if (result) {
          toast.success('Metode pembayaran berhasil diperbarui');
        } else {
          toast.error('Gagal memperbarui metode pembayaran');
        }
      } else {
        result = await paymentMethodData.createPaymentMethod({
          supplier_id: data.supplier.id,
          name: data.name,
          owner: data.owner,
          account_number: data.account_number,
        });

        if (result) {
          toast.success('Metode pembayaran berhasil ditambahkan');
        } else {
          toast.error('Gagal menambahkan metode pembayaran');
        }
      }

      if (result) {
        form.reset();
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch {
      toast.error(
        isEditMode
          ? 'Terjadi kesalahan saat memperbarui metode pembayaran'
          : 'Terjadi kesalahan saat menambahkan metode pembayaran',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Perbarui informasi metode pembayaran. Supplier tidak dapat diubah.'
              : 'Tambahkan metode pembayaran baru untuk supplier. Isi semua field yang diperlukan.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <SelectSupplierSearch
                      value={field.value ?? null}
                      onChange={(supplier) => field.onChange(supplier)}
                      error={!!form.formState.errors.supplier}
                      disabled={isEditMode}
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
                  <FormLabel>Nama Pembayaran</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: BCA, Mandiri, BNI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pemilik</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama pemilik rekening" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Rekening</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor rekening" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isAdmin(user) && isEditMode && (
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Metode Pembayaran</FormLabel>
                    <FormDescription className="text-sm text-muted-foreground">
                      Aktifkan metode pembayaran agar dapat digunakan dalam transaksi
                    </FormDescription>
                    <div className="flex flex-row items-center gap-2 mt-2">
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
                    </div>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

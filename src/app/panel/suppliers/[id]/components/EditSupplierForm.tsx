'use client';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Supplier } from '@/domain/model/supplier';
import { useController } from './controller';
import { Switch } from '@/components/ui/switch';
import { FormDescription } from '@/components/ui/form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
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
import { isAdmin, isProcurement } from '@/lib/role';
import { SalesContactInput } from '@/app/panel/suppliers/add/components/SalesContactInput';

export interface EditSupplierFormProps {
  supplier: Supplier;
}

export const EditSupplierForm = ({ supplier }: EditSupplierFormProps) => {
  const { user, form, onSubmit, deleteDialogOpen, setDeleteDialogOpen, onDelete } =
    useController(supplier);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <Card style={{ height: 'max-content' }}>
          <CardHeader>
            <CardTitle>Pemasok</CardTitle>
            <CardDescription>Formulir untuk mengubah data pemasok</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="code">Kode</Label>
                <div className="relative">
                  <Input id="code" disabled defaultValue={supplier.code} />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(supplier.code ?? '');
                      toast.success('Kode pemasok berhasil disalin');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama*</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={128} placeholder="Masukan nama pemasok" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Telp*</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={20} placeholder="Masukan nomor telepon" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="h-max items-start">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={255} placeholder="Masukan email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat*</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Masukan alamat"
                        className="min-h-30"
                        maxLength={255}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div>
          <Card className="h-max">
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
              <CardDescription>Informasi tambahan tentang pemasok</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diskon Penjualan Default</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="Masukan diskon" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isAdmin(user) && (
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Penghapusan</FormLabel>
                        <FormDescription className="text-muted-foreground text-sm">
                          Aktifkan atau hapus pemasok agar tidak dapat digunakan pada transaksi baru
                        </FormDescription>
                        <div className="mt-2 flex flex-row items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary cursor-pointer"
                            />
                          </FormControl>
                          <div className="text-sm font-normal">
                            {field.value ? 'Aktif' : 'Dihapus'}
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 h-max">
            <CardHeader>
              <CardTitle>Kontak Penjualan</CardTitle>
              <CardDescription>Informasi kontak penjualan dari pemasok</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="contacts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kontak Sales</FormLabel>
                    <FormControl>
                      <SalesContactInput
                        contacts={field.value || []}
                        onContactsChange={(contacts) => {
                          field.onChange(contacts);
                        }}
                        errors={
                          Array.isArray(form.formState.errors.contacts)
                            ? form.formState.errors.contacts.map(
                                (err: {
                                  name?: { message?: string };
                                  phone?: { message?: string };
                                }) => ({
                                  name: err?.name?.message,
                                  phone: err?.phone?.message,
                                }),
                              )
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

          <div className="mt-4 flex justify-end gap-2">
            <Button className="w-max cursor-pointer" type="submit">
              Simpan
            </Button>
            {isProcurement(user) && (
              <Button
                className="w-max cursor-pointer"
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Hapus
              </Button>
            )}
          </div>
        </div>
      </form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pemasok</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pemasok ini? Aksi ini tidak dapat dibatalkan.
              Pemasok akan dihapus dan tidak akan muncul pada tabel data pemasok.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 cursor-pointer"
              onClick={onDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
};

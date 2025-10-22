'use client';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Supplier } from '@/domain/model/supplier';
import { useController } from './controller';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
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
import { Checkbox } from '@/components/ui/checkbox';
import { isAdmin, isProcurement } from '@/lib/role';
import { SalesContactInput } from '@/components/panel/Form/SalesContactInput';

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
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      >
        <Card>
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
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 cursor-pointer"
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
                  <FormItem className="items-start h-max">
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
                {isAdmin(user) && (
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <div className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="text-sm">
                            <div>Aktif</div>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
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
                              ? form.formState.errors.contacts.map((err: any) => ({
                                  name: err?.name?.message,
                                  phone: err?.phone?.message,
                                }))
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2 mt-4">
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

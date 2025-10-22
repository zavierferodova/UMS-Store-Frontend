'use client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useController } from './controller';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SalesContactInput } from '@/components/panel/Form/SalesContactInput';

export const AddSupplierForm = () => {
  const { form, onSubmit } = useController();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Pemasok</CardTitle>
            <CardDescription>Formulir untuk menambah pemasok baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
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
          <div className="flex justify-end mt-4">
            <Button className="w-max cursor-pointer" type="submit">
              Simpan
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

"use client";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/domain/model/supplier";
import { useController } from "./controller";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { isAdmin, isProcurement } from "@/lib/role";

export interface EditSupplierFormProps {
  supplier: Supplier;
}

export const EditSupplierForm = ({ supplier }: EditSupplierFormProps) => {
  const { user, form, onSubmit, open, setOpen, onDelete } = useController(supplier);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemasok</CardTitle>
        <CardDescription>Formulir untuk mengubah data pemasok</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="code">Kode</Label>
                <div className="relative">
                  <Input id="code" disabled defaultValue={supplier.code} />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => {
                      navigator.clipboard.writeText(supplier.code ?? "");
                      toast.success("Kode pemasok berhasil disalin");
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
                    <FormLabel>Nama</FormLabel>
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
                    <FormLabel>No Telp</FormLabel>
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
                  <FormItem>
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
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        maxLength={255}
                        placeholder="Masukan alamat"
                        className="min-h-30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="mt-5" />
            <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diskon</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Masukan diskon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <FormLabel>Status</FormLabel>
                {
                  isAdmin(user) && (
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-start gap-2 h-full">
                          <FormControl>
                            <Checkbox
                              className="cursor-pointer"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Aktif</FormLabel>
                        </FormItem>
                      )}
                    />
                  )
                }
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button className="w-max cursor-pointer" type="submit">
                Simpan
              </Button>
              {isProcurement(user) && (
                <Button
                  className="w-max cursor-pointer"
                  type="button"
                  variant="destructive"
                  onClick={() => setOpen(true)}
                >
                  Hapus
                </Button>
              )}
            </div>
          </form>
        </Form>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah anda yakin untuk menghapus pemasok ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat diurungkan. Ini akan menghapus pemasok
                secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 cursor-pointer"
                onClick={onDelete}
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

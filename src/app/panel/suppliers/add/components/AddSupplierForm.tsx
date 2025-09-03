"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useController } from "./controller";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

export const AddSupplierForm = () => {
  const { form, onSubmit } = useController();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemasok</CardTitle>
        <CardDescription>Formulir untuk menambah pemasok baru.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukan nama pemasok" />
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
                      <Input {...field} placeholder="Masukan nomor telepon" />
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
                      <Input {...field} placeholder="Masukan email" />
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
                        placeholder="Masukan alamat"
                        className="min-h-30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="mt-5"/>
            <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diskon Penjualan</FormLabel>
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
            </div>
            <div className="flex justify-end">
              <Button className="w-max cursor-pointer" type="submit">
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserIcon } from '@phosphor-icons/react/dist/ssr';
import { ShieldIcon } from 'lucide-react';
import Image from 'next/image';
import { useController } from './controller';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const { form, onSubmit } = useController();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-dvh">
      <div className="col-span-1 relative flex flex-col justify-center items-center p-5">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <div className="mb-8 text-center">
          <div className="text-3xl font-medium">Selamat Datang</div>
          <div className="text-sm text-muted-foreground font-medium">
            Masukan Identitas Anda untuk Memulai
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="flex items-center absolute left-3 top-1/2 -translate-y-1/2 gap-2">
                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                        <Separator
                          orientation="vertical"
                          className="data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-[2px] bg-gray-500/30"
                        />
                      </div>
                      <Input placeholder="Username" {...field} className="pl-13 py-6 rounded-lg" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="flex items-center absolute left-3 top-1/2 -translate-y-1/2 gap-2">
                        <ShieldIcon className="w-5 h-5 text-muted-foreground" />
                        <Separator
                          orientation="vertical"
                          className="data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-[2px] bg-gray-500/30"
                        />
                      </div>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        className="pl-13 py-6 rounded-lg"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full p-6 cursor-pointer rounded-xl">
              Masuk
            </Button>
          </form>
        </Form>
        <div className="flex justify-center items-center mt-12 w-full mb-8">
          <Separator className="data-[orientation=horizontal]:w-12 bg-gray-500/30 mr-2" />
          <div className="text-xs font-medium text-muted-foreground/50">Atau Masuk</div>
          <Separator className="data-[orientation=horizontal]:w-12 bg-gray-500/30 ml-4" />
        </div>
        <div>
          <Button
            variant="outline"
            className="w-13 h-13 rounded-full cursor-pointer"
            onClick={() => signIn('google')}
          >
            <Image loading="eager" src="/images/google.svg" alt="Google" width={40} height={40} />
          </Button>
        </div>
        <div className="mt-8 text-center w-[80%] lg:w-[60%] absolute bottom-15">
          <p className="text-sm text-muted-foreground">
            Masuk dan mulai kelola transaksi, produk, pesanan, dan diskon dengan mudah dalam satu
            website terintegrasi.
          </p>
        </div>
      </div>
      <div className="col-span-1 hidden lg:block">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-black/20 z-99" />
          <Image src="/images/login.webp" alt="Login" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}

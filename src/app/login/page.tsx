'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserIcon } from '@phosphor-icons/react/dist/ssr';
import { ShieldIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useController } from './controller';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const { form, onSubmit } = useController();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      <div className="relative col-span-1 flex flex-col items-center justify-center p-5">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <div className="mb-8 text-center">
          <div className="text-3xl font-medium">Selamat Datang</div>
          <div className="text-muted-foreground text-sm font-medium">
            Masukan Identitas Anda untuk Memulai
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-2">
                        <UserIcon className="text-muted-foreground h-5 w-5" />
                        <Separator
                          orientation="vertical"
                          className="bg-gray-500/30 data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-[2px]"
                        />
                      </div>
                      <Input placeholder="Username" {...field} className="rounded-lg py-6 pl-13" />
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
                      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-2">
                        <ShieldIcon className="text-muted-foreground h-5 w-5" />
                        <Separator
                          orientation="vertical"
                          className="bg-gray-500/30 data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-[2px]"
                        />
                      </div>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        {...field}
                        className="rounded-lg py-6 pl-13"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full cursor-pointer rounded-xl p-6">
              Masuk
            </Button>
          </form>
        </Form>
        <div className="mt-12 mb-8 flex w-full items-center justify-center">
          <Separator className="mr-2 bg-gray-500/30 data-[orientation=horizontal]:w-12" />
          <div className="text-muted-foreground/50 text-xs font-medium">Atau Masuk</div>
          <Separator className="ml-4 bg-gray-500/30 data-[orientation=horizontal]:w-12" />
        </div>
        <div>
          <Button
            variant="outline"
            className="h-13 w-13 cursor-pointer rounded-full"
            onClick={() => signIn('google')}
          >
            <Image loading="eager" src="/images/google.svg" alt="Google" width={40} height={40} />
          </Button>
        </div>
        <div className="absolute bottom-15 mt-8 w-[80%] text-center lg:w-[60%]">
          <p className="text-muted-foreground text-sm">
            Masuk dan mulai kelola transaksi, produk, pesanan, dan diskon dengan mudah dalam satu
            website terintegrasi.
          </p>
        </div>
      </div>
      <div className="col-span-1 hidden lg:block">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 z-99 bg-black/20" />
          <Image src="/images/login.webp" alt="Login" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}

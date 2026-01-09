'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { publicRoutes } from '@/routes/route';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function NoRolePage() {
  const session = useSession();

  return (
    <div className="relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)',
          }}
        />
      </div>
      <div className="relative flex h-full items-center p-4 lg:p-8">
        <div className="absolute top-6 lg:left-6">
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mb-4 flex items-center justify-center">
              <Image
                src="/images/key.png"
                alt="Kunci"
                width={250}
                height={250}
                className="rotate-90"
              />
            </div>
            <div className="mb-3 text-xl">Halo, {session.data?.user?.name.split(' ')[0]} 👋😁</div>
            <h1 className="text-2xl font-semibold tracking-tight">Maaf anda belum memiliki role</h1>
            <p className="text-muted-foreground text-sm">
              Silahkan hubungi admin untuk mendapatkan akses
            </p>
          </div>
          <div className="grid grid-cols-1">
            <button
              onClick={() =>
                signOut({
                  callbackUrl: publicRoutes.login,
                })
              }
              className={cn(buttonVariants({ variant: 'default' }), 'cursor-pointer p-5')}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

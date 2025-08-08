"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function NoRolePage() {
  const session = useSession()

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
          }}
        />
      </div>
      <div className="lg:p-8 relative h-full flex items-center">
      <div className="absolute top-8 left-8">
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex items-center justify-center mb-4">
              <Image src="/images/key.png" alt="Kunci" width={250} height={250} className="rotate-90" />
            </div>
            <div className="text-xl mb-3">Halo, {session.data?.user?.name.split(" ")[0]} 👋😁</div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Maaf anda belum memiliki role
            </h1>
            <p className="text-sm text-muted-foreground">
              Silahkan hubungi admin untuk mendapatkan akses
            </p>
          </div>
          <div className="grid grid-cols-1">
            <button
              onClick={() =>
                signOut()
              }
              className={cn(buttonVariants({ variant: "default" }), "cursor-pointer p-5")}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CameraIcon } from "lucide-react";
import { useController } from "./controller";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";

export const MyAccountForm = () => {
  const {
    form,
    fileInputRef,
    imagePreview,
    avatarForm,
    onSubmit,
    onSubmitAvatar,
    handleImageChange,
    handleAvatarClick,
  } = useController();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Akun Saya</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Form {...avatarForm}>
            <form onSubmit={avatarForm.handleSubmit(onSubmitAvatar)} className="mb-6 flex items-center space-x-4">
              <FormField
                control={avatarForm.control}
                name="profileImage"
                render={({ field: { onChange } }) => (
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      handleImageChange(e);
                      onChange(e.target.files?.[0]);
                    }}
                    className="hidden"
                    accept="image/png, image/jpeg"
                  />
                )}
              />
              <div className="relative">
                <Avatar
                  className="h-20 w-20 cursor-pointer rounded-md"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage
                    src={imagePreview || ""}
                    alt="User profile image"
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="rounded-xl">
                    <UserIcon className="text-accent-foreground/60" />
                  </AvatarFallback>
                </Avatar>
                <div
                  className="group absolute inset-0 flex h-20 w-20 cursor-pointer items-center justify-center rounded-md bg-opacity-0 transition-all duration-300 hover:bg-black/50"
                  onClick={handleAvatarClick}
                >
                  <CameraIcon className="h-6 w-6 text-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                <Button variant="outline" type="submit" className="cursor-pointer">Ubah avatar</Button>
              </div>
            </form>
          </Form>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan email anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan username anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" className="cursor-pointer">
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

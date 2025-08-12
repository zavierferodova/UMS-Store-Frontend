"use client";

import authData from "@/data/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  newPassword: z.string().min(1, { message: "Password tidak boleh kosong" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Konfirmasi password tidak boleh kosong" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const useController = () => {
  const { update: updateSession, data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const promise = new Promise((resolve, reject) => {
      authData
        .updatePassword(data.newPassword, data.confirmPassword)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Gagal memperbarui password"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: "Sedang memperbaharui password",
      success: (data) => {
        updateSession({
          user: data,
        });
        return "Password berhasil diperbarui!";
      },
      error: "Gagal memperbarui password!",
    });
  };

  return { form, onSubmit };
};

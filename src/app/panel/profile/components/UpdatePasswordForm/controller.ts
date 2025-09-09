"use client";
import authData from "@/data/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "./validation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useController = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormValues) => {
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
      success: () => {
        return "Password berhasil diperbarui!";
      },
      error: "Gagal memperbarui password!",
    });
  };

  return { form, onSubmit };
};

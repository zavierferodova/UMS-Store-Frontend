"use client";

import userData from "@/data/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { User } from "@/domain/model/user";
import { UpdateUserParams } from "@/domain/data/user";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  username: z
    .string()
    .regex(
      /^$|^[a-zA-Z0-9_]+$/,
      "Username hanya boleh berisi huruf, angka, dan underscore"
    )
    .optional()
    .or(z.literal('')),
  role: z.enum(["admin", "procurement", "cashier"]).optional(),
});

export const useController = (user: User | null) => {
  const { data: session } = useSession()
  const [userImage, setUserImage] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (user) {
      const promise = new Promise((resolve, reject) => {
        userData.updateUser(user.id.toString(), {
          email: data.email,
          username: data.username,
          role: data.role as UpdateUserParams["role"],
        }).then((user) => {
          if (user) {
            resolve(user)
          } else {
            reject("Gagal memperbaharui akun")
          }
        }).catch((error) => {
          reject(error)
        })
      })
      
      toast.promise(promise, {
        loading: "Sedang memperbaharui akun",
        success: () => {
          return "Akun berhasil diperbarui!";
        },
        error: "Gagal memperbarui akun!",
      });
    }
  };

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || "",
        username: user.username || "",
        role: user.role || undefined,
      });
      setUserImage(user.profile_image || "");
    }
  }, [user, form]);

  return {
    session,
    form,
    userImage,
    onSubmit,
  };
};

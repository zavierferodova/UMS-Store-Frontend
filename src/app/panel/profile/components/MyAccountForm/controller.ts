"use client";

import authData from "@/data/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh berisi huruf, angka, dan undescore"
    )
    .optional(),
});

const avatarSchema = z.object({
  profileImage: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Gambar tidak boleh kosong")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran gambar maksimal 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Hanya format JPG, PNG, dan WEBP yang diizinkan"
    )
    .optional(),
});

export const useController = () => {
  const { update: updateSession, data: session } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarForm = useForm<z.infer<typeof avatarSchema>>({
    resolver: zodResolver(avatarSchema),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      avatarForm.setValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmitAvatar = (data: z.infer<typeof avatarSchema>) => {
    const promise = new Promise((resolve, reject) => {
      if (!data.profileImage) {
        reject(new Error("Gambar tidak boleh kosong"));
        return;
      }

      authData.uploadProfileImage(data.profileImage)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Gagal memperbarui foto profil"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: "Sedang memperbaharui foto profil",
      success: (data) => {
        updateSession({
          user: data,
        });
        return "Foto profil berhasil diperbarui!";
      },
      error: "Gagal memperbarui foto profil!",
    });
  };

  const handleRemoveAvatar = () => {
    setImagePreview(null);
    avatarForm.setValue("profileImage", undefined);

    const promise = new Promise((resolve, reject) => {
      authData
        .updateUser({
          profile_image: null,
        })
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Gagal memperbarui akun"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: "Sedang memperbaharui akun",
      success: (data) => {
        updateSession({
          user: data,
        });
        return "Akun berhasil diperbarui!";
      },
      error: "Gagal memperbarui akun!",
    });
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const promise = new Promise((resolve, reject) => {
      authData
        .updateUser(data)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Gagal memperbarui akun"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: "Sedang memperbaharui akun",
      success: (data) => {
        updateSession({
          user: data,
        });
        return "Akun berhasil diperbarui!";
      },
      error: "Gagal memperbarui akun!",
    });
  };

  useEffect(() => {
    if (session?.user) {
      form.reset({
        email: session.user.email || "",
        username: session.user.username || "",
      });
      setImagePreview(session.user.profile_image || null);
    }
  }, [session, form]);

  return {
    form,
    avatarForm,
    imagePreview,
    fileInputRef,
    onSubmit,
    onSubmitAvatar,
    handleImageChange,
    handleAvatarClick
  };
};

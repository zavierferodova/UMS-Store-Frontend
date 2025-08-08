"use client";

import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export const useController = () => {
  const { data: session } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(
    "https://github.com/shadcn.png",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    username: session?.user?.username || "",
    gender: session?.user?.gender || "",
    phone: session?.user?.phone || "",
    address: session?.user?.address || "",
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setForm((prev) => ({ ...prev, gender: value }));
  }

  useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
        username: session.user.username || "",
        gender: session.user.gender || "",
        phone: session.user.phone || "",
        address: session.user.address || "",
      });
    }
  }, [session]);

  return {
    imagePreview,
    handleImageChange,
    handleAvatarClick,
    handleRemoveAvatar,
    fileInputRef,
    user: form,
    handleChange,
    handleGenderChange
  };
};
'use client';

import authData from '@/data/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { avatarSchema, formSchema, AvatarFormValues, FormValues } from './validation';

export const useController = () => {
  const { update: updateSession, data: session } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarForm = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarSchema),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error('Ukuran file melebihi batas 800KB. Silakan pilih file yang lebih kecil.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
          setImagePreview(null);
        }
        return;
      }

      avatarForm.setValue('profileImage', file);
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

  const onSubmitAvatar = (data: AvatarFormValues) => {
    const promise = new Promise((resolve, reject) => {
      if (!data.profileImage) {
        reject(new Error('Gambar tidak boleh kosong'));
        return;
      }

      authData
        .uploadProfileImage(data.profileImage)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Gagal memperbarui foto profil'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Sedang memperbaharui foto profil',
      success: (data) => {
        updateSession({
          user: data,
        });
        return 'Foto profil berhasil diperbarui!';
      },
      error: 'Gagal memperbarui foto profil!',
    });
  };

  const onSubmit = (data: FormValues) => {
    const promise = new Promise((resolve, reject) => {
      authData
        .updateUser(data)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Gagal memperbarui akun'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Sedang memperbaharui akun',
      success: (data) => {
        updateSession({
          user: data,
        });
        return 'Akun berhasil diperbarui!';
      },
      error: 'Gagal memperbarui akun!',
    });
  };

  useEffect(() => {
    if (session?.user) {
      form.reset({
        email: session.user.email || '',
        username: session.user.username || '',
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
    handleAvatarClick,
  };
};

'use client';

import userData from '@/data/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { User } from '@/domain/model/user';
import { UpdateUserParams } from '@/domain/data/user';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { formSchema, FormValues } from './validation';

export const useController = (user: User | null) => {
  const { data: session } = useSession();
  const [userImage, setUserImage] = useState<string>('');
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      username: user?.username || '',
      role: user?.role || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    if (user) {
      const promise = new Promise((resolve, reject) => {
        userData
          .updateUser(user.id.toString(), {
            email: data.email,
            username: data.username,
            role: data.role as UpdateUserParams['role'],
          })
          .then((user) => {
            if (user) {
              resolve(user);
            } else {
              reject('Gagal memperbaharui akun');
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

      toast.promise(promise, {
        loading: 'Sedang memperbaharui akun',
        success: () => {
          return 'Akun berhasil diperbarui!';
        },
        error: 'Gagal memperbarui akun!',
      });
    }
  };

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || undefined,
        username: user.username || undefined,
        role: user.role || undefined,
      });
      setUserImage(user.profile_image || '');
    }
  }, [user, form]);

  return {
    session,
    form,
    userImage,
    onSubmit,
  };
};

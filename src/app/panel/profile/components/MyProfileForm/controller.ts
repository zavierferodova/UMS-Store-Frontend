import authData from '@/data/auth';
import { User } from '@/domain/model/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formSchema, FormValues } from './validation';

export const useController = () => {
  const { update: updateSession, data: session } = useSession();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      gender: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    const promise = new Promise((resolve, reject) => {
      authData
        .updateUser(data)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Gagal memperbarui profile'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise as Promise<User | null>, {
      loading: 'Sedang memperbaharui profile',
      success: async (data: User | null) => {
        updateSession({
          user: data,
        });
        return 'Profile berhasil diperbarui!';
      },
      error: 'Gagal memperbarui profile!',
    });
  };

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name,
        gender:
          session.user.gender == null ? undefined : (session.user.gender as 'male' | 'female'),
        phone: session.user.phone || '',
        address: session.user.address || '',
      });
    }
  }, [session, form]);

  return { form, onSubmit };
};

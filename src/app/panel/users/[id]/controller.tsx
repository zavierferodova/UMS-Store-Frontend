import userData from '@/data/user';
import { User } from '@/domain/model/user';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useController = () => {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);

  const getUser = useCallback(() => {
    if (params) {
      const userId = params.id;
      const promise = new Promise((resolve, reject) => {
        userData.getUser(userId as string).then((data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error('Gagal memuat pengguna'));
          }
        });
      });

      toast.promise(promise, {
        loading: 'Sedang memuat pengguna',
        success: (data) => {
          const user = data as User;
          setUser(user);
          return 'Pengguna berhasil dimuat!';
        },
        error: 'Gagal memuat pengguna!',
      });
    }
  }, [params]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return {
    user,
    getUser,
  };
};

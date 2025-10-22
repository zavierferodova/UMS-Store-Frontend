import supplierData from '@/data/supplier';
import { Supplier } from '@/domain/model/supplier';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useController = () => {
  const params = useParams();
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  const getSupplier = useCallback(() => {
    if (params) {
      const supplierId = params.id;
      const promise = new Promise((resolve, reject) => {
        supplierData.getSupplier(supplierId as string).then((data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error('Gagal memuat pemasok'));
          }
        });
      });

      toast.promise(promise, {
        loading: 'Sedang memuat pemasok',
        success: (data) => {
          const supplier = data as Supplier;
          setSupplier(supplier);
          return 'Pemasok berhasil dimuat!';
        },
        error: 'Gagal memuat pemasok!',
      });
    }
  }, [params]);

  useEffect(() => {
    getSupplier();
  }, [getSupplier]);

  return {
    supplier,
    getSupplier,
  };
};

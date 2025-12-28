import { useState, useEffect, useCallback } from 'react';
import { CouponCode } from '@/domain/model/coupon';
import couponData from '@/data/coupon';
import { toast } from 'sonner';
import { CreateCodeFormValues, UpdateCodeFormValues } from './codes-validation';

export function useCouponCodesController(couponId: string) {
  const [codes, setCodes] = useState<CouponCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await couponData.getCouponCodes(couponId, {
        search: search || undefined,
      });
      setCodes(data);
    } catch (error) {
      toast.error('Gagal memuat kode kupon');
    } finally {
      setLoading(false);
    }
  }, [couponId, search]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const createCode = async (values: CreateCodeFormValues) => {
    const response = await couponData.createCouponCode(couponId, values);
    if (response) {
      toast.success('Kode kupon berhasil dibuat');
      fetchCodes();
      return true;
    } else {
      toast.error('Gagal membuat kode kupon');
      return false;
    }
  };

  const updateCode = async (code: string, values: UpdateCodeFormValues) => {
    const response = await couponData.updateCouponCode(couponId, code, values);
    if (response) {
      toast.success('Kode kupon berhasil diperbarui');
      fetchCodes();
      return true;
    } else {
      toast.error('Gagal memperbarui kode kupon');
      return false;
    }
  };

  return {
    codes,
    loading,
    search,
    setSearch,
    createCode,
    updateCode,
    refresh: fetchCodes,
  };
}

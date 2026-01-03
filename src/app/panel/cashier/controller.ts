'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { productData } from '@/data/product';
import { transactionData } from '@/data/transaction';
import { couponData } from '@/data/coupon';
import { ProductSingleSKU } from '@/domain/model/product';
import { Transaction, TransactionPayment } from '@/domain/model/transaction';
import { CheckCouponCodeUsageResponse } from '@/domain/data/coupon';
import { CartItem } from './types';

export const useProductController = () => {
  const [products, setProducts] = useState<ProductSingleSKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const fetchProducts = useCallback(
    async (currentPage: number, currentSearch: string, isReset: boolean) => {
      setLoading(true);
      try {
        const res = await productData.getProductsCatalogue({
          page: currentPage,
          limit: 20,
          search: currentSearch,
          deletion: ['active'],
        });

        if (isReset) {
          setProducts(res.data);
        } else {
          setProducts((prev) => [...prev, ...res.data]);
        }

        const totalPages = Math.ceil(res.meta.total / res.meta.limit);
        setHasMore(currentPage < totalPages);
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, debouncedSearch, false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, debouncedSearch, true);
  }, [debouncedSearch, fetchProducts]);

  const refreshProducts = useCallback(() => {
    setPage(1);
    fetchProducts(1, debouncedSearch, true);
  }, [debouncedSearch, fetchProducts]);

  return {
    products,
    loading,
    search,
    page,
    hasMore,
    setSearch,
    handleLoadMore,
    refreshProducts,
  };
};

export const useCartController = ({
  onTransactionSuccessAction,
}: {
  onTransactionSuccessAction?: () => void;
} = {}) => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedTransactions, setSavedTransactions] = useState<Transaction[]>([]);
  const [savedTransactionsLoading, setSavedTransactionsLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [lastSuccessfulTransaction, setLastSuccessfulTransaction] = useState<Transaction | null>(
    null,
  );
  const [coupons, setCoupons] = useState<CheckCouponCodeUsageResponse[]>([]);
  const [couponLoading, setCouponLoading] = useState(false);

  const checkCoupon = async (code: string) => {
    setCouponLoading(true);
    try {
      // Check if coupon already applied
      if (coupons.some((c) => c.code.code === code)) {
        toast.error('Kupon sudah digunakan');
        return;
      }

      const res = await couponData.checkCouponCodeUsage(code);
      if (res && res.code.can_use) {
        // Rule: Only one discount/percentage coupon allowed
        if (res.type === 'discount') {
          const hasDiscountCoupon = coupons.some((c) => c.type === 'discount');
          if (hasDiscountCoupon) {
            toast.error('Hanya satu kupon diskon (%) yang dapat digunakan');
            return;
          }
        }

        setCoupons((prev) => [...prev, res]);
        toast.success('Kupon berhasil dipasang');
      } else {
        toast.error('Kupon tidak valid atau tidak dapat digunakan');
      }
    } catch {
      toast.error('Gagal mengecek kupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code.code !== code));
  };

  const fetchSavedTransactions = useCallback(async () => {
    setSavedTransactionsLoading(true);
    try {
      const res = await transactionData.getTransactions({
        page: 1,
        limit: 100,
        transaction_status: ['saved'],
      });
      setSavedTransactions(res.data);
    } catch {
      toast.error('Gagal mengambil transaksi tersimpan');
    } finally {
      setSavedTransactionsLoading(false);
    }
  }, []);

  const addToCart = (product: ProductSingleSKU) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.sku.id === product.sku.id);
      if (existing) {
        if (existing.amount + 1 > product.sku.stock) {
          toast.error('Stok tidak mencukupi', { id: 'stock-error' });
          return prev;
        }
        return prev.map((item) =>
          item.sku.id === product.sku.id ? { ...item, amount: item.amount + 1 } : item,
        );
      }

      if (1 > product.sku.stock) {
        toast.error('Stok tidak mencukupi', { id: 'stock-error' });
        return prev;
      }

      return [...prev, { ...product, amount: 1 }];
    });
  };

  const updateQuantity = (skuId: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.sku.id === skuId);
      if (!item) return prev;

      const newAmount = item.amount + delta;

      if (delta > 0 && newAmount > item.sku.stock) {
        toast.error('Stok tidak mencukupi', { id: 'stock-error' });
        return prev;
      }

      return prev
        .map((item) => {
          if (item.sku.id === skuId) {
            return { ...item, amount: newAmount };
          }
          return item;
        })
        .filter((item) => item.amount > 0);
    });
  };

  const { subTotal, total, discountTotal, remainingDiscount } = useMemo(() => {
    const subTotal = cart.reduce((acc, item) => acc + item.price * item.amount, 0);
    let voucherTotal = 0;
    let percentageDiscount = 0;

    coupons.forEach((coupon) => {
      if (coupon.type === 'voucher') {
        voucherTotal += coupon.voucher_value || 0;
      } else if (coupon.type === 'discount') {
        percentageDiscount = coupon.discount_percentage || 0;
      }
    });

    const percentageDiscountAmount = (subTotal * percentageDiscount) / 100;

    let discountTotal = voucherTotal + percentageDiscountAmount;
    let remainingDiscount = 0;

    if (discountTotal > subTotal) {
      remainingDiscount = discountTotal - subTotal;
      discountTotal = subTotal;
    }

    const total = subTotal - discountTotal;
    return { subTotal, total, discountTotal, remainingDiscount };
  }, [cart, coupons]);

  const handleConfirmPayment = async (
    method: TransactionPayment,
    payAmount: number,
    note: string,
  ) => {
    if (!session?.user?.id) return;

    const loadingToast = toast.loading('Memproses transaksi...');

    try {
      let res: Transaction | null = null;

      if (currentTransaction) {
        res = await transactionData.updateTransaction(currentTransaction.id, {
          pay: payAmount,
          is_saved: false,
          payment: method,
          note,
          items: cart.map((item) => ({
            product_sku: item.sku.sku,
            amount: item.amount,
          })),
          coupons: coupons.map((c) => ({ code: c.code.code, amounts: 1 })),
        });
      } else {
        res = await transactionData.createTransaction({
          cashier: session.user.id,
          payment: method,
          pay: payAmount,
          is_saved: false,
          note,
          items: cart.map((item) => ({
            product_sku: item.sku.sku,
            amount: item.amount,
          })),
          coupons: coupons.map((c) => ({ code: c.code.code, amounts: 1 })),
        });
      }

      if (res) {
        toast.success('Transaksi berhasil!', { id: loadingToast });
        setCart([]);
        setCoupons([]);
        setCurrentTransaction(null);
        setLastSuccessfulTransaction(res);
        onTransactionSuccessAction?.();
      } else {
        toast.error('Transaksi gagal', { id: loadingToast });
      }
    } catch {
      toast.error('Terjadi kesalahan', { id: loadingToast });
    }
  };

  const handleSaveTransaction = async () => {
    if (!session?.user?.id) return;

    const loadingToast = toast.loading('Menyimpan transaksi...');

    try {
      const res = await transactionData.createTransaction({
        cashier: session.user.id,
        payment: null,
        pay: null,
        is_saved: true,
        items: cart.map((item) => ({
          product_sku: item.sku.sku,
          amount: item.amount,
        })),
        coupons: coupons.map((c) => ({ code: c.code.code, amounts: 1 })),
      });

      if (res) {
        toast.success('Transaksi disimpan!', { id: loadingToast });
        clearTransactionState();
        onTransactionSuccessAction?.();
        fetchSavedTransactions();
      } else {
        toast.error('Gagal menyimpan transaksi', { id: loadingToast });
      }
    } catch {
      toast.error('Terjadi kesalahan', { id: loadingToast });
    }
  };

  const restoreTransaction = async (transaction: Transaction) => {
    const loadingToast = toast.loading('Memulihkan transaksi...');
    try {
      const newCart: CartItem[] = [];
      let stockIssue = false;

      for (const item of transaction.items) {
        const res = await productData.getProductsCatalogue({
          page: 1,
          limit: 1,
          search: item.sku_code,
          deletion: ['active'],
        });

        if (res.data.length > 0) {
          const product = res.data[0];
          if (product.sku.sku === item.sku_code) {
            if (item.amount > product.sku.stock) {
              stockIssue = true;
              if (product.sku.stock > 0) {
                newCart.push({
                  ...product,
                  amount: product.sku.stock,
                });
              }
            } else {
              newCart.push({
                ...product,
                amount: item.amount,
              });
            }
          }
        }
      }

      if (newCart.length > 0) {
        setCart(newCart);
        setCurrentTransaction(transaction);
        toast.success('Transaksi dipulihkan!', { id: loadingToast });
        if (stockIssue) {
          toast.warning('Beberapa item disesuaikan dengan stok yang tersedia.');
        }
      } else {
        toast.error('Tidak dapat memulihkan item (produk tidak ditemukan atau stok habis)', {
          id: loadingToast,
        });
      }
    } catch {
      toast.error('Gagal memulihkan transaksi', { id: loadingToast });
    }
  };

  const clearTransactionState = () => {
    setCart([]);
    setCoupons([]);
    setCurrentTransaction(null);
  };
  const clearLastSuccessfulTransaction = () => {
    setLastSuccessfulTransaction(null);
  };

  return {
    cart,
    subTotal,
    total,
    discountTotal,
    remainingDiscount,
    savedTransactions,
    savedTransactionsLoading,
    currentTransaction,
    lastSuccessfulTransaction,
    coupons,
    couponLoading,
    addToCart,
    updateQuantity,
    handleConfirmPayment,
    handleSaveTransaction,
    fetchSavedTransactions,
    restoreTransaction,
    clearTransactionState,
    clearLastSuccessfulTransaction,
    checkCoupon,
    removeCoupon,
  };
};

export const useController = () => {
  const { data: session, status } = useSession();
  const productController = useProductController();
  const cartController = useCartController({
    onTransactionSuccessAction: productController.refreshProducts,
  });

  return {
    session,
    status,
    ...productController,
    ...cartController,
  };
};

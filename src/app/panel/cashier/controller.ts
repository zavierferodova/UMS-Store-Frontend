'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { productData } from '@/data/product';
import { transactionData } from '@/data/transaction';
import { ProductSingleSKU } from '@/domain/model/product';
import { Transaction, TransactionPayment } from '@/domain/model/transaction';
import { CartItem } from './types';

export const useController = () => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<ProductSingleSKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedTransactions, setSavedTransactions] = useState<Transaction[]>([]);
  const [savedTransactionsLoading, setSavedTransactionsLoading] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [lastSuccessfulTransaction, setLastSuccessfulTransaction] = useState<Transaction | null>(
    null,
  );

  const fetchProducts = useCallback(
    async (currentPage: number, currentSearch: string, isReset: boolean) => {
      setLoading(true);
      try {
        const res = await productData.getProductsBySKU({
          page: currentPage,
          limit: 20,
          search: currentSearch,
          status: ['active'],
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
      toast.error('Failed to fetch saved transactions');
    } finally {
      setSavedTransactionsLoading(false);
    }
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, debouncedSearch, false);
  };

  const addToCart = (product: ProductSingleSKU) => {
    setCurrentTransactionId(null);
    setCart((prev) => {
      const existing = prev.find((item) => item.sku.id === product.sku.id);
      if (existing) {
        return prev.map((item) =>
          item.sku.id === product.sku.id ? { ...item, amount: item.amount + 1 } : item,
        );
      }
      return [...prev, { ...product, amount: 1 }];
    });
  };

  const updateQuantity = (skuId: string, delta: number) => {
    setCurrentTransactionId(null);
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.sku.id === skuId) {
            const newAmount = item.amount + delta;
            return { ...item, amount: newAmount };
          }
          return item;
        })
        .filter((item) => item.amount > 0);
    });
  };

  const { subTotal, total } = useMemo(() => {
    const subTotal = cart.reduce((acc, item) => acc + item.price * item.amount, 0);
    const total = subTotal;
    return { subTotal, total };
  }, [cart]);

  const handleConfirmPayment = async (method: TransactionPayment, payAmount: number) => {
    if (!session?.user?.id) return;

    const loadingToast = toast.loading('Processing transaction...');

    try {
      let res: Transaction | null = null;

      if (currentTransactionId) {
        res = await transactionData.updateTransaction(currentTransactionId, {
          pay: payAmount,
          is_saved: false,
        });
      } else {
        res = await transactionData.createTransaction({
          cashier: session.user.id,
          payment: method,
          pay: payAmount,
          is_saved: false,
          items: cart.map((item) => ({
            product_sku: item.sku.sku,
            unit_price: item.price,
            amount: item.amount,
          })),
        });
      }

      if (res) {
        toast.success('Transaction successful!', { id: loadingToast });
        setCart([]);
        setCurrentTransactionId(null);
        setLastSuccessfulTransaction(res);
      } else {
        toast.error('Transaction failed', { id: loadingToast });
      }
    } catch {
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const handleSaveTransaction = async () => {
    if (!session?.user?.id) return;

    const loadingToast = toast.loading('Saving transaction...');

    try {
      const res = await transactionData.createTransaction({
        cashier: session.user.id,
        payment: null,
        pay: null,
        is_saved: true,
        items: cart.map((item) => ({
          product_sku: item.sku.sku,
          unit_price: item.price,
          amount: item.amount,
        })),
      });

      if (res) {
        toast.success('Transaction saved!', { id: loadingToast });
        setCart([]);
      } else {
        toast.error('Failed to save transaction', { id: loadingToast });
      }
    } catch {
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const restoreTransaction = async (transaction: Transaction) => {
    const loadingToast = toast.loading('Restoring transaction...');
    try {
      const newCart: CartItem[] = [];
      for (const item of transaction.items) {
        const res = await productData.getProductsBySKU({
          page: 1,
          limit: 1,
          search: item.sku_code,
          status: ['active'],
        });

        if (res.data.length > 0) {
          const product = res.data[0];
          if (product.sku.sku === item.sku_code) {
            newCart.push({
              ...product,
              amount: item.amount,
            });
          }
        }
      }

      if (newCart.length > 0) {
        setCart(newCart);
        setCurrentTransactionId(transaction.id);
        toast.success('Transaction restored!', { id: loadingToast });
      } else {
        toast.error('Could not restore items (products not found)', { id: loadingToast });
      }
    } catch {
      toast.error('Failed to restore transaction', { id: loadingToast });
    }
  };

  const clearTransactionState = () => {
    setCart([]);
    setCurrentTransactionId(null);
  };

  const clearLastSuccessfulTransaction = () => {
    setLastSuccessfulTransaction(null);
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

  return {
    session,
    status,
    products,
    loading,
    search,
    page,
    hasMore,
    cart,
    subTotal,
    total,
    savedTransactions,
    savedTransactionsLoading,
    currentTransactionId,
    lastSuccessfulTransaction,
    setSearch,
    handleLoadMore,
    addToCart,
    updateQuantity,
    handleConfirmPayment,
    handleSaveTransaction,
    fetchSavedTransactions,
    restoreTransaction,
    clearTransactionState,
    clearLastSuccessfulTransaction,
  };
};

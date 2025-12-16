'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { productData } from '@/data/product';
import { transactionData } from '@/data/transaction';
import { ProductSingleSKU } from '@/domain/model/product';
import { Transaction, TransactionPayment } from '@/domain/model/transaction';
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
        const res = await productData.getProductsBySKU({
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

  return {
    products,
    loading,
    search,
    page,
    hasMore,
    setSearch,
    handleLoadMore,
  };
};

export const useCartController = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedTransactions, setSavedTransactions] = useState<Transaction[]>([]);
  const [savedTransactionsLoading, setSavedTransactionsLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [lastSuccessfulTransaction, setLastSuccessfulTransaction] = useState<Transaction | null>(
    null,
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

  const addToCart = (product: ProductSingleSKU) => {
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

      if (currentTransaction) {
        res = await transactionData.updateTransaction(currentTransaction.id, {
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
        setCurrentTransaction(null);
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
        clearTransactionState();
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
          deletion: ['active'],
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
        setCurrentTransaction(transaction);
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
    setCurrentTransaction(null);
  };
  const clearLastSuccessfulTransaction = () => {
    setLastSuccessfulTransaction(null);
  };

  return {
    cart,
    subTotal,
    total,
    savedTransactions,
    savedTransactionsLoading,
    currentTransaction,
    lastSuccessfulTransaction,
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

export const useController = () => {
  const { data: session, status } = useSession();
  const productController = useProductController();
  const cartController = useCartController();

  return {
    session,
    status,
    ...productController,
    ...cartController,
  };
};

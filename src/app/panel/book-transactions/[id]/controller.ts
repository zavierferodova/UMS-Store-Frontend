'use client';
import cashierBookData from '@/data/cashier-book';
import { IPaginationResponse } from '@/domain/model/response';
import { CashierBookStats } from '@/domain/data/cashier-book';
import { CashierBook } from '@/domain/model/cashier-book';
import { Transaction } from '@/domain/model/transaction';
import { PageStatus } from '@/lib/page';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { usePagination } from '@/components/pagination/Paginated';
import { useQueryState, parseAsString } from 'nuqs';
import { useFilterDialog } from './components/FilterDialog';
import { useParams } from 'next/navigation';

export const useController = () => {
  const { id } = useParams<{ id: string }>();
  const { pagination, handlePageChange, handleLimitChange, updateTotalItems } = usePagination();
  const { currentPage, pageSize } = pagination;
  const [status, setStatus] = useState(PageStatus.LOADING);
  const { state: filterDialogState } = useFilterDialog();

  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [transactions, setTransactions] = useState<IPaginationResponse<Transaction>>({
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      next: null,
      previous: null,
    },
  });

  const transactionsRef = useRef(transactions);
  useEffect(() => {
    transactionsRef.current = transactions;
  }, [transactions]);

  const [cashierBook, setCashierBook] = useState<CashierBook | null>(null);
  const [cashierBookStats, setCashierBookStats] = useState<CashierBookStats | null>(null);

  const { data: session } = useSession();
  const user = session?.user;

  const fetchData = useCallback(async () => {
    if (user && id) {
      setStatus(PageStatus.LOADING);
      try {
        const book = await cashierBookData.getCashierBook(id);
        setCashierBook(book);

        if (book) {
          const stats = await cashierBookData.getCashierBookStats(book.id);
          setCashierBookStats(stats);

          const response = await cashierBookData.getCashierBookTransactions(book.id, {
            page: currentPage,
            limit: pageSize,
            search: search || undefined,
            start_date: filterDialogState.startDate || undefined,
            end_date: filterDialogState.endDate || undefined,
            transaction_status: filterDialogState.transactionStatus,
            payment: filterDialogState.paymentMethod,
          });

          setTransactions({
            data: response.data,
            meta: response.meta,
          });
          updateTotalItems(response.meta.total);
        } else {
          // If book not found, maybe redirect or show error? For now just empty.
          // But realistically if getCashierBook returns null, it might be 404.
          // Keeping it simple.
        }
      } finally {
        setStatus(PageStatus.SUCCESS);
      }
    }
  }, [
    user,
    id,
    currentPage,
    pageSize,
    search,
    filterDialogState.startDate,
    filterDialogState.endDate,
    filterDialogState.transactionStatus,
    filterDialogState.paymentMethod,
    updateTotalItems,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    status,
    transactions,
    pagination,
    cashierBook,
    cashierBookStats,
    search,
    updateSearch: setSearch,
    filterDialogState,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
  };
};

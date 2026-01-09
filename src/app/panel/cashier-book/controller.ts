'client';
import cashierBookData from '@/data/cashier-book';
import { IPaginationResponse } from '@/domain/model/response';
import { CashierBookStats } from '@/domain/data/cashier-book';
import { CashierBook } from '@/domain/model/cashier-book';
import { Transaction } from '@/domain/model/transaction';
import { PageStatus } from '@/lib/page';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { usePagination } from '@/components/pagination/Paginated';
import { useQueryState, parseAsString } from 'nuqs';
import { useFilterDialog } from './components/FilterDialog';

export const useController = () => {
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

  const [activeCashierBook, setActiveCashierBook] = useState<CashierBook | null>(null);
  const [cashierBookStats, setCashierBookStats] = useState<CashierBookStats | null>(null);

  const { data: session } = useSession();
  const user = session?.user;

  const fetchCashierBookData = useCallback(async () => {
    if (user) {
      setStatus(PageStatus.LOADING);
      try {
        const active = await cashierBookData.getActiveCashierBook();
        setActiveCashierBook(active);

        if (active) {
          const stats = await cashierBookData.getActiveCashierBookStats();
          setCashierBookStats(stats);

          const response = await cashierBookData.getCashierBookTransactions(active.id, {
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
          setCashierBookStats(null);
          setTransactions({
            data: [],
            meta: {
              total: 0,
              page: currentPage,
              limit: pageSize,
              next: null,
              previous: null,
            },
          });
          updateTotalItems(0);
        }
      } finally {
        setStatus(PageStatus.SUCCESS);
      }
    }
  }, [
    user,
    currentPage,
    pageSize,
    search,
    filterDialogState.startDate,
    filterDialogState.endDate,
    filterDialogState.transactionStatus,
    filterDialogState.paymentMethod,
    updateTotalItems,
  ]);

  const handleOpenCashierBook = async (cash_drawer: number) => {
    if (user) {
      await cashierBookData.openCashierBook(user.id, cash_drawer);
      await fetchCashierBookData();
    }
  };

  const handleCloseCashierBook = async () => {
    if (user) {
      await cashierBookData.closeCashierBook();
      await fetchCashierBookData();
    }
  };

  useEffect(() => {
    fetchCashierBookData();
  }, [fetchCashierBookData]);

  return {
    pagination,
    status,
    transactions,
    activeCashierBook,
    cashierBookStats,
    search,
    updateSearch: setSearch,
    filterDialogState,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    handleOpenCashierBook,
    handleCloseCashierBook,
  };
};

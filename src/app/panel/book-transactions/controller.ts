'use client';
import cashierBookData from '@/data/cashier-book';
import { IPaginationResponse } from '@/domain/model/response';
import { CashierBook } from '@/domain/model/cashier-book';
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

  const [cashierBooks, setCashierBooks] = useState<IPaginationResponse<CashierBook>>({
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      next: null,
      previous: null,
    },
  });

  const { data: session } = useSession();
  const user = session?.user;

  const fetchCashierBooks = useCallback(async () => {
    if (user) {
      setStatus(PageStatus.LOADING);
      try {
        const response = await cashierBookData.getCashierBooks({
          page: currentPage,
          limit: pageSize,
          search: search || undefined,
          time_open: filterDialogState.timeOpen || undefined,
          time_closed: filterDialogState.timeClosed || undefined,
          status: filterDialogState.status,
          cashier_id: filterDialogState.cashierId || undefined,
        });

        setCashierBooks({
          data: response.data,
          meta: response.meta,
        });
        updateTotalItems(response.meta.total);
      } finally {
        setStatus(PageStatus.SUCCESS);
      }
    }
  }, [
    user,
    currentPage,
    pageSize,
    search,
    filterDialogState.timeOpen,
    filterDialogState.timeClosed,
    filterDialogState.status,
    filterDialogState.cashierId,
    updateTotalItems,
  ]);

  useEffect(() => {
    fetchCashierBooks();
  }, [fetchCashierBooks]);

  const updateSearch = (value: string | null) => {
    setSearch(value);
    handlePageChange(1); // Reset to first page on search
  };

  const updatePage = (page: number) => {
    handlePageChange(page);
  };

  const updateLimit = (limit: number) => {
    handleLimitChange(limit);
  };

  return {
    status,
    cashierBooks,
    pagination,
    search,
    updateSearch,
    filterDialogState,
    updatePage,
    updateLimit,
  };
};

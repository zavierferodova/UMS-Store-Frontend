'client';
import transactionData from '@/data/transaction';
import { IPaginationResponse } from '@/domain/model/response';
import { Transaction, TransactionPayment } from '@/domain/model/transaction';
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

  const { data: session } = useSession();
  const user = session?.user;

  const fetchTransactionData = useCallback(async () => {
    if (user) {
      setStatus(PageStatus.LOADING);
      try {
        const response = await transactionData.getTransactions({
          page: currentPage,
          limit: pageSize,
          search,
          start_date: filterDialogState.startDate || undefined,
          end_date: filterDialogState.endDate || undefined,
          transaction_status: filterDialogState.transactionStatus,
          payment: filterDialogState.paymentMethod as TransactionPayment[],
        });
        setTransactions({
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
    filterDialogState.startDate,
    filterDialogState.endDate,
    filterDialogState.transactionStatus,
    filterDialogState.paymentMethod,
    updateTotalItems,
  ]);

  const updateSearch = async (searchTerm: string) => {
    await setSearch(searchTerm);
    await handlePageChange(1);
  };

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]);

  return {
    search,
    pagination,
    status,
    transactions,
    filterDialogState,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    updateSearch,
  };
};

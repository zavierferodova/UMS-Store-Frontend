'use client';
import { purchaseOrderData } from '@/data/purchase-order';
import { IPaginationResponse } from '@/domain/model/response';
import { PurchaseOrder } from '@/domain/model/purchase-order';
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

  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [purchaseOrders, setPurchaseOrders] = useState<IPaginationResponse<PurchaseOrder>>({
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      next: null,
      previous: null,
    },
  });

  const { state: filterDialogState } = useFilterDialog();
  const { data: session } = useSession();
  const user = session?.user;

  const fetchPurchaseOrders = useCallback(async () => {
    if (user) {
      setStatus(PageStatus.LOADING);
      try {
        const response = await purchaseOrderData.getPurchaseOrders({
          search,
          limit: pageSize,
          page: currentPage,
          status: filterDialogState.status,
          draft: filterDialogState.draft,
          completed: filterDialogState.completed,
          payout: filterDialogState.payout,
        });
        setPurchaseOrders({
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
    filterDialogState.draft,
    filterDialogState.completed,
    filterDialogState.payout,
    filterDialogState.status,
    updateTotalItems,
  ]);

  const updateSearch = async (searchTerm: string) => {
    await setSearch(searchTerm);
    await handlePageChange(1);
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  return {
    user,
    search,
    pagination,
    status,
    purchaseOrders,
    filterDialogState,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    updateSearch,
  };
};

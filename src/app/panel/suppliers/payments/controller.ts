'use client';
import paymentMethodData from '@/data/payment-method';
import { IPaginationResponse } from '@/domain/model/response';
import { PaymentMethod } from '@/domain/model/payment-method';
import { PageStatus } from '@/lib/page';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { usePagination } from '@/components/pagination/Paginated';
import { useQueryState, parseAsString, parseAsArrayOf } from 'nuqs';

export const useController = () => {
  const { pagination, handlePageChange, handleLimitChange, updateTotalItems } = usePagination();
  const { currentPage, pageSize } = pagination;
  const [status, setStatus] = useState(PageStatus.LOADING);

  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [paymentMethods, setPaymentMethods] = useState<IPaginationResponse<PaymentMethod>>({
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

  const fetchPaymentMethodData = useCallback(async () => {
    if (user) {
      setStatus(PageStatus.LOADING);
      try {
        const response = await paymentMethodData.getPaymentMethods({
          page: currentPage,
          limit: pageSize,
          search,
          status: statusFilter,
        });
        setPaymentMethods({
          data: response.data,
          meta: response.meta,
        });
        updateTotalItems(response.meta.total);
      } finally {
        setStatus(PageStatus.SUCCESS);
      }
    }
  }, [user, currentPage, pageSize, search, statusFilter, updateTotalItems]);

  const updateSearch = async (searchTerm: string) => {
    await setSearch(searchTerm);
    await handlePageChange(1);
  };

  const updateStatusFilter = async (statuses: string[]) => {
    await setStatusFilter(statuses);
    await handlePageChange(1);
  };

  const handleDelete = async (id: string) => {
    const result = await paymentMethodData.deletePaymentMethod(id);
    if (result) {
      await fetchPaymentMethodData();
    }
    return result;
  };

  useEffect(() => {
    fetchPaymentMethodData();
  }, [fetchPaymentMethodData]);

  return {
    user,
    search,
    pagination,
    status,
    paymentMethods,
    statusFilter,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    updateSearch,
    updateStatusFilter,
    handleDelete,
    refetch: fetchPaymentMethodData,
  };
};

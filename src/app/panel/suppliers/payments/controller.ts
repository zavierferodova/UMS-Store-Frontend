'use client';
import paymentMethodData from '@/data/payment-method';
import supplierData from '@/data/supplier';
import { IPaginationResponse } from '@/domain/model/response';
import { PaymentMethod } from '@/domain/model/payment-method';
import { Supplier } from '@/domain/model/supplier';
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

  const [deletionFilter, setDeletionFilter] = useQueryState(
    'deletion',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [supplierFilter, setSupplierFilter] = useQueryState(
    'supplier_id',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (supplierFilter) {
        const supplier = await supplierData.getSupplier(supplierFilter);
        setSelectedSupplier(supplier);
      } else {
        setSelectedSupplier(null);
      }
    };
    fetchSupplier();
  }, [supplierFilter]);

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
          deletion: deletionFilter,
          supplier_id: supplierFilter,
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
  }, [user, currentPage, pageSize, search, deletionFilter, supplierFilter, updateTotalItems]);

  const updateSearch = async (searchTerm: string) => {
    await setSearch(searchTerm);
    await handlePageChange(1);
  };

  const updateStatusFilter = async (statuses: string[]) => {
    await setDeletionFilter(statuses);
    await handlePageChange(1);
  };

  const updateSupplierFilter = async (supplierId: string) => {
    await setSupplierFilter(supplierId);
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
    deletionFilter,
    supplierFilter,
    selectedSupplier,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    updateSearch,
    updateStatusFilter,
    updateSupplierFilter,
    handleDelete,
    refetch: fetchPaymentMethodData,
  };
};

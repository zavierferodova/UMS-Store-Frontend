'client';
import supplierData from '@/data/supplier';
import { IPaginationResponse } from '@/domain/model/response';
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

  const [suppliers, setSuppliers] = useState<IPaginationResponse<Supplier>>({
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

  const fetchSupplierData = useCallback(async () => {
    if (user) {
      setStatus(PageStatus.LOADING);
      try {
        const response = await supplierData.getSuppliers({
          page: currentPage,
          limit: pageSize,
          search,
          deletion: deletionFilter,
        });
        setSuppliers({
          data: response.data,
          meta: response.meta,
        });
        updateTotalItems(response.meta.total);
      } finally {
        setStatus(PageStatus.SUCCESS);
      }
    }
  }, [user, currentPage, pageSize, search, deletionFilter, updateTotalItems]);

  const updateSearch = async (searchTerm: string) => {
    await setSearch(searchTerm);
    await handlePageChange(1);
  };

  const updateStatusFilter = async (statuses: string[]) => {
    await setDeletionFilter(statuses);
    await handlePageChange(1);
  };

  useEffect(() => {
    fetchSupplierData();
  }, [fetchSupplierData]);

  return {
    user,
    search,
    pagination,
    status,
    suppliers,
    deletionFilter,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    updateSearch,
    updateStatusFilter,
  };
};

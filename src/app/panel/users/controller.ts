import { usePagination } from '@/components/pagination/Paginated';
import userData from '@/data/user';
import { IPaginationResponse } from '@/domain/model/response';
import { User } from '@/domain/model/user';
import { PageStatus } from '@/lib/page';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';

export const useController = () => {
  const { pagination, handlePageChange, handleLimitChange, updateTotalItems } = usePagination();
  const { currentPage, pageSize } = pagination;
  const [status, setStatus] = useState(PageStatus.LOADING);
  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
    parse: (value: string) => value || '',
    serialize: (value: string) => value,
  });
  const [role, setRole] = useState<string[]>([]);
  const [users, setUsers] = useState<IPaginationResponse<User>>({
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      next: null,
      previous: null,
    },
  });

  const fetchUserData = useCallback(async () => {
    setStatus(PageStatus.LOADING);
    try {
      const response = await userData.getUsers({
        page: currentPage,
        limit: pageSize,
        search,
        role,
      });
      setUsers({
        data: response.data,
        meta: response.meta,
      });
      updateTotalItems(response.meta.total);
    } finally {
      setStatus(PageStatus.SUCCESS);
    }
  }, [currentPage, pageSize, search, role]);

  const updateSearch = (search: string) => {
    handlePageChange(1);
    setSearch(search);
  };

  const updateRole = (role: string[]) => {
    handlePageChange(1);
    setRole(role);
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    search,
    pagination,
    status,
    users,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    updateSearch,
    updateRole,
  };
};

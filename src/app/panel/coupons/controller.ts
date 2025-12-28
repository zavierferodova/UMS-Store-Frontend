'client';
import couponData from '@/data/coupon';
import { IPaginationResponse } from '@/domain/model/response';
import { Coupon, CouponType } from '@/domain/model/coupon';
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

  const [coupons, setCoupons] = useState<IPaginationResponse<Coupon>>({
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

  const fetchCouponData = useCallback(async () => {
    if (user) {
      setStatus(PageStatus.LOADING);
      try {
        const response = await couponData.getCoupons({
          page: currentPage,
          limit: pageSize,
          search,
          start_time: filterDialogState.startTime || undefined,
          end_time: filterDialogState.endTime || undefined,
          type: filterDialogState.type as CouponType[],
          disabled:
            filterDialogState.isDisabled.length > 0 ? filterDialogState.isDisabled : undefined,
        });
        setCoupons({
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
    filterDialogState.startTime,
    filterDialogState.endTime,
    filterDialogState.type,
    filterDialogState.isDisabled,
    updateTotalItems,
  ]);

  const updateSearch = async (searchTerm: string) => {
    await setSearch(searchTerm);
    await handlePageChange(1);
  };

  useEffect(() => {
    fetchCouponData();
  }, [fetchCouponData]);

  return {
    search,
    pagination,
    status,
    coupons,
    filterDialogState,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    updateSearch,
  };
};

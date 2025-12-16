'client';
import productData from '@/data/product';
import { IPaginationResponse } from '@/domain/model/response';
import { ProductSingleSKU } from '@/domain/model/product';
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

  const [categoryFilter, setCategoryFilter] = useQueryState(
    'category',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [products, setProducts] = useState<IPaginationResponse<ProductSingleSKU>>({
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

  const fetchProductData = useCallback(async () => {
    if (user) {
      setStatus(PageStatus.LOADING);
      try {
        const response = await productData.getProductsBySKU({
          limit: pageSize,
          page: currentPage,
          search,
          deletion: deletionFilter,
          categories: categoryFilter,
        });
        setProducts({
          data: response.data,
          meta: response.meta,
        });
        updateTotalItems(response.meta.total);
      } finally {
        setStatus(PageStatus.SUCCESS);
      }
    }
  }, [user, currentPage, pageSize, search, deletionFilter, categoryFilter, updateTotalItems]);

  const updateSearch = async (searchTerm: string) => {
    await setSearch(searchTerm);
    await handlePageChange(1);
  };

  const handleStatusFilterChange = async (statuses: string[]) => {
    await setDeletionFilter(statuses);
    await handlePageChange(1);
  };

  const handleCategoryFilterChange = async (categories: string[]) => {
    await setCategoryFilter(categories);
    await handlePageChange(1);
  };

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return {
    user,
    search,
    pagination,
    status,
    products,
    deletionFilter,
    categoryFilter,
    updatePage: handlePageChange,
    updateLimit: handleLimitChange,
    updateSearch,
    onStatusFilterChange: handleStatusFilterChange,
    onCategoryFilterChange: handleCategoryFilterChange,
  };
};

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export interface PaginationType {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const usePagination = (defaultPageSize = 10) => {
  const [page, setPage] = useQueryState<number>(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'push' }),
  );

  const [limit, setLimit] = useQueryState<number>(
    'limit',
    parseAsInteger.withDefault(defaultPageSize).withOptions({ history: 'push' }),
  );

  const safePage = page ?? 1;
  const safeLimit = limit ?? defaultPageSize;

  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: safePage,
    pageSize: safeLimit,
    totalItems: 0,
    totalPages: 1,
  });

  // Handle page changes
  const handlePageChange = useCallback(
    async (newPage: number) => {
      await setPage(newPage);
    },
    [setPage],
  );

  // Handle limit changes
  const handleLimitChange = useCallback(
    async (newLimit: number) => {
      await Promise.all([setLimit(newLimit), setPage(1)]);
    },
    [setLimit, setPage],
  );

  // Update total items
  const updateTotalItems = useCallback((total: number) => {
    setPagination((prev) => ({
      ...prev,
      totalItems: total,
      totalPages: Math.ceil(total / prev.pageSize),
    }));
  }, []);

  // Sync with URL params on mount and when they change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: safePage,
      pageSize: safeLimit,
      totalPages: Math.ceil(prev.totalItems / safeLimit),
    }));
  }, [safePage, safeLimit]);

  return {
    pagination,
    handlePageChange,
    handleLimitChange,
    updateTotalItems,
  };
};

export interface PaginationState {
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedProps {
  state: PaginationState;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function Paginated({ state, onPageChange, onLimitChange }: PaginatedProps) {
  const { totalItems, currentPage, pageSize } = state;
  const totalPages = Math.ceil(totalItems / pageSize);
  const pages: (number | string)[] = [];

  if (totalPages <= 4) {
    // If 4 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Show ellipsis if current page is not within first 3 pages
    if (currentPage > 3) {
      pages.push('...');
    }

    // Calculate start and end pages to show (max 2 pages around current)
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we're near the start or end
    if (currentPage <= 2) {
      endPage = 3;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 2;
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Show ellipsis if current page is not within last 2 pages
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);
  }

  const limitOptions = [10, 25, 50, 100];
  const startEntry = currentPage > 1 ? (currentPage - 1) * pageSize + 1 : 1;
  const endEntry = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-6 flex w-full flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="text-muted-foreground flex w-full shrink-0 items-center justify-center gap-2 text-sm md:w-max md:justify-start">
        {onLimitChange && (
          <select
            value={pageSize}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
            className="border-input bg-background h-8 rounded-md border px-2 py-1 text-sm"
          >
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        <span>
          Showing {startEntry} to {endEntry} of {totalItems} entries
        </span>
      </div>
      <Pagination className="flex w-full justify-center md:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={currentPage <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page !== currentPage) {
                      onPageChange(Number(page));
                    }
                  }}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={
                currentPage >= totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

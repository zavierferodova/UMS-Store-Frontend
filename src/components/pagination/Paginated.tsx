"use client"

import { PaginationMeta } from "@/domain/model/response"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export interface PaginatedProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export function Paginated({ meta, onPageChange, onLimitChange }: PaginatedProps) {
  const totalPages = Math.ceil(meta.total / meta.limit)
  const currentPage = meta.page
  const pages: (number | string)[] = []
  
  if (totalPages <= 4) {
    // If 4 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    // Show ellipsis if current page is not within first 3 pages
    if (currentPage > 3) {
      pages.push('...')
    }
    
    // Calculate start and end pages to show (max 2 pages around current)
    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)
    
    // Adjust if we're near the start or end
    if (currentPage <= 2) {
      endPage = 3
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 2
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i)
      }
    }
    
    // Show ellipsis if current page is not within last 2 pages
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }
    
    // Always show last page
    pages.push(totalPages)
  }
  
  const limitOptions = [10, 25, 50, 100]
  const startEntry = meta.page > 1 ? (meta.page - 1) * meta.limit + 1 : 1
  const endEntry = Math.min(meta.page * meta.limit, meta.total)

  return (
    <div className="flex flex-wrap justify-between gap-5 w-full mt-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {onLimitChange && (
          <select
            value={meta.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        <span>Showing {startEntry} to {endEntry} of {meta.total} entries</span>
      </div>
      <Pagination className="w-max mx-0">
        <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              if (meta.previous) {
                onPageChange(currentPage - 1)
              }
            }}
            className={!meta.previous ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          />
        </PaginationItem>
        
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page !== currentPage) {
                    onPageChange(Number(page))
                  }
                }}
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              if (meta.next) {
                onPageChange(currentPage + 1)
              }
            }}
            className={!meta.next ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          />
        </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

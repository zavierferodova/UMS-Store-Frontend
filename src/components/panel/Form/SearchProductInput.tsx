import { useState, useRef, useEffect, useCallback } from 'react';
import { SearchIcon, ExternalLink, Check } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import productData from '@/data/product';
import { ProductSingleSKU } from '@/domain/model/product';
import { IPaginationResponse } from '@/domain/model/response';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { panelRoutes } from '@/routes/route';
import Link from 'next/link';

export type SearchProductInputProps = {
  onProductSelect: (product: ProductSingleSKU) => void;
  className?: string;
  selectedProducts?: ProductSingleSKU[];
};

export function SearchProductInput({
  onProductSelect,
  className,
  selectedProducts = [],
}: SearchProductInputProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductSingleSKU[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<
    IPaginationResponse<ProductSingleSKU>['meta'] | null
  >(null);

  const fetchProducts = useCallback(
    async (newPage: number = 1, loadMore: boolean = false) => {
      setIsLoading(true);
      const response = await productData.getProductsBySKU({
        search,
        page: newPage,
        limit: 10,
      });
      setIsLoading(false);
      if (response) {
        if (loadMore) {
          setProducts((prev) => [...prev, ...response.data]);
        } else {
          setProducts(response.data);
        }
        setPagination(response.meta);
      }
    },
    [search],
  );

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchProducts(1, false);
      setPage(1);
    }
  }, [fetchProducts, open]);

  const handleProductSelect = (product: ProductSingleSKU) => {
    onProductSelect(product);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className={cn(
            'relative flex items-center cursor-pointer border border-input rounded-md shadow-xs hover:bg-accent/50 transition-colors',
            className,
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <div className="absolute left-3 pointer-events-none">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Cari produk untuk ditambahkan..."
            className="pl-9 cursor-pointer border-0 shadow-none focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        style={{ minWidth: triggerWidth }}
        className="p-0"
        onPointerDownOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.popover-content-ignore-close')) {
            e.preventDefault();
          }
        }}
      >
        <Command shouldFilter={false}>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              {isLoading ? 'Memuat produk...' : 'Tidak ada produk ditemukan.'}
            </CommandEmpty>
            <CommandGroup>
              {products.map((product) => {
                const isSelected = selectedProducts.some((p) => p.sku.sku === product.sku.sku);
                return (
                  <CommandItem
                    key={product.sku.sku}
                    value={product.sku.sku}
                    onSelect={() => handleProductSelect(product)}
                    className="cursor-pointer flex flex-col items-start gap-0 popover-content-ignore-close"
                  >
                    <div className="flex items-center w-full gap-2 pl-6 relative">
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary mr-1 absolute left-0 top-1/2 -translate-y-1/2" />
                      )}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate">{product.name}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {product.sku.sku}
                        </span>
                      </div>
                      <Link
                        href={panelRoutes.productEdit(product.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 p-1 rounded hover:bg-accent transition-colors self-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </CommandItem>
                );
              })}
              {pagination?.next && !isLoading && (
                <CommandItem
                  onSelect={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchProducts(nextPage, true);
                  }}
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="hover:underline">Lebih banyak</span>
                </CommandItem>
              )}
              {isLoading && page > 1 && (
                <CommandItem disabled className="opacity-50">
                  Memuat...
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

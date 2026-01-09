import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Check } from 'lucide-react';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from '@/components/ui/command';
import productData from '@/data/product';
import { ProductSingleSKU } from '@/domain/model/product';
import { IPaginationResponse } from '@/domain/model/response';
import { panelRoutes } from '@/routes/route';
import { Button } from '@/components/ui/button';
import { ImageIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';

export type SearchProductCommandProps = {
  open: boolean;
  selectedProducts?: ProductSingleSKU[];
  onOpenChange: (open: boolean) => void;
  onProductSelect: (product: ProductSingleSKU) => void;
  supplierId?: string;
};

export function SearchProductCommand({
  open,
  onOpenChange,
  onProductSelect,
  selectedProducts = [],
  supplierId,
}: SearchProductCommandProps) {
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
        supplier_id: supplierId,
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
    [search, supplierId],
  );

  useEffect(() => {
    if (open) {
      fetchProducts(1, false);
      setPage(1);
    }
  }, [fetchProducts, open]);

  const handleProductSelect = (product: ProductSingleSKU) => {
    onProductSelect(product);
    onOpenChange(false);
    setSearch('');
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
      <CommandInput
        placeholder="Cari produk berdasarkan nama atau SKU..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[400px]">
        {!isLoading && products.length === 0 && (
          <CommandEmpty>Tidak ada produk ditemukan.</CommandEmpty>
        )}
        {isLoading && <CommandEmpty>Memuat produk...</CommandEmpty>}
        <CommandGroup>
          {products.map((product) => {
            const isSelected = selectedProducts.some((p) => p.sku.sku === product.sku.sku);
            return (
              <CommandItem
                key={product.sku.sku}
                value={product.sku.sku}
                onSelect={() => handleProductSelect(product)}
                className="flex cursor-pointer flex-col items-start gap-0"
              >
                <div className="relative flex w-full items-center gap-2 pl-6">
                  {isSelected && (
                    <Check className="text-primary absolute top-1/2 left-0 mr-1 h-4 w-4 -translate-y-1/2" />
                  )}
                  <div className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].image}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="h-full w-full bg-gray-200 object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground flex h-full w-full items-center justify-center">
                        <ImageIcon size={20} />
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{product.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      SKU: {product.sku.sku} | Stock: {product.sku.stock}
                    </span>
                  </div>
                  <Link
                    href={panelRoutes.productEdit(product.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-accent ml-2 self-center rounded p-1 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </CommandItem>
            );
          })}
          {pagination?.next && !isLoading && (
            <div className="flex items-center justify-center p-2">
              <Button variant="ghost" size="sm" onClick={handleLoadMore} className="cursor-pointer">
                Muat lebih banyak
              </Button>
            </div>
          )}
          {isLoading && page > 1 && (
            <CommandItem disabled className="justify-center opacity-50">
              Memuat...
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

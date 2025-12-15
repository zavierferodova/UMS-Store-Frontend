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
                className="cursor-pointer flex flex-col items-start gap-0"
              >
                <div className="flex items-center w-full gap-2 pl-6 relative">
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary mr-1 absolute left-0 top-1/2 -translate-y-1/2" />
                  )}
                  <div className="w-10 h-10 shrink-0 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center mr-2">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].image}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="w-full h-full bg-gray-200 object-cover"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-muted-foreground">
                        <ImageIcon size={20} />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate">{product.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      SKU: {product.sku.sku} | Stock: {product.sku.stock}
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
            <div className="flex items-center justify-center p-2">
              <Button variant="ghost" size="sm" onClick={handleLoadMore} className="cursor-pointer">
                Muat lebih banyak
              </Button>
            </div>
          )}
          {isLoading && page > 1 && (
            <CommandItem disabled className="opacity-50 justify-center">
              Memuat...
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

import { ProductSingleSKU } from '@/domain/model/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, ShoppingCartIcon } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { SpinAnimation } from '@/components/animation/SpinAnimation';
import { EmptyDisplay } from '@/components/display/EmptyDisplay';
import { CartItem } from '../types';
import { useState } from 'react';
import { DialogImagePreview } from '@/components/panel/DialogImagePreview';
import Image from 'next/image';

interface ProductListProps {
  className?: string;
  search: string;
  loading: boolean;
  page: number;
  products: ProductSingleSKU[];
  hasMore: boolean;
  cart: CartItem[];
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
  onUpdateQuantity: (skuId: string, delta: number) => void;
  onAddToCart: (product: ProductSingleSKU) => void;
}

export function ProductList({
  className,
  search,
  loading,
  page,
  products,
  hasMore,
  cart,
  onSearchChange,
  onLoadMore,
  onUpdateQuantity,
  onAddToCart,
}: ProductListProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getQuantity = (skuId: string) => {
    return cart.find((item) => item.sku.id === skuId)?.amount || 0;
  };

  const handleQuantityChange = (product: ProductSingleSKU, delta: number) => {
    const currentQty = getQuantity(product.sku.id);
    if (currentQty === 0 && delta > 0) {
      onAddToCart(product);
    } else {
      onUpdateQuantity(product.sku.id, delta);
    }
  };

  const handleImageClick = (imageSrc: string) => {
    setPreviewImage(imageSrc);
    setIsPreviewOpen(true);
  };

  return (
    <div className={cn('flex h-full flex-1 flex-col space-y-6 overflow-hidden', className)}>
      <div className="bg-background flex w-full shrink-0 items-center space-x-2 rounded-2xl border px-4 py-1">
        <SearchIcon className="text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Cari produk ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-none text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto pr-2">
        {loading && page === 1 ? (
          <SpinAnimation />
        ) : products.length === 0 ? (
          <EmptyDisplay title="Tidak ada produk" description="Coba cari yang lain" />
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 pb-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              return (
                <div key={`${product.id}-${product.sku.id}`} className="group flex flex-col gap-2">
                  <div className="bg-muted relative aspect-4/3 w-full cursor-pointer overflow-hidden rounded-2xl">
                    <div className="absolute top-2 right-2 z-50 max-w-35 truncate rounded-2xl border bg-white px-3 py-1 text-sm">
                      {product.sku.sku}
                    </div>
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        onClick={() => handleImageClick(product.images[0].image)}
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full items-center justify-center">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="line-clamp-2 text-lg leading-tight font-bold text-gray-800">
                      {product.name}
                    </h3>
                    <div className="text-muted-foreground text-sm">
                      <div className="line-clamp-1 font-medium">
                        {product.category?.name || 'Tidak ada kategori'}
                      </div>
                      <div>Stok: {product.sku.stock}</div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-row items-center justify-between gap-3">
                    <span className="text-xl font-bold text-shadow-gray-700">
                      {formatCurrency(product.price)}
                    </span>
                    <Button
                      className="h-10 w-10 cursor-pointer rounded-full font-bold"
                      onClick={() => handleQuantityChange(product, 1)}
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasMore && !loading && (
          <div className="flex justify-center py-8">
            <Button
              variant="outline"
              onClick={onLoadMore}
              className="cursor-pointer rounded-full px-8"
            >
              Lebih banyak
            </Button>
          </div>
        )}
        {loading && page > 1 && <SpinAnimation />}
      </div>

      <DialogImagePreview
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        src={previewImage || ''}
      />
    </div>
  );
}

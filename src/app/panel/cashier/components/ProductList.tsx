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
    <div className={cn('flex-1 flex flex-col space-y-6 overflow-hidden h-full', className)}>
      <div className="flex items-center space-x-2 bg-background px-4 py-1 rounded-2xl border shrink-0 w-full">
        <SearchIcon className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari produk ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {loading && page === 1 ? (
          <SpinAnimation />
        ) : products.length === 0 ? (
          <EmptyDisplay title="Tidak ada produk" description="Coba cari yang lain" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 pb-8">
            {products.map((product) => {
              return (
                <div key={`${product.id}-${product.sku.id}`} className="flex flex-col gap-2 group">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted cursor-pointer">
                    <div className="absolute bg-white top-2 right-2 z-50 px-3 py-1 rounded-2xl text-sm max-w-[140px] truncate border">
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
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-800">
                      {product.name}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      <div className="font-medium line-clamp-1">
                        {product.category?.name || 'Tidak ada kategori'}
                      </div>
                      <div>Stok: {product.sku.stock}</div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center gap-3 mt-auto">
                    <span className="font-bold text-xl text-shadow-gray-700">
                      {formatCurrency(product.price)}
                    </span>
                    <Button
                      className="rounded-full w-10 h-10 font-bold cursor-pointer"
                      onClick={() => handleQuantityChange(product, 1)}
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
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
              className="rounded-full px-8 cursor-pointer"
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

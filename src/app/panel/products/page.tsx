'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Paginated } from '@/components/pagination/Paginated';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect, Suspense } from 'react';
import { panelRoutes } from '@/routes/route';
import { useController } from './controller';
import { PageStatus } from '@/lib/page';
import { EmptyDisplay } from '@/components/display/EmptyDisplay';
import { ProductsTable } from './components/ProductsTable';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { FilterDialog } from '@/app/panel/products/components/FilterDialog';
import { SpinAnimation } from '@/components/animation/SpinAnimation';

function ProductsPageContent() {
  const {
    search,
    status,
    products,
    deletionFilter,
    categoryFilter,
    pagination,
    updatePage,
    updateLimit,
    updateSearch,
    onStatusFilterChange,
    onCategoryFilterChange,
  } = useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && products.data.length == 0;
  const isLoading = status == PageStatus.LOADING;

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Produk',
        href: panelRoutes.products,
      },
    ]);
  }, [setMenu]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <CardTitle>Daftar Produk</CardTitle>
            <CardDescription>Daftar semua produk yang terdaftar di sistem</CardDescription>
          </div>
          <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Cari produk..."
                className="w-full pl-9 md:w-64"
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
              />
            </div>
            <FilterDialog
              statusFilter={deletionFilter}
              onStatusFilterChange={onStatusFilterChange}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={onCategoryFilterChange}
            />
            <Link href={panelRoutes.addProduct} className="w-full md:w-auto">
              <Button className="w-full cursor-pointer">
                <PlusIcon className="h-4 w-4" /> <span className="ml-1">Tambah</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <SpinAnimation /> : <ProductsTable products={products} />}
        {isEmpty && (
          <div className="mt-8 mb-8">
            <EmptyDisplay
              title="Kosong"
              description={
                search ? 'Tidak ada data yang ditemukan' : 'Belum ada produk yang terdaftar'
              }
            />
          </div>
        )}
        {!isLoading && !isEmpty && (
          <Paginated state={pagination} onPageChange={updatePage} onLimitChange={updateLimit} />
        )}
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageContent />
    </Suspense>
  );
}

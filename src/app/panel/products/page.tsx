'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Paginated } from '@/components/pagination/Paginated';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect } from 'react';
import { panelRoutes } from '@/routes/route';
import { useController } from './controller';
import { PageStatus } from '@/lib/page';
import { EmptyDisplay } from '@/components/display/EmptyDisplay';
import { ProductsTable } from './components/ProductsTable';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FilterDialog } from '@/app/panel/products/components/FilterDialog';
import { SpinAnimation } from '@/components/animation/SpinAnimation';

export default function ProductsPage() {
  const {
    search,
    status,
    products,
    statusFilter,
    categoryFilter,
    updatePage,
    updateLimit,
    updateSearch,
    onStatusFilterChange,
    onCategoryFilterChange,
  } = useController();
  const { setMenu } = usePanelHeader();
  const { data: session } = useSession();
  const isEmpty = status == PageStatus.SUCCESS && products.data.length == 0;
  const user = session?.user;

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
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Daftar Produk</CardTitle>
            <CardDescription>Daftar semua produk yang terdaftar di sistem</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                className="pl-9 w-full md:w-64"
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
              />
            </div>
            <FilterDialog
              statusFilter={statusFilter}
              onStatusFilterChange={onStatusFilterChange}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={onCategoryFilterChange}
            />
            <Link href={panelRoutes.addProduct} className="w-full md:w-auto">
              <Button className="cursor-pointer w-full">
                <PlusIcon className="h-4 w-4" /> <span className="ml-1">Tambah</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status == PageStatus.LOADING ? <SpinAnimation /> : <ProductsTable products={products} />}
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
        {!isEmpty && (
          <Paginated
            meta={products.meta}
            onPageChange={(page) => updatePage(page)}
            onLimitChange={(limit) => updateLimit(limit)}
          />
        )}
      </CardContent>
    </Card>
  );
}

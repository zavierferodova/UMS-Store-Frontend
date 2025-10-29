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
import { PurchaseOrdersTable } from './components/PurchaseOrdersTable';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { SpinAnimation } from '@/components/animation/SpinAnimation';
import { FilterDialog } from './components/FilterDialog';

export default function ProductsPage() {
  const {
    search,
    status,
    purchaseOrders,
    pagination,
    filterDialogState,
    updatePage,
    updateLimit,
    updateSearch,
  } = useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && purchaseOrders.data.length == 0;
  const isLoading = status == PageStatus.LOADING;

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Purchase Order',
        href: panelRoutes.purchaseOrders,
      },
    ]);
  }, [setMenu]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Daftar Purchase Order</CardTitle>
            <CardDescription>Daftar semua purchase order yang terdaftar di sistem</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari purchase order..."
                className="pl-9 w-full md:w-64"
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
              />
            </div>
            <FilterDialog state={filterDialogState} />
            <Link href="#" className="w-full md:w-auto">
              <Button className="cursor-pointer w-full">
                <PlusIcon className="h-4 w-4" /> <span className="ml-1">Tambah</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <SpinAnimation /> : <PurchaseOrdersTable purchaseOrders={purchaseOrders} />}
        {isEmpty && (
          <div className="mt-8 mb-8">
            <EmptyDisplay
              title="Kosong"
              description={
                search ? 'Tidak ada data yang ditemukan' : 'Belum ada purchase order yang terdaftar'
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

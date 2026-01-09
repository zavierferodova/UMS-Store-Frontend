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
import { PurchaseOrdersTable } from './components/PurchaseOrdersTable';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { SpinAnimation } from '@/components/animation/SpinAnimation';
import { FilterDialog } from './components/FilterDialog';
import { useSession } from 'next-auth/react';
import { isAdmin, isProcurement } from '@/lib/role';

function PurchaseOrdersPageContent() {
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
  const { data: session } = useSession();
  const { user } = session || {};

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
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <CardTitle>Daftar Purchase Order</CardTitle>
            <CardDescription>Daftar semua purchase order yang terdaftar di sistem</CardDescription>
          </div>
          <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Cari purchase order..."
                className="w-full pl-9 md:w-64"
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
              />
            </div>
            <FilterDialog state={filterDialogState} />
            {(isAdmin(user) || isProcurement(user)) && (
              <Link href={panelRoutes.addPurchaseOrder} className="w-full md:w-auto">
                <Button className="w-full cursor-pointer">
                  <PlusIcon className="h-4 w-4" /> <span className="ml-1">Tambah</span>
                </Button>
              </Link>
            )}
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

export default function ProductsPage() {
  return (
    <Suspense>
      <PurchaseOrdersPageContent />
    </Suspense>
  );
}

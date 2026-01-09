'use client';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Paginated } from '@/components/pagination/Paginated';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect, Suspense } from 'react';
import { panelRoutes } from '@/routes/route';
import { useController } from './controller';
import { PageStatus } from '@/lib/page';
import { formatCurrency, localeDateFormat } from '@/lib/utils';
import { Search } from 'lucide-react';
import { EmptyDisplay } from '@/components/display/EmptyDisplay';
import { SpinAnimation } from '@/components/animation/SpinAnimation';
import { FilterDialog } from './components/FilterDialog';
import { Badge } from '@/components/ui/badge';
import { CouponType } from '@/domain/model/coupon';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

function CouponsPageContent() {
  const {
    search,
    status,
    coupons,
    pagination,
    filterDialogState,
    updatePage,
    updateLimit,
    updateSearch,
  } = useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && coupons.data.length == 0;

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Kupon',
        href: panelRoutes.coupons,
      },
    ]);
  }, [setMenu]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <CardTitle>Daftar Kupon</CardTitle>
            <CardDescription>Daftar semua kupon yang tersedia</CardDescription>
          </div>
          <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                onChange={(e) => updateSearch(e.target.value)}
                value={search}
                placeholder="Cari kupon"
                className="w-full pl-10 md:w-64"
              />
            </div>
            <FilterDialog state={filterDialogState} />
            <Link href={panelRoutes.addCoupon}>
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4" /> Tambah
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status == PageStatus.LOADING ? (
          <SpinAnimation />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex justify-center">No</div>
                </TableHead>
                <TableHead className="whitespace-nowrap">Nama</TableHead>
                <TableHead className="whitespace-nowrap">Tipe</TableHead>
                <TableHead className="whitespace-nowrap">Nilai</TableHead>
                <TableHead className="whitespace-nowrap">Mulai</TableHead>
                <TableHead className="whitespace-nowrap">Selesai</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.data.map((coupon, index) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex justify-center">
                      {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Link
                      className="font-medium hover:underline"
                      href={panelRoutes.editCoupon(coupon.id)}
                    >
                      {coupon.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coupon.type === CouponType.voucher ? 'Voucher' : 'Diskon'}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {coupon.type === CouponType.voucher
                      ? formatCurrency(coupon.voucher_value || 0)
                      : `${coupon.discount_percentage}%`}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {localeDateFormat(coupon.start_time)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {localeDateFormat(coupon.end_time)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.disabled ? 'destructive' : 'default'}>
                      {coupon.disabled ? 'Nonaktif' : 'Aktif'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {isEmpty && (
          <EmptyDisplay
            title="Tidak ada kupon"
            description="Belum ada kupon yang dibuat atau tidak ditemukan hasil pencarian."
          />
        )}

        <div className="mt-4">
          <Paginated
            state={{
              currentPage: pagination.currentPage,
              totalItems: pagination.totalItems,
              pageSize: pagination.pageSize,
            }}
            onPageChange={updatePage}
            onLimitChange={updateLimit}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function CouponsPage() {
  return (
    <Suspense>
      <CouponsPageContent />
    </Suspense>
  );
}

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
import { Paginated } from '@/components/pagination/Paginated';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect } from 'react';
import { panelRoutes } from '@/routes/route';
import { useController } from './controller';
import { PageStatus } from '@/lib/page';
import { formatCurrency, localeDateFormat } from '@/lib/utils';
import { EmptyDisplay } from '@/components/display/EmptyDisplay';
import { SpinAnimation } from '@/components/animation/SpinAnimation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterDialog } from './components/FilterDialog';

function BookTransactionsPageContent() {
  const {
    status,
    cashierBooks,
    pagination,
    search,
    filterDialogState,
    updateSearch,
    updatePage,
    updateLimit,
  } = useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && cashierBooks.data.length == 0;

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Buku Transaksi',
        href: panelRoutes.bookTransactions,
      },
    ]);
  }, [setMenu]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle>Buku Transaksi</CardTitle>
              <CardDescription>Daftar riwayat buka tutup kasir</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={(e) => updateSearch(e.target.value)}
                  value={search || ''}
                  placeholder="Cari buku kasir"
                  className="pl-10 w-full md:w-64"
                />
              </div>
              <FilterDialog state={filterDialogState} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {status === PageStatus.LOADING ? (
            <SpinAnimation />
          ) : isEmpty ? (
            <EmptyDisplay
              title="Tidak ada data"
              description="Belum ada riwayat buka tutup kasir."
            />
          ) : (
            <div className="flex flex-col gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Kasir</TableHead>
                    <TableHead>Modal Awal</TableHead>
                    <TableHead>Waktu Buka</TableHead>
                    <TableHead>Waktu Tutup</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashierBooks.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Link
                          href={panelRoutes.bookTransactionDetail(item.id)}
                          className="font-medium hover:underline"
                        >
                          {item.code}
                        </Link>
                      </TableCell>
                      <TableCell>{item.cashier.name}</TableCell>
                      <TableCell>{formatCurrency(item.cash_drawer)}</TableCell>
                      <TableCell>{localeDateFormat(item.time_open)}</TableCell>
                      <TableCell>
                        {item.time_closed ? localeDateFormat(item.time_closed) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.time_closed ? 'secondary' : 'default'}>
                          {item.time_closed ? 'Tutup' : 'Buka'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookTransactionsPage() {
  return <BookTransactionsPageContent />;
}

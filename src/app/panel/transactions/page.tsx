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
import Link from 'next/link';

function TransactionsPageContent() {
  const {
    search,
    status,
    transactions,
    pagination,
    filterDialogState,
    updatePage,
    updateLimit,
    updateSearch,
  } = useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && transactions.data.length == 0;

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Transaksi',
        href: panelRoutes.transactions,
      },
    ]);
  }, [setMenu]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <CardTitle>Daftar Transaksi</CardTitle>
            <CardDescription>Daftar semua transaksi yang tercatat di sistem</CardDescription>
          </div>
          <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                onChange={(e) => updateSearch(e.target.value)}
                value={search}
                placeholder="Cari transaksi"
                className="w-full pl-10 md:w-64"
              />
            </div>
            <FilterDialog state={filterDialogState} />
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
                <TableHead>Kode</TableHead>
                <TableHead>Kasir</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead>Dibayar</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Diupdate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.data.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex justify-center">{index + 1}</div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={panelRoutes.transactionDetail(transaction.id)}
                      className="font-medium hover:underline"
                    >
                      {transaction.code}
                    </Link>
                  </TableCell>
                  <TableCell>{transaction.cashier?.name || '-'}</TableCell>
                  <TableCell>{formatCurrency(transaction.total)}</TableCell>
                  <TableCell className="capitalize">{transaction?.payment || '-'}</TableCell>
                  <TableCell>
                    {transaction.paid_time ? localeDateFormat(transaction.paid_time) : '-'}
                  </TableCell>
                  <TableCell>{localeDateFormat(transaction.created_at)}</TableCell>
                  <TableCell>{localeDateFormat(transaction.updated_at)}</TableCell>
                  <TableCell>{transaction.is_saved ? 'Disimpan' : 'Dibayar'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {isEmpty && (
          <div className="mt-8 mb-8">
            <EmptyDisplay
              title="Kosong"
              description={
                search ? 'Tidak ada data yang ditemukan' : 'Belum ada transaksi yang tercatat'
              }
            />
          </div>
        )}
        {!isEmpty && (
          <Paginated
            state={pagination}
            onPageChange={(page) => updatePage(page)}
            onLimitChange={(limit) => updateLimit(limit)}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense>
      <TransactionsPageContent />
    </Suspense>
  );
}

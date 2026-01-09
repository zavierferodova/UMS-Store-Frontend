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
import { Banknote, CreditCard, Percent, Search, Ticket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterDialog } from './components/FilterDialog';
import Link from 'next/link';

function BookTransactionDetailPageContent() {
  const {
    status,
    transactions,
    pagination,
    cashierBook,
    cashierBookStats,
    search,
    updateSearch,
    filterDialogState,
    updatePage,
    updateLimit,
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
        name: 'Buku Transaksi',
        href: panelRoutes.bookTransactions,
      },
      {
        name: 'Detail',
        href: '#',
      },
    ]);
  }, [setMenu]);

  return (
    <div className="flex flex-col gap-4">
      {cashierBook && cashierBookStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tunai</CardTitle>
              <Banknote className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(cashierBookStats.cash.value)}
              </div>
              <p className="text-muted-foreground text-xs">
                {cashierBookStats.cash.count} transaksi
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non Tunai</CardTitle>
              <CreditCard className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(cashierBookStats.cashless.value)}
              </div>
              <p className="text-muted-foreground text-xs">
                {cashierBookStats.cashless.count} transaksi
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diskon</CardTitle>
              <Percent className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(cashierBookStats.discount.value)}
              </div>
              <p className="text-muted-foreground text-xs">
                {cashierBookStats.discount.count} transaksi
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voucher</CardTitle>
              <Ticket className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(cashierBookStats.voucher.value)}
              </div>
              <p className="text-muted-foreground text-xs">
                {cashierBookStats.voucher.count} transaksi
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Detail Buku Transaksi {cashierBook ? `(${cashierBook.code})` : ''}
              </CardTitle>
              <CardDescription>Daftar transaksi pada buku kasir ini</CardDescription>
            </div>
            {cashierBook && (
              <div className="flex w-full flex-col justify-end gap-2 md:w-auto md:flex-row">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    onChange={(e) => updateSearch(e.target.value)}
                    value={search || ''}
                    placeholder="Cari transaksi"
                    className="w-full pl-10 md:w-64"
                  />
                </div>
                <FilterDialog state={filterDialogState} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {status === PageStatus.LOADING ? (
            <SpinAnimation />
          ) : isEmpty ? (
            <EmptyDisplay
              title="Tidak ada data"
              description="Belum ada transaksi pada buku kasir ini."
            />
          ) : (
            <div className="flex flex-col gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex justify-center">No</div>
                    </TableHead>
                    <TableHead>Kode</TableHead>
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
                        <div className="flex justify-center">
                          {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={panelRoutes.transactionDetail(transaction.id)}
                          className="font-medium hover:underline"
                        >
                          {transaction.code}
                        </Link>
                      </TableCell>
                      <TableCell>{formatCurrency(transaction.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.payment === 'cash'
                            ? 'Tunai'
                            : transaction.payment === 'cashless'
                              ? 'Non-Tunai'
                              : '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.paid_time ? localeDateFormat(transaction.paid_time) : '-'}
                      </TableCell>
                      <TableCell>{localeDateFormat(transaction.created_at)}</TableCell>
                      <TableCell>{localeDateFormat(transaction.updated_at)}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.is_saved ? 'secondary' : 'default'}>
                          {transaction.is_saved ? 'Disimpan' : 'Dibayar'}
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

export default function BookTransactionDetailPage() {
  return <BookTransactionDetailPageContent />;
}

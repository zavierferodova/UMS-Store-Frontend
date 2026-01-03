'use client';
import { usePanelHeader } from '@/components/panel/Header';
import { panelRoutes } from '@/routes/route';
import { useEffect } from 'react';
import { Transaction } from '@/domain/model/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, localeDateFormat } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, CreditCard, FileText, Printer, ShieldCheck, Ticket } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { MiniReceipt } from '@/components/panel/receipt/MiniReceipt';
import { RegularReceipt } from '@/components/panel/receipt/RegularReceipt';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Store } from '@/domain/model/store';

export type TransactionDetailContainerProps = {
  transaction: Transaction;
  store: Store;
};

export function TransactionDetailContainer({
  transaction,
  store,
}: TransactionDetailContainerProps) {
  const { setMenu } = usePanelHeader();
  const miniReceiptRef = useRef<HTMLDivElement>(null);
  const regularReceiptRef = useRef<HTMLDivElement>(null);

  const handlePrintMini = useReactToPrint({
    contentRef: miniReceiptRef,
  });

  const handlePrintRegular = useReactToPrint({
    contentRef: regularReceiptRef,
  });

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
      {
        name: 'Detail',
        href: '',
      },
    ]);
  }, [setMenu]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Detail Transaksi</h2>
        {transaction.is_saved === false && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Cetak
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => handlePrintMini()}>
                  Printer Mini (Thermal)
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handlePrintRegular()}>
                  Printer Biasa (A4)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="hidden">
        <div ref={miniReceiptRef}>
          <MiniReceipt transaction={transaction} store={store} />
        </div>
        <div ref={regularReceiptRef}>
          <RegularReceipt transaction={transaction} store={store} />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Kode Transaksi</p>
                <p className="font-medium">{transaction.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">
                  {transaction.is_saved ? 'Disimpan' : 'Dibayar'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Kasir</p>
                <p className="font-medium">{transaction.cashier?.name || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
                <p className="font-medium capitalize">{transaction.payment || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Waktu Pembayaran</p>
                <p className="font-medium">
                  {transaction.paid_time ? localeDateFormat(transaction.paid_time) : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Waktu Dibuat</p>
                <p className="font-medium">{localeDateFormat(transaction.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Waktu Diupdate</p>
                <p className="font-medium">{localeDateFormat(transaction.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.sku_code}</div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell className="text-center">{item.amount}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unit_price * item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {transaction.coupons && transaction.coupons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Kupon Digunakan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kupon</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-right">Potongan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction.coupons.map((coupon, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-muted-foreground" />
                          {coupon.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {coupon.code.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {coupon.type === 'voucher' ? 'Voucher' : 'Diskon'}
                      </TableCell>
                      <TableCell className="text-right">
                        {coupon.type === 'voucher'
                          ? formatCurrency(coupon.voucher_value || 0)
                          : `(${coupon.discount_percentage}%) ${formatCurrency(
                              (transaction.sub_total * (coupon.discount_percentage || 0)) / 100,
                            )}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Card className="w-full md:w-1/3">
            <CardContent>
              {transaction.note && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <FileText className="h-4 w-4" /> Catatan
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{transaction.note}</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(transaction.sub_total)}</span>
                </div>
                {transaction.discount_total !== null && transaction.discount_total > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Diskon</span>
                    <span>-{formatCurrency(transaction.discount_total)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(transaction.total)}</span>
                </div>
                {transaction.pay !== null && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bayar</span>
                      <span>{formatCurrency(transaction.pay)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kembali</span>
                      <span>{formatCurrency(transaction.pay - transaction.total)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

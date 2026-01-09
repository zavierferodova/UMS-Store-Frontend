import { CartItem } from '../types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  MinusIcon,
  PlusIcon,
  BanknoteIcon,
  SaveIcon,
  FolderOpen,
  XIcon,
  TicketIcon,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Transaction, TransactionPayment } from '@/domain/model/transaction';
import { CheckCouponCodeUsageResponse } from '@/domain/data/coupon';
import { useState } from 'react';
import { PaymentDialog } from './PaymentDialog';
import { SavedTransactionsDialog } from './SavedTransactionsDialog';
import { CouponsDialog } from './CouponsDialog';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CartProps {
  className?: string;
  cart: CartItem[];
  subTotal: number;
  total: number;
  discountTotal: number;
  remainingDiscount?: number;
  savedTransactions: Transaction[];
  savedTransactionsLoading: boolean;
  currentTransactionCode: string | null;
  coupons: CheckCouponCodeUsageResponse[];
  couponLoading: boolean;
  onUpdateQuantity: (skuId: string, delta: number) => void;
  onSaveTransaction: () => void;
  onConfirmPayment: (method: TransactionPayment, payAmount: number, note: string) => void;
  onRestoreTransaction: (transaction: Transaction) => void;
  onFetchSavedTransactions: () => void;
  onClearTransaction: () => void;
  checkCoupon: (code: string) => void;
  removeCoupon: (code: string) => void;
}

export function Cart({
  className,
  cart,
  subTotal,
  total,
  discountTotal,
  remainingDiscount = 0,
  savedTransactions,
  savedTransactionsLoading,
  currentTransactionCode,
  coupons,
  couponLoading,
  onUpdateQuantity,
  onSaveTransaction,
  onConfirmPayment,
  onRestoreTransaction,
  onFetchSavedTransactions,
  onClearTransaction,
  checkCoupon,
  removeCoupon,
}: CartProps) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSavedTransactionsDialogOpen, setIsSavedTransactionsDialogOpen] = useState(false);
  const [isCouponsDialogOpen, setIsCouponsDialogOpen] = useState(false);
  const [isNoCouponConfirmDialogOpen, setIsNoCouponConfirmDialogOpen] = useState(false);

  return (
    <>
      <div
        className={cn('bg-background flex h-full flex-col overflow-hidden rounded-2xl', className)}
      >
        <div className="flex items-center justify-between border-b p-6 pb-4">
          <div>
            <h2 className="text-2xl font-bold">Keranjang</h2>
            <p className="text-muted-foreground mt-1 text-sm">{cart.length} item dipilih</p>
          </div>
          <div className="flex gap-2">
            {currentTransactionCode && (
              <Button
                variant="outline"
                size="icon"
                onClick={onClearTransaction}
                title="Clear Transaction"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => setIsSavedTransactionsDialogOpen(true)}
              title="Transaksi Tersimpan"
            >
              <FolderOpen className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {currentTransactionCode && (
          <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-6 py-2 text-sm text-blue-700">
            <span>
              Transaksi Tersimpan:{' '}
              <span className="font-mono font-bold">{currentTransactionCode}</span>
            </span>
          </div>
        )}

        <ScrollArea className="flex-1 space-y-6 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-muted-foreground flex h-40 flex-col items-center justify-center space-y-2">
              <div className="bg-muted rounded-full p-4">
                <BanknoteIcon className="h-6 w-6 opacity-50" />
              </div>
              <p>Belum ada pesanan</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.sku.id} className="flex gap-4">
                  <div className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0].image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div className="flex justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm leading-tight font-semibold">
                        {item.name}
                      </h3>
                      <span className="text-sm font-bold whitespace-nowrap">
                        {formatCurrency(item.price * item.amount)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-muted-foreground text-xs">{formatCurrency(item.price)}</p>
                      <div className="bg-muted/50 flex items-center gap-1 rounded-full p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-pointer rounded-full"
                          onClick={() => onUpdateQuantity(item.sku.id, -1)}
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={item.amount}
                          onChange={(e) => {
                            const newAmount = Math.max(
                              1,
                              Math.min(999, parseInt(e.target.value) || 1),
                            );
                            const delta = newAmount - item.amount;
                            onUpdateQuantity(item.sku.id, delta);
                          }}
                          className="w-12 border-none bg-transparent text-center text-sm font-medium outline-none"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-pointer rounded-full"
                          onClick={() => {
                            if (item.amount < 999) {
                              onUpdateQuantity(item.sku.id, 1);
                            }
                          }}
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="bg-muted/30 space-y-6 border-t p-6">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full cursor-pointer justify-between"
              onClick={() => setIsCouponsDialogOpen(true)}
            >
              <div className="flex items-center gap-2">
                <TicketIcon className="h-4 w-4" />
                <span>Kupon</span>
              </div>
              {coupons.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {coupons.length} Terpakai
                </Badge>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(subTotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon</span>
                <span className="font-medium">-{formatCurrency(discountTotal)}</span>
              </div>
            )}
            {remainingDiscount > 0 && (
              <div className="flex justify-between text-sm text-orange-600">
                <span>Sisa Diskon</span>
                <span className="font-medium">{formatCurrency(remainingDiscount)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex items-end justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary h-12 flex-1 cursor-pointer rounded-xl text-lg font-bold"
              size="lg"
              onClick={onSaveTransaction}
              disabled={cart.length === 0}
            >
              <SaveIcon className="h-5 w-5" />
            </Button>
            <Button
              className="shadow-primary/20 h-12 flex-4 cursor-pointer rounded-xl text-lg font-bold shadow-lg"
              size="lg"
              onClick={() => {
                if (coupons.length === 0) {
                  setIsNoCouponConfirmDialogOpen(true);
                } else {
                  setIsPaymentDialogOpen(true);
                }
              }}
              disabled={cart.length === 0}
            >
              Bayar
            </Button>
          </div>
        </div>
      </div>

      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        total={total}
        onConfirm={(method, amount, note) => {
          onConfirmPayment(method, amount, note);
          setIsPaymentDialogOpen(false);
        }}
      />
      <SavedTransactionsDialog
        open={isSavedTransactionsDialogOpen}
        onOpenChange={setIsSavedTransactionsDialogOpen}
        transactions={savedTransactions}
        loading={savedTransactionsLoading}
        onRestore={onRestoreTransaction}
        onRefresh={onFetchSavedTransactions}
      />
      <CouponsDialog
        open={isCouponsDialogOpen}
        onOpenChange={setIsCouponsDialogOpen}
        coupons={coupons}
        loading={couponLoading}
        onCheckCoupon={checkCoupon}
        onRemoveCoupon={removeCoupon}
        subTotal={subTotal}
      />
      <AlertDialog open={isNoCouponConfirmDialogOpen} onOpenChange={setIsNoCouponConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi ini tidak menggunakan kupon. Apakah Anda yakin ingin melanjutkan ke
              pembayaran?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => {
                setIsNoCouponConfirmDialogOpen(false);
                setIsPaymentDialogOpen(true);
              }}
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

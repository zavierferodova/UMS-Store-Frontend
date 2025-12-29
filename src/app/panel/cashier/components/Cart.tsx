import { CartItem } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  MinusIcon,
  PlusIcon,
  BanknoteIcon,
  SaveIcon,
  FolderOpen,
  XIcon,
  Loader2,
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

interface CartProps {
  className?: string;
  cart: CartItem[];
  subTotal: number;
  total: number;
  discountTotal: number;
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
  const [couponCode, setCouponCode] = useState('');

  return (
    <>
      <div
        className={cn('flex flex-col h-full bg-background rounded-2xl overflow-hidden', className)}
      >
        <div className="p-6 pb-4 border-b flex justify-between items-center">
          <div>
            <h2 className="font-bold text-2xl">Keranjang</h2>
            <p className="text-muted-foreground text-sm mt-1">{cart.length} item dipilih</p>
          </div>
          <div className="flex gap-2">
            {currentTransactionCode && (
              <Button
                variant="outline"
                size="icon"
                onClick={onClearTransaction}
                title="Clear Transaction"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <XIcon className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => setIsSavedTransactionsDialogOpen(true)}
              title="Transaksi Tersimpan"
            >
              <FolderOpen className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {currentTransactionCode && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 text-blue-700 text-sm flex items-center justify-between">
            <span>
              Transaksi Tersimpan:{' '}
              <span className="font-mono font-bold">{currentTransactionCode}</span>
            </span>
          </div>
        )}

        <ScrollArea className="flex-1 p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2">
              <div className="p-4 bg-muted rounded-full">
                <BanknoteIcon className="w-6 h-6 opacity-50" />
              </div>
              <p>Belum ada pesanan</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.sku.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0].image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-semibold line-clamp-2 text-sm leading-tight">
                        {item.name}
                      </h3>
                      <span className="font-bold text-sm whitespace-nowrap">
                        {formatCurrency(item.price * item.amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
                      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full cursor-pointer"
                          onClick={() => onUpdateQuantity(item.sku.id, -1)}
                        >
                          <MinusIcon className="w-3 h-3" />
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
                          className="text-sm font-medium w-12 text-center bg-transparent border-none outline-none"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full cursor-pointer"
                          onClick={() => {
                            if (item.amount < 999) {
                              onUpdateQuantity(item.sku.id, 1);
                            }
                          }}
                        >
                          <PlusIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-6 bg-muted/30 space-y-6 border-t">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Kode Kupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponLoading}
                className="bg-background"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && couponCode && !couponLoading) {
                    checkCoupon(couponCode);
                    setCouponCode('');
                  }
                }}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  checkCoupon(couponCode);
                  setCouponCode('');
                }}
                disabled={!couponCode || couponLoading}
              >
                {couponLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <TicketIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
            {coupons.length > 0 && (
              <div className="space-y-1">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code.code}
                    className="text-xs text-green-600 font-medium flex items-center justify-between bg-green-50 p-2 rounded-md border border-green-100"
                  >
                    <div className="flex items-center gap-1">
                      <TicketIcon className="w-3 h-3" />
                      <span>
                        {coupon.name} ({coupon.code.code})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-green-700 hover:text-green-800 hover:bg-green-100"
                      onClick={() => removeCoupon(coupon.code.code)}
                    >
                      <XIcon className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
            <Separator className="my-2" />
            <div className="flex justify-between items-end">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-12 text-lg font-bold rounded-xl border-primary text-primary hover:bg-primary/10 hover:text-primary cursor-pointer"
              size="lg"
              onClick={onSaveTransaction}
              disabled={cart.length === 0}
            >
              <SaveIcon className="w-5 h-5" />
            </Button>
            <Button
              className="flex-4 h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 cursor-pointer"
              size="lg"
              onClick={() => setIsPaymentDialogOpen(true)}
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
    </>
  );
}

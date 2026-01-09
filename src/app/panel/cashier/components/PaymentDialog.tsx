import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionPayment } from '@/domain/model/transaction';
import { formatCurrency } from '@/lib/utils';
import { BanknoteIcon, CreditCardIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onConfirm: (method: TransactionPayment, payAmount: number, note: string) => void;
}

export function PaymentDialog({ open, onOpenChange, total, onConfirm }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<TransactionPayment>(TransactionPayment.CASH);
  const [payAmount, setPayAmount] = useState<number>(total);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (open) {
      setPayAmount(total);
      setCustomAmount('');
      setNote('');
      setPaymentMethod(TransactionPayment.CASH);
    }
  }, [open, total]);

  const handleCustomAmountChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    setCustomAmount(numericValue);
    setPayAmount(Number(numericValue));
  };

  const getPayRecommendation = (initial: number): number[] => {
    const denominations = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
    const suggestions = new Map<number, number>();

    denominations.forEach((denom) => {
      const remainder = initial % denom;
      if (remainder !== 0) {
        const suggestion = initial + (denom - remainder);
        // Keep the largest denomination for this suggestion
        const currentDenom = suggestions.get(suggestion) || 0;
        if (denom > currentDenom) {
          suggestions.set(suggestion, denom);
        }
      }
    });

    const results = Array.from(suggestions.entries()).map(([amount, denom]) => ({
      amount,
      denom,
    }));

    // Filter out "inferior" suggestions:
    // A suggestion is inferior if there exists another suggestion that is
    // smaller in amount BUT uses a larger or equal denomination.
    // (Paying less with larger bills is always better/preferred).
    const filtered = results.filter((item) => {
      const isInferior = results.some(
        (other) => other.amount < item.amount && other.denom >= item.denom,
      );
      if (isInferior) return false;

      // Filter out awkward 20k multiples (e.g. 40k, 60k, 160k) unless they are very close
      // or also multiples of 50k.
      if (
        item.denom === 20000 &&
        item.amount > 20000 &&
        item.amount % 50000 !== 0 &&
        item.amount - initial > 10000
      ) {
        return false;
      }

      return true;
    });

    return filtered.map((item) => item.amount).sort((a, b) => a - b);
  };

  const recommendations = getPayRecommendation(total);

  const uniqueSuggestedAmounts = Array.from(new Set([total, ...recommendations])).sort(
    (a, b) => a - b,
  );

  const finalOptions = uniqueSuggestedAmounts;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-150">
        <DialogHeader className="shrink-0 border-b p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <div className="space-y-3">
            <label className="text-muted-foreground text-sm font-medium">Tipe Pembayaran</label>
            <Tabs
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as TransactionPayment)}
              className="w-full"
            >
              <TabsList className="bg-muted/50 grid h-12 w-full grid-cols-2 p-1">
                <TabsTrigger
                  value={TransactionPayment.CASH}
                  className="cursor-pointer rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <BanknoteIcon className="mr-2 h-4 w-4" />
                  Tunai
                </TabsTrigger>
                <TabsTrigger
                  value={TransactionPayment.CASHLESS}
                  className="cursor-pointer rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  Non-Tunai
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            <label className="text-muted-foreground text-sm font-medium">Opsi Nominal</label>

            <div className="animate-in fade-in slide-in-from-top-2 mt-2">
              <Input
                autoFocus
                className="h-14 text-center text-lg font-medium"
                placeholder="Masukkan nominal"
                value={customAmount ? Number(customAmount).toLocaleString('id-ID') : ''}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {finalOptions.map((amount) => (
                <Button
                  key={amount}
                  variant={payAmount === amount ? 'default' : 'outline'}
                  className={`h-16 cursor-pointer text-lg font-medium ${
                    payAmount === amount
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background hover:bg-muted'
                  }`}
                  onClick={() => {
                    setPayAmount(amount);
                    setCustomAmount(amount.toString());
                  }}
                >
                  {amount === total ? 'Uang Pas' : formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            {TransactionPayment.CASHLESS === paymentMethod && (
              <div className="space-y-2">
                <label className="text-muted-foreground text-sm font-medium">
                  Catatan (Opsional)
                </label>
                <Textarea
                  placeholder="Tambahkan catatan transaksi..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-2 resize-none"
                />
              </div>
            )}
            <div className="flex items-end justify-between pt-2">
              <span className="text-lg font-bold">TOTAL</span>
              <span className="text-primary text-3xl font-bold">{formatCurrency(total)}</span>
            </div>
            {payAmount < total && (
              <p className="text-destructive text-right text-sm font-medium">
                Nominal pembayaran kurang
              </p>
            )}
            {payAmount >= total && (
              <div className="text-muted-foreground flex items-center justify-between">
                <span className="text-sm">Kembalian</span>
                <span className="font-medium">{formatCurrency(payAmount - total)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/30 shrink-0 border-t p-6">
          <Button
            className="shadow-primary/20 h-14 w-full cursor-pointer rounded-xl text-xl font-bold shadow-lg"
            size="lg"
            onClick={() => onConfirm(paymentMethod, payAmount, note)}
            disabled={payAmount < total}
          >
            Bayar Sekarang
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

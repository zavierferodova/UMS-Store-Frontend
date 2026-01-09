import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/domain/model/transaction';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SavedTransactionsDialogProps {
  open: boolean;
  transactions: Transaction[];
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore: (transaction: Transaction) => void;
  onRefresh: () => void;
}

export function SavedTransactionsDialog({
  open,
  transactions,
  loading,
  onOpenChange,
  onRestore,
  onRefresh,
}: SavedTransactionsDialogProps) {
  useEffect(() => {
    if (open) {
      onRefresh();
    }
  }, [open, onRefresh]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaksi Tersimpan</DialogTitle>
        </DialogHeader>

        <div className="mb-2 flex justify-end">
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <ScrollArea className="max-h-[60vh]">
          {loading && transactions.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              Tidak ada transaksi tersimpan.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-2 px-1 pb-4">
              {transactions.map((transaction) => (
                <AccordionItem
                  key={transaction.id}
                  value={transaction.id}
                  className="rounded-lg border!"
                >
                  <AccordionTrigger className="cursor-pointer px-4 py-4 hover:no-underline">
                    <div className="flex w-full flex-col items-start space-y-1 text-left">
                      <div className="flex w-full justify-between pr-4">
                        <p className="font-medium">
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                        <p className="font-bold">{formatCurrency(transaction.total)}</p>
                      </div>
                      <p className="text-muted-foreground text-sm font-normal">
                        {transaction.items.length} items
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 px-4 pt-2 pb-4">
                      <div className="bg-muted/30 space-y-2 rounded-md p-3">
                        {transaction.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.amount}x <span className="text-foreground">{item.name}</span>
                            </span>
                            <span>{formatCurrency(item.unit_price * item.amount)}</span>
                          </div>
                        ))}
                        {transaction.coupons && transaction.coupons.length > 0 && (
                          <div className="mt-2 border-t border-dashed border-gray-300 pt-2">
                            {transaction.coupons.map((coupon, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm text-green-600"
                              >
                                <span>
                                  Kupon: {coupon.name} ({coupon.code})
                                </span>
                                <span>-{formatCurrency(coupon.amount)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button
                          size="sm"
                          className="w-full cursor-pointer sm:w-auto"
                          onClick={() => {
                            onRestore(transaction);
                            onOpenChange(false);
                          }}
                        >
                          Restore
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

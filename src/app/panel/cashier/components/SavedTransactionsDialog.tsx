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

        <div className="flex justify-end mb-2">
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <ScrollArea className="max-h-[60vh]">
          {loading && transactions.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Tidak ada transaksi tersimpan.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-2 px-1 pb-4">
              {transactions.map((transaction) => (
                <AccordionItem
                  key={transaction.id}
                  value={transaction.id}
                  className="border! rounded-lg"
                >
                  <AccordionTrigger className="hover:no-underline py-4 px-4 cursor-pointer">
                    <div className="flex flex-col items-start text-left space-y-1 w-full">
                      <div className="flex justify-between w-full pr-4">
                        <p className="font-medium">
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                        <p className="font-bold">{formatCurrency(transaction.total)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground font-normal">
                        {transaction.items.length} items
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 pb-4 space-y-4 px-4">
                      <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                        {transaction.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.amount}x <span className="text-foreground">{item.name}</span>
                            </span>
                            <span>{formatCurrency(item.unit_price * item.amount)}</span>
                          </div>
                        ))}
                        {transaction.coupons && transaction.coupons.length > 0 && (
                          <div className="border-t border-dashed border-gray-300 pt-2 mt-2">
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
                          className="w-full sm:w-auto cursor-pointer"
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

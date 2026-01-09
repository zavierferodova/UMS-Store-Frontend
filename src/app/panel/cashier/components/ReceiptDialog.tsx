import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Transaction } from '@/domain/model/transaction';
import { Printer } from 'lucide-react';
import { MiniReceipt } from '@/components/panel/receipt/MiniReceipt';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { Store } from '@/domain/model/store';

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  store: Store;
}

export function ReceiptDialog({ open, onOpenChange, transaction, store }: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: 'Print Receipt',
    pageStyle: `
      @page { size: 58mm auto; margin: 0; }
      body { margin: 0; padding: 0; }
    `,
  });

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaksi Berhasil</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[60vh] justify-center overflow-hidden overflow-y-auto rounded-lg bg-gray-100 p-4">
          <div ref={receiptRef}>
            <MiniReceipt transaction={transaction} store={store} />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
          <Button onClick={handlePrint} className="cursor-pointer">
            <Printer className="mr-2 h-4 w-4" />
            Cetak Struk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

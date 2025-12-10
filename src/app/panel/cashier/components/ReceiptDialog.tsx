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

        <div className="flex justify-center p-4 bg-gray-100 rounded-lg overflow-hidden max-h-[60vh] overflow-y-auto">
          <div ref={receiptRef}>
            <MiniReceipt transaction={transaction} store={store} />
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
          <Button onClick={handlePrint} className="cursor-pointer">
            <Printer className="w-4 h-4 mr-2" />
            Cetak Struk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RejectionMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionMessage: string;
}

export function RejectionMessageDialog({
  open,
  onOpenChange,
  rejectionMessage,
}: RejectionMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Order Ditolak</DialogTitle>
          <DialogDescription>
            Purchase order ini telah ditolak. Mohon cek kembali dengan alasan berikut:
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertDescription>
            <p className="whitespace-pre-wrap">{rejectionMessage}</p>
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="cursor-pointer">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

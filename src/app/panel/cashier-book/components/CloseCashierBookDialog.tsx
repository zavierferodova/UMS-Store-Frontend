'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { LockIcon } from 'lucide-react';
import { toast } from 'sonner';

type CloseCashierBookDialogProps = {
  onCloseAction: () => Promise<void>;
};

export function CloseCashierBookDialog({ onCloseAction }: CloseCashierBookDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    try {
      await onCloseAction();
      setOpen(false);
      toast.success('Berhasil menutup buku kasir');
    } catch {
      toast.error('Gagal menutup buku kasir');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="destructive">
          <LockIcon className="mr-2 h-4 w-4" />
          Tutup Kasir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Tutup Buku Kasir</DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menutup buku kasir? Pastikan semua transaksi sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="cursor-pointer" variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button className="cursor-pointer" variant="destructive" onClick={onSubmit}>
            Tutup Kasir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export type ConfirmationType = 'save' | 'cancel' | 'reject' | 'approve' | null;

interface ConfirmationDialogProps {
  open: boolean;
  type: ConfirmationType;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (rejectionReason?: string) => void;
}

const dialogConfig = {
  save: {
    title: 'Kirim Purchase Order',
    description:
      'Apakah Anda yakin ingin mengirim purchase order ini? Setelah dikirim, purchase order akan menunggu persetujuan admin dan tidak dapat diedit kembali.',
    confirmText: 'Ya, Kirim',
    confirmVariant: 'default' as const,
  },
  cancel: {
    title: 'Batalkan Purchase Order',
    description:
      'Apakah Anda yakin ingin membatalkan purchase order ini? Purchase order yang dibatalkan tidak dapat dikembalikan.',
    confirmText: 'Ya, Batalkan',
    confirmVariant: 'destructive' as const,
  },
  reject: {
    title: 'Tolak Purchase Order',
    description: 'Apakah Anda yakin ingin menolak purchase order ini?',
    confirmText: 'Ya, Tolak',
    confirmVariant: 'destructive' as const,
  },
  approve: {
    title: 'Setujui Purchase Order',
    description:
      'Apakah Anda yakin ingin menyetujui purchase order ini? Purchase order yang disetujui tidak dapat diubah kembali dan hanya dapat di-return atau diselesaikan.',
    confirmText: 'Ya, Setujui',
    confirmVariant: 'default' as const,
  },
  complete: {
    title: 'Selesaikan Purchase Order',
    description:
      'Apakah Anda yakin ingin menyelesaikan purchase order ini? Purchase order yang diselesaikan tidak dapat diubah kembali.',
    confirmText: 'Ya, Selesaikan',
    confirmVariant: 'default' as const,
  },
};

export function ConfirmationDialog({
  open,
  type,
  isLoading = false,
  onOpenChange,
  onConfirm,
}: ConfirmationDialogProps) {
  const [rejectionReason, setRejectionReason] = useState('');

  if (!type) return null;

  const config = dialogConfig[type];
  const isRejection = type === 'reject';
  const isConfirmDisabled = isLoading || (isRejection && rejectionReason.trim().length === 0);

  const handleConfirm = () => {
    if (isRejection) {
      onConfirm(rejectionReason);
    } else {
      onConfirm();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setRejectionReason('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {isRejection && (
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">
              Alasan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Masukkan alasan..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value.slice(0, 255))}
              maxLength={255}
              rows={4}
              className="resize-none"
            />
            <p className="text-muted-foreground text-sm">{rejectionReason.length}/255 karakter</p>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="cursor-pointer">
              Batal
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={config.confirmVariant}
            onClick={handleConfirm}
            className="cursor-pointer"
            disabled={isConfirmDisabled}
          >
            {isLoading ? 'Memproses...' : config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

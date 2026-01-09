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
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  cash_drawer: z.coerce.number().gt(0, 'Modal awal harus lebih dari 0'),
});

type OpenCashierBookDialogProps = {
  onOpenAction: (cash_drawer: number) => Promise<void>;
};

export function OpenCashierBookDialog({ onOpenAction }: OpenCashierBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [cashDrawerDisplay, setCashDrawerDisplay] = useState('');
  const form = useForm<z.input<typeof formSchema>, undefined, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cash_drawer: 0,
    },
  });

  const onSubmit = async (values: z.output<typeof formSchema>) => {
    try {
      await onOpenAction(values.cash_drawer);
      setOpen(false);
      form.reset();
      setCashDrawerDisplay('');
      toast.success('Berhasil membuka buku kasir');
    } catch {
      toast.error('Gagal membuka buku kasir');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setCashDrawerDisplay('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon className="h-4 w-4" />
          Buka Kasir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Buka Buku Kasir</DialogTitle>
          <DialogDescription>Masukkan modal awal untuk membuka buku kasir baru.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cash_drawer"
              render={({}) => (
                <FormItem>
                  <FormLabel>Modal Awal</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={cashDrawerDisplay}
                      onChange={(e) => {
                        const num = parseInt(e.target.value.replace(/[^\d]/g, '')) || 0;
                        setCashDrawerDisplay(formatCurrency(num));
                        form.setValue('cash_drawer', num);
                      }}
                      placeholder="Rp 0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className="cursor-pointer" type="submit">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SlidersHorizontalIcon } from '@phosphor-icons/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { Input } from '@/components/ui/input';

type FilterOption = {
  value: string;
  label: string;
};

const transactionStatusOptions: FilterOption[] = [
  { value: 'saved', label: 'Disimpan' },
  { value: 'done', label: 'Selesai' },
];

const paymentMethodOptions: FilterOption[] = [
  { value: 'cash', label: 'Tunai' },
  { value: 'cashless', label: 'Non-Tunai' },
];

type FilterDialogState = {
  startDate: string | null;
  setStartDate: (value: string | null) => void;
  endDate: string | null;
  setEndDate: (value: string | null) => void;
  transactionStatus: string[];
  setTransactionStatus: (value: string[]) => void;
  paymentMethod: string[];
  setPaymentMethod: (value: string[]) => void;
};

type FilterDialogProps = {
  state: FilterDialogState;
};

export const useFilterDialog = () => {
  const [startDate, setStartDate] = useQueryState(
    'start_date',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [endDate, setEndDate] = useQueryState(
    'end_date',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [transactionStatus, setTransactionStatus] = useQueryState(
    'transaction_status',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [paymentMethod, setPaymentMethod] = useQueryState(
    'payment_method',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const state = {
    startDate: startDate || null,
    endDate: endDate || null,
    transactionStatus,
    paymentMethod,
    setStartDate: (val: string | null) => setStartDate(val || null),
    setEndDate: (val: string | null) => setEndDate(val || null),
    setTransactionStatus,
    setPaymentMethod,
  };

  return {
    state,
  };
};

export function FilterDialog({ state }: FilterDialogProps) {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    transactionStatus,
    setTransactionStatus,
    paymentMethod,
    setPaymentMethod,
  } = state;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 cursor-pointer">
          <SlidersHorizontalIcon className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Filter Transaksi</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Tanggal Minimum</div>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate || ''}
                  onChange={(e) => setStartDate(e.target.value || null)}
                  className="block"
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Tanggal Maksimum</div>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate || ''}
                  onChange={(e) => setEndDate(e.target.value || null)}
                  className="block"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Metode Pembayaran</div>
            <div className="space-y-2">
              {paymentMethodOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`payment-${option.value}`}
                    checked={paymentMethod.includes(option.value)}
                    className="cursor-pointer"
                    onCheckedChange={(checked) => {
                      const newPayment = checked
                        ? [...paymentMethod, option.value]
                        : paymentMethod.filter((item) => item !== option.value);
                      setPaymentMethod(newPayment);
                    }}
                  />
                  <Label htmlFor={`payment-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Status Transaksi</div>
            <div className="space-y-2">
              {transactionStatusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={transactionStatus.includes(option.value)}
                    className="cursor-pointer"
                    onCheckedChange={(checked) => {
                      const newStatus = checked
                        ? [...transactionStatus, option.value]
                        : transactionStatus.filter((item) => item !== option.value);
                      setTransactionStatus(newStatus);
                    }}
                  />
                  <Label htmlFor={`status-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

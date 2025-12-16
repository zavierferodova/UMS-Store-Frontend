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
import { useSession } from 'next-auth/react';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { PurchaseOrderStatus } from '@/domain/model/purchase-order';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CheckIcon, ChevronsUpDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

type FilterOption = {
  value: string;
  label: string;
};

const payoutOptions: FilterOption[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'partnership', label: 'Partnership' },
];

const purchaseOrderStatusOptions: FilterOption[] = [
  { value: PurchaseOrderStatus.DRAFT, label: 'Draft' },
  { value: PurchaseOrderStatus.WAITING_APPROVAL, label: 'Waiting Approval' },
  { value: PurchaseOrderStatus.CANCELLED, label: 'Cancelled' },
  { value: PurchaseOrderStatus.APPROVED, label: 'Approved' },
  { value: PurchaseOrderStatus.REJECTED, label: 'Rejected' },
  { value: PurchaseOrderStatus.COMPLETED, label: 'Completed' },
];

type FilterDialogState = {
  payout: string[];
  setPayout: (value: string[]) => void;
  purchaseOrderStatus: string[];
  setPurchaseOrderStatus: (value: string[]) => void;
};

type FilterDialogProps = {
  state: FilterDialogState;
};

export const useFilterDialog = () => {
  const [payout, setPayout] = useQueryState(
    'payout',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [purchaseOrderStatus, setPurchaseOrderStatus] = useQueryState(
    'purchaseOrderStatus',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const state = {
    payout,
    purchaseOrderStatus,
    setPayout,
    setPurchaseOrderStatus,
  };

  return {
    state,
  };
};

export function FilterDialog({ state }: FilterDialogProps) {
  const { payout, setPayout, purchaseOrderStatus, setPurchaseOrderStatus } = state;
  const [openStatusSelect, setOpenStatusSelect] = useState(false);

  const handleStatusToggle = (statusValue: string) => {
    const newStatus = purchaseOrderStatus.includes(statusValue)
      ? purchaseOrderStatus.filter((item) => item !== statusValue)
      : [...purchaseOrderStatus, statusValue];
    setPurchaseOrderStatus(newStatus);
  };

  const handleStatusRemove = (statusValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPurchaseOrderStatus(purchaseOrderStatus.filter((item) => item !== statusValue));
  };

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
          <DialogTitle>Filter Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Status Purchase Order</div>
            <Popover open={openStatusSelect} onOpenChange={setOpenStatusSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openStatusSelect}
                  className="w-full justify-between font-normal cursor-pointer h-auto min-h-9 hover:bg-white"
                >
                  <div className="flex flex-wrap gap-1 flex-1 min-w-0 max-h-20 overflow-y-auto py-1">
                    {purchaseOrderStatus.length === 0 ? (
                      <span className="text-muted-foreground">Pilih status...</span>
                    ) : (
                      purchaseOrderStatus.map((statusValue) => {
                        const option = purchaseOrderStatusOptions.find(
                          (opt) => opt.value === statusValue,
                        );
                        return (
                          <Badge
                            key={statusValue}
                            variant="secondary"
                            className="gap-1 pr-1 cursor-pointer"
                          >
                            <span>{option?.label}</span>
                            <span
                              onClick={(e) => handleStatusRemove(statusValue, e)}
                              className="hover:bg-muted rounded-sm p-0.5 cursor-pointer"
                            >
                              <X className="h-3 w-3" />
                            </span>
                          </Badge>
                        );
                      })
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandEmpty>Status tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {purchaseOrderStatusOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleStatusToggle(option.value)}
                          className="cursor-pointer"
                        >
                          {purchaseOrderStatus.includes(option.value) ? (
                            <CheckIcon className="mr-1 h-4 w-4 text-green-500" />
                          ) : (
                            <span className="mr-1 h-4 w-4 inline-block" />
                          )}
                          <span>{option.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Status Pembayaran</div>
            <div className="space-y-2">
              {payoutOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`payout-${option.value}`}
                    checked={payout.includes(option.value)}
                    className="cursor-pointer"
                    onCheckedChange={(checked) => {
                      const newPayout = checked
                        ? [...payout, option.value]
                        : payout.filter((item) => item !== option.value);
                      setPayout(newPayout);
                    }}
                  />
                  <Label htmlFor={`payout-${option.value}`} className="cursor-pointer">
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

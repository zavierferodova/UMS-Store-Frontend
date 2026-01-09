'use client';

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
import { SelectUserSearch } from '@/components/panel/form/SelectUserSearch';
import { User, UserRole } from '@/domain/model/user';
import userData from '@/data/user';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type FilterOption = {
  value: string;
  label: string;
};

const statusOptions: FilterOption[] = [
  { value: 'open', label: 'Buka' },
  { value: 'closed', label: 'Tutup' },
];

type FilterDialogState = {
  timeOpen: string | null;
  setTimeOpen: (value: string | null) => void;
  timeClosed: string | null;
  setTimeClosed: (value: string | null) => void;
  status: string[];
  setStatus: (value: string[]) => void;
  cashierId: string | null;
  setCashierId: (value: string | null) => void;
};

type FilterDialogProps = {
  state: FilterDialogState;
};

export const useFilterDialog = () => {
  const [timeOpen, setTimeOpen] = useQueryState(
    'time_open',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [timeClosed, setTimeClosed] = useQueryState(
    'time_closed',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [status, setStatus] = useQueryState(
    'status',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [cashierId, setCashierId] = useQueryState(
    'cashier_id',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const state = {
    timeOpen: timeOpen || null,
    timeClosed: timeClosed || null,
    status,
    cashierId: cashierId || null,
    setTimeOpen: (val: string | null) => setTimeOpen(val || null),
    setTimeClosed: (val: string | null) => setTimeClosed(val || null),
    setStatus,
    setCashierId: (val: string | null) => setCashierId(val || null),
  };

  return {
    state,
  };
};

export function FilterDialog({ state }: FilterDialogProps) {
  const {
    timeOpen,
    setTimeOpen,
    timeClosed,
    setTimeClosed,
    status,
    setStatus,
    cashierId,
    setCashierId,
  } = state;

  const { data: session } = useSession();
  const [selectedCashier, setSelectedCashier] = useState<User | null>(null);

  useEffect(() => {
    const fetchCashier = async () => {
      if (cashierId) {
        const user = await userData.getUser(cashierId);
        setSelectedCashier(user);
      } else {
        setSelectedCashier(null);
      }
    };
    fetchCashier();
  }, [cashierId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer gap-2">
          <SlidersHorizontalIcon className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Filter Buku Kasir</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Waktu Buka</div>
                <Input
                  id="time-open"
                  type="datetime-local"
                  value={timeOpen || ''}
                  onChange={(e) => setTimeOpen(e.target.value || null)}
                  className="block"
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Waktu Tutup</div>
                <Input
                  id="time-closed"
                  type="datetime-local"
                  value={timeClosed || ''}
                  onChange={(e) => setTimeClosed(e.target.value || null)}
                  className="block"
                />
              </div>
            </div>
          </div>

          {session?.user?.role === UserRole.ADMIN && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Kasir</div>
              <SelectUserSearch
                value={selectedCashier}
                onChange={(user) => setCashierId(user?.id || null)}
                roles={[UserRole.CASHIER]}
                placeholder="Pilih kasir..."
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium">Status</div>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={status.includes(option.value)}
                    className="cursor-pointer"
                    onCheckedChange={(checked) => {
                      const newStatus = checked
                        ? [...status, option.value]
                        : status.filter((item) => item !== option.value);
                      setStatus(newStatus);
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

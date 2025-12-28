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
import { CouponType } from '@/domain/model/coupon';

type FilterOption = {
  value: string;
  label: string;
};

const couponTypeOptions: FilterOption[] = [
  { value: CouponType.voucher, label: 'Voucher' },
  { value: CouponType.discount, label: 'Diskon' },
];

const statusOptions: FilterOption[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'disabled', label: 'Nonaktif' },
];

type FilterDialogState = {
  startTime: string | null;
  setStartTime: (value: string | null) => void;
  endTime: string | null;
  setEndTime: (value: string | null) => void;
  type: string[];
  setType: (value: string[]) => void;
  isDisabled: string[];
  setIsDisabled: (value: string[]) => void;
};

type FilterDialogProps = {
  state: FilterDialogState;
};

export const useFilterDialog = () => {
  const [startTime, setStartTime] = useQueryState(
    'start_time',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [endTime, setEndTime] = useQueryState(
    'end_time',
    parseAsString.withDefault('').withOptions({ history: 'push' }),
  );

  const [type, setType] = useQueryState(
    'type',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [isDisabled, setIsDisabled] = useQueryState(
    'disabled',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const state = {
    startTime: startTime || null,
    endTime: endTime || null,
    type,
    isDisabled,
    setStartTime: (val: string | null) => setStartTime(val || null),
    setEndTime: (val: string | null) => setEndTime(val || null),
    setType,
    setIsDisabled,
  };

  return {
    state,
  };
};

export function FilterDialog({ state }: FilterDialogProps) {
  const { startTime, setStartTime, endTime, setEndTime, type, setType, isDisabled, setIsDisabled } =
    state;

  const handleTypeChange = (value: string) => {
    if (type.includes(value)) {
      setType(type.filter((item) => item !== value));
    } else {
      setType([...type, value]);
    }
  };

  const handleIsDisabledChange = (value: string) => {
    if (isDisabled.includes(value)) {
      setIsDisabled(isDisabled.filter((item) => item !== value));
    } else {
      setIsDisabled([...isDisabled, value]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          <SlidersHorizontalIcon className="h-4 w-4" /> Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Kupon</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="grid gap-1.5 flex-1">
                <Label htmlFor="start_time" className="mb-1">
                  Tanggal Mulai
                </Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={startTime || ''}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5 flex-1">
                <Label htmlFor="end_time" className="mb-1">
                  Tanggal Selesai
                </Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={endTime || ''}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="mb-1">Tipe Kupon</Label>
            <div className="flex flex-col gap-2">
              {couponTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${option.value}`}
                    checked={type.includes(option.value)}
                    onCheckedChange={() => handleTypeChange(option.value)}
                    className="cursor-pointer"
                  />
                  <Label htmlFor={`type-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="mb-1">Status</Label>
            <div className="flex flex-col gap-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={isDisabled.includes(option.value)}
                    onCheckedChange={() => handleIsDisabledChange(option.value)}
                    className="cursor-pointer"
                  />
                  <Label htmlFor={`status-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

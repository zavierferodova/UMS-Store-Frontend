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
import { isAdmin } from '@/lib/role';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';

type FilterOption = {
  value: string;
  label: string;
};

const draftOptions: FilterOption[] = [
  { value: 'true', label: 'Draft' },
  { value: 'false', label: 'Bukan Draft' },
];

const completedOptions: FilterOption[] = [
  { value: 'true', label: 'Selesai' },
  { value: 'false', label: 'Belum Selesai' },
];

const payoutOptions: FilterOption[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'partnership', label: 'Partnership' },
];

const statusOptions: FilterOption[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'deleted', label: 'Dihapus' },
];

type FilterDialogState = {
  draft: string[];
  setDraft: (value: string[]) => void;
  completed: string[];
  setCompleted: (value: string[]) => void;
  payout: string[];
  setPayout: (value: string[]) => void;
  status: string[];
  setStatus: (value: string[]) => void;
};

type FilterDialogProps = {
  state: FilterDialogState;
};

export const useFilterDialog = () => {
  const [draft, setDraft] = useQueryState(
    'draft',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [completed, setCompleted] = useQueryState(
    'completed',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [payout, setPayout] = useQueryState(
    'payout',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const [status, setStatus] = useQueryState(
    'status',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push' }),
  );

  const state = {
    draft,
    completed,
    payout,
    status,
    setDraft,
    setCompleted,
    setPayout,
    setStatus,
  };

  return {
    state,
  };
};

export function FilterDialog({ state }: FilterDialogProps) {
  const { draft, setDraft, completed, setCompleted, payout, setPayout, status, setStatus } = state;
  const { data: session } = useSession();
  const user = session?.user;

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
            <div className="text-sm font-medium">Draft</div>
            <div className="space-y-2">
              {draftOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`draft-${option.value}`}
                    checked={draft.includes(option.value)}
                    className="cursor-pointer"
                    onCheckedChange={(checked) => {
                      const newDraft = checked
                        ? [...draft, option.value]
                        : draft.filter((item) => item !== option.value);
                      setDraft(newDraft);
                    }}
                  />
                  <Label htmlFor={`draft-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Status Penyelesaian</div>
            <div className="space-y-2">
              {completedOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`completed-${option.value}`}
                    checked={completed.includes(option.value)}
                    className="cursor-pointer"
                    onCheckedChange={(checked) => {
                      const newCompleted = checked
                        ? [...completed, option.value]
                        : completed.filter((item) => item !== option.value);
                      setCompleted(newCompleted);
                    }}
                  />
                  <Label htmlFor={`completed-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
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

          {isAdmin(user) && (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

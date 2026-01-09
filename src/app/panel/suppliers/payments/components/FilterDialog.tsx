import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { SelectSupplierSearch } from '@/components/panel/form/SelectSupplierSearch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import { isAdmin } from '@/lib/role';
import { Supplier } from '@/domain/model/supplier';

type StatusOption = {
  value: string;
  label: string;
};

const statusOptions: StatusOption[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'deleted', label: 'Dihapus' },
];

type FilterDialogProps = {
  statusFilter: string[];
  onStatusFilterChange: (value: string[]) => void;
  selectedSupplier: Supplier | null;
  onSupplierFilterChange: (value: string) => void;
};

export function FilterDialog({
  statusFilter,
  onStatusFilterChange,
  selectedSupplier,
  onSupplierFilterChange,
}: FilterDialogProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked
      ? [...statusFilter, status]
      : statusFilter.filter((s) => s !== status);
    onStatusFilterChange(newStatus);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Metode Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Supplier</div>
            <SelectSupplierSearch
              value={selectedSupplier}
              onChange={(supplier) => onSupplierFilterChange(supplier?.id ?? '')}
            />
          </div>

          {isAdmin(user) && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Penghapusan</div>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={statusFilter.includes(option.value)}
                      className="cursor-pointer"
                      onCheckedChange={(checked) =>
                        handleStatusChange(option.value, checked as boolean)
                      }
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

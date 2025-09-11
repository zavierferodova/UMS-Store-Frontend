import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";
import { CategorySelect } from "../../../../components/panel/Form/CategorySelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/role";

type StatusOption = {
  value: string;
  label: string;
};

const statusOptions: StatusOption[] = [
  { value: "active", label: "Aktif" },
  { value: "deleted", label: "Dihapus" },
];

type FilterDialogProps = {
  statusFilter: string[];
  onStatusFilterChange: (value: string[]) => void;
  categoryFilter: string[];
  onCategoryFilterChange: (value: string[]) => void;
};

export function FilterDialog({
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
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
        <Button variant="outline" className="gap-2 cursor-pointer">
          <SlidersHorizontalIcon className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Filter Produk</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {isAdmin(user) && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Status</div>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={statusFilter.includes(option.value)}
                      className="cursor-pointer"
                      onCheckedChange={(checked) =>
                        handleStatusChange(option.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`status-${option.value}`}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium">Kategori</div>
            <CategorySelect
              value={categoryFilter}
              onChange={onCategoryFilterChange}
              placeholder="Pilih kategori..."
              className="w-full max-w-[375px]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

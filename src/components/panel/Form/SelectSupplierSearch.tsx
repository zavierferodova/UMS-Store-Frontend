import { useState, useRef, useEffect, useCallback } from 'react';
import { CheckIcon, ChevronsUpDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import supplierData from '@/data/supplier';
import { IPaginationResponse } from '@/domain/model/response';
import { Supplier } from '@/domain/model/supplier';
import Link from 'next/link';
import { panelRoutes } from '@/routes/route';

export type SelectSupplierSearchProps = {
  value: Supplier | null;
  onChange: (supplier: Supplier | null) => void;
  error?: boolean;
  disabled?: boolean;
};

export function SelectSupplierSearch({
  value,
  onChange,
  error,
  disabled,
}: SelectSupplierSearchProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<IPaginationResponse<Supplier>['meta'] | null>(null);

  const fetchSuppliers = useCallback(
    async (newPage: number = 1, loadMore: boolean = false) => {
      setIsLoading(true);
      const response = await supplierData.getSuppliers({
        search,
        page: newPage,
        limit: 10,
      });
      setIsLoading(false);
      if (response) {
        const newSuppliers = response.data;
        if (loadMore) {
          setSuppliers((prev) => [...prev, ...newSuppliers]);
        } else {
          setSuppliers(newSuppliers);
        }
        setPagination(response.meta);
      }
    },
    [search],
  );

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  useEffect(() => {
    fetchSuppliers(1, false);
    setPage(1);
  }, [fetchSuppliers]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full font-normal  justify-between cursor-pointer text-muted-foreground hover:text-muted-foreground hover:bg-accent',
            value && 'text-foreground hover:text-foreground',
            error && 'border-destructive text-destructive',
          )}
        >
          {(() => {
            if (!value) return 'Pilih supplier...';
            const selected = suppliers.find((supplier) => supplier.id === value.id);
            if (!selected) return value.name;
            return selected.code ? `${selected.name}  (${selected.code})` : selected.name;
          })()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ minWidth: triggerWidth }} className="p-0">
        <Command shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Cari supplier..." />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>{isLoading ? 'Memuat...' : 'Tidak ada supplier ditemukan.'}</CommandEmpty>
            <CommandGroup>
              {suppliers.map((supplier) => (
                <CommandItem
                  key={supplier.id}
                  value={supplier.id}
                  onSelect={() => {
                    onChange(value && value.id === supplier.id ? null : supplier);
                    setOpen(false);
                  }}
                  className="cursor-pointer flex flex-col items-start gap-0"
                >
                  <div className="flex items-center w-full gap-2 pl-6 relative">
                    {value && value.id === supplier.id && (
                      <CheckIcon className="w-4 h-4 text-primary mr-1 absolute left-0 top-1/2 -translate-y-1/2" />
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{supplier.name}</span>
                      {supplier.code && (
                        <span className="text-xs text-muted-foreground truncate">
                          {supplier.code}
                        </span>
                      )}
                    </div>
                    <Link
                      href={supplier.id ? panelRoutes.supplierEdit(supplier.id) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 p-1 rounded hover:bg-accent transition-colors self-center hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </CommandItem>
              ))}
              {pagination?.next && !isLoading && (
                <CommandItem
                  onSelect={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchSuppliers(nextPage, true);
                  }}
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="hover:underline">Lebih banyak</span>
                </CommandItem>
              )}
              {isLoading && page > 1 && (
                <CommandItem disabled className="opacity-50">
                  Memuat...
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

import { useState, useEffect, useCallback } from "react";
import { CheckIcon, CaretUpDownIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import productData from "@/data/product";
import { IPaginationResponse } from "@/domain/model/response";
import { ProductCategory } from "@/domain/model/product";

export type Category = {
  value: string;
  label: string;
};

export type ProductCategorySelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function ProductCategorySelect({
  value = [],
  onChange,
  placeholder = "Pilih kategori...",
  className,
  disabled = false,
}: ProductCategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<IPaginationResponse<ProductCategory>["meta"] | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchCategories = useCallback(
    async (newPage: number = 1, loadMore: boolean = false) => {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      
      try {
        const response = await productData.getCategories({
          search,
          page: newPage,
          limit: 10,
        });

        if (response) {
          const newCategories = response.data.map((category) => ({
            value: category.id,
            label: category.name,
          }));

          if (loadMore) {
            setCategories((prev) => [...prev, ...newCategories]);
          } else {
            setCategories(newCategories);
          }
          setPagination(response.meta);
          setPage(newPage);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [search]
  );

  useEffect(() => {
    fetchCategories(1, false);
  }, [fetchCategories]);

  const handleSearch = (search: string) => {
    setSearch(search);
    setPage(1);
  };

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(newValue);
  };

  const displayValue = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const selected = categories.find((cat) => cat.value === value[0]);
      return selected?.label || placeholder;
    }
    return `${value.length} kategori terpilih`;
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal overflow-hidden cursor-pointer",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate block w-full">{displayValue()}</span>
          <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start" sideOffset={4} collisionPadding={16}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari kategori..."
            onValueChange={handleSearch}
            value={search}
          />
          <CommandList className="max-h-[250px] overflow-y-auto">
            <CommandEmpty>
              {isLoading ? "Memuat..." : "Tidak ada kategori ditemukan"}
            </CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={() => handleSelect(category.value)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-[0.2rem] border border-primary",
                        value.includes(category.value)
                          ? "bg-primary text-white"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="flex-1">{category.label}</span>
                  </div>
                </CommandItem>
              ))}
              {pagination?.next && (
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-xs text-muted-foreground cursor-pointer"
                    onClick={() => fetchCategories(page + 1, true)}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? 'Memuat...' : 'Muat Lebih'}
                  </Button>
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ProductCategorySelect;

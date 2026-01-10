import { useState, useRef, useEffect, useCallback } from 'react';
import {
  CheckIcon,
  CaretUpDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSimpleIcon,
  TrashIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import productData from '@/data/product';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IPaginationResponse } from '@/domain/model/response';
import { useSession } from 'next-auth/react';
import { ProductCategory } from '@/domain/model/product';

export type Category = {
  value: string;
  label: string;
};

export type SelectProductCategoryProps = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  defaultLabel?: string;
};

export function SelectProductCategory({
  value,
  onChange,
  error,
  defaultLabel,
}: SelectProductCategoryProps) {
  const { data: session } = useSession();
  const isEditable = session?.user.role?.includes('admin') || session?.user.role?.includes('staff');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToEditLabel, setCategoryToEditLabel] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<IPaginationResponse<ProductCategory>['meta'] | null>(
    null,
  );

  const fetchCategories = useCallback(
    async (newPage: number = 1, loadMore: boolean = false) => {
      setIsLoading(true);
      const response = await productData.getCategories({
        search,
        page: newPage,
      });
      setIsLoading(false);
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
      }
    },
    [search],
  );

  const handleAddCategory = async () => {
    setIsAddingCategory(false);
    setNewCategory('');

    const trimedNewCategory = newCategory.trim();
    if (trimedNewCategory) {
      const promise = new Promise((resolve, reject) => {
        productData.createCategory(trimedNewCategory).then((data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error('Gagal menambahkan kategori'));
          }
        });
      });

      toast.promise(promise, {
        loading: 'Sedang menambahkan kategori...',
        success: () => {
          fetchCategories(1, false);
          setPage(1);
          return 'Kategori berhasil ditambahkan!';
        },
        error: 'Gagal menambahkan kategori!',
      });
    }
  };

  const handleEditCategory = (id: string, oldLabel: string) => {
    const newLabel = categoryToEditLabel.trim();
    setCategoryToEdit(null);
    setCategoryToEditLabel('');

    if (newLabel && newLabel !== oldLabel) {
      const promise = new Promise((resolve, reject) => {
        productData.updateCategory(id, newLabel).then((data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error('Gagal mengubah kategori'));
          }
        });
      });

      toast.promise(promise, {
        loading: 'Sedang mengubah kategori...',
        success: () => {
          fetchCategories(1, false);
          setPage(1);
          return 'Kategori berhasil diubah!';
        },
        error: 'Gagal mengubah kategori!',
      });
    }
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      const response = productData.deleteCategory(categoryToDelete.value);
      toast.promise(response, {
        loading: 'Sedang menghapus kategori...',
        success: () => {
          fetchCategories(1, false);
          setPage(1);
          return 'Kategori berhasil dihapus!';
        },
        error: 'Gagal menghapus kategori!',
      });
      setCategoryToDelete(null);
    }
  };

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  useEffect(() => {
    fetchCategories(1, false);
    setPage(1);
  }, [fetchCategories]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full cursor-pointer justify-between',
              error && 'border-destructive text-destructive',
            )}
          >
            {value
              ? categories.find((category) => category.value === value)?.label || defaultLabel
              : 'Pilih kategori...'}
            <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent style={{ minWidth: triggerWidth }} className="p-0">
          <Command shouldFilter={false}>
            <CommandInput value={search} onValueChange={setSearch} placeholder="Cari kategori..." />
            <CommandGroup>
              {isEditable && (
                <CommandItem
                  onSelect={() => {
                    setIsAddingCategory(true);
                  }}
                  className="flex cursor-pointer items-center justify-between gap-2"
                >
                  {isAddingCategory ? (
                    <>
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        maxLength={128}
                        placeholder="Nama kategori baru"
                        className="h-8"
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-pointer"
                          onClick={handleAddCategory}
                        >
                          <CheckCircleIcon className="h-4 w-4 cursor-pointer text-green-500" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-pointer hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAddingCategory(false);
                          }}
                        >
                          <XCircleIcon className="h-4 w-4 text-red-500 hover:text-red-600" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <PlusIcon className="h-4 w-4" />
                      <span>Buat kategori baru</span>
                    </div>
                  )}
                </CommandItem>
              )}
            </CommandGroup>
            <CommandGroup>
              <CommandList className="max-h-[250px] overflow-y-auto">
                {isLoading && (
                  <CommandItem disabled className="opacity-50">
                    Loading...
                  </CommandItem>
                )}

                {!isLoading && categories.length === 0 && search && (
                  <CommandItem disabled className="opacity-50">
                    Tidak ada kategori ditemukan.
                  </CommandItem>
                )}

                {categories.map((category) => (
                  <CommandItem
                    key={category.value}
                    value={category.value}
                    onSelect={(currentValue) => {
                      if (categoryToEdit?.value !== category.value) {
                        onChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }
                    }}
                    className="flex cursor-pointer items-center justify-between"
                  >
                    {categoryToEdit?.value === category.value ? (
                      <>
                        <Input
                          value={categoryToEditLabel}
                          onChange={(e) => setCategoryToEditLabel(e.target.value)}
                          className="h-8"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(category.value, category.label);
                            }}
                          >
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategoryToEdit(null);
                              setCategoryToEditLabel('');
                            }}
                          >
                            <XCircleIcon className="h-4 w-4 text-red-500 hover:text-red-600" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === category.value ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {category.label}
                        </div>
                        {isEditable && (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategoryToEdit(category);
                                setCategoryToEditLabel(category.label);
                              }}
                            >
                              <PencilSimpleIcon className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategoryToDelete(category);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CommandItem>
                ))}
                {pagination?.next && !isLoading && (
                  <CommandItem
                    onSelect={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      fetchCategories(nextPage, true);
                    }}
                    className="flex cursor-pointer items-center justify-center gap-2"
                  >
                    <span className="hover:underline">Lebih banyak</span>
                  </CommandItem>
                )}
                {isLoading && page > 1 && (
                  <CommandItem disabled className="opacity-50">
                    Loading...
                  </CommandItem>
                )}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua data produk yang terkait dengan kategori &quot;{categoryToDelete?.label}&quot;
              akan menjadi kosong.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 cursor-pointer text-white"
              onClick={handleDeleteCategory}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

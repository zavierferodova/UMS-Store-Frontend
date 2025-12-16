import { useState, useRef, useEffect, useCallback } from 'react';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
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
import userData from '@/data/user';
import { IPaginationResponse } from '@/domain/model/response';
import { User, UserRole } from '@/domain/model/user';

export type SelectUserSearchProps = {
  value: User | null;
  onChange: (user: User | null) => void;
  error?: boolean;
  disabled?: boolean;
  roles?: UserRole[];
  placeholder?: string;
};

export function SelectUserSearch({
  value,
  onChange,
  error,
  disabled,
  roles,
  placeholder = 'Pilih user...',
}: SelectUserSearchProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<IPaginationResponse<User>['meta'] | null>(null);

  const fetchUsers = useCallback(
    async (newPage: number = 1, loadMore: boolean = false) => {
      setIsLoading(true);
      const response = await userData.getUsers({
        search,
        page: newPage,
        limit: 10,
        role: roles,
      });
      setIsLoading(false);
      if (response) {
        const newUsers = response.data;
        if (loadMore) {
          setUsers((prev) => [...prev, ...newUsers]);
        } else {
          setUsers(newUsers);
        }
        setPagination(response.meta);
      }
    },
    [search, roles],
  );

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  useEffect(() => {
    fetchUsers(1, false);
    setPage(1);
  }, [fetchUsers]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (!isLoading && pagination && pagination.page < pagination.total / pagination.limit) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchUsers(nextPage, true);
      }
    }
  };

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
            'w-full font-normal justify-between cursor-pointer text-muted-foreground hover:text-muted-foreground hover:bg-accent',
            value && 'text-foreground hover:text-foreground',
            error && 'border-destructive text-destructive',
          )}
        >
          {(() => {
            if (!value) return placeholder;
            const selected = users.find((user) => user.id === value.id);
            if (!selected) return value.name;
            return selected.name;
          })()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ minWidth: triggerWidth }} className="p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Cari user..." value={search} onValueChange={setSearch} />
          <CommandList onScroll={handleScroll} className="max-h-[200px] overflow-y-auto">
            {isLoading && users.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            )}
            {!isLoading && users.length === 0 && <CommandEmpty>User tidak ditemukan.</CommandEmpty>}
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  className="cursor-pointer"
                  onSelect={() => {
                    if (value?.id === user.id) {
                      onChange(null);
                    } else {
                      onChange(user);
                    }
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      value?.id === user.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {isLoading && users.length > 0 && (
              <div className="py-2 text-center text-xs text-muted-foreground">Loading more...</div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SealCheckIcon } from '@phosphor-icons/react/dist/ssr';
import { useEffect, useState, useRef, useCallback } from 'react';

export type DeletionFilterProps = {
  onFilterChangeAction?: (deletion: string[]) => void;
};

export function DeletionFilter({ onFilterChangeAction }: DeletionFilterProps) {
  const [showDeleted, setShowDeleted] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const prevStatusRef = useRef<string[]>([]);

  const handleFilterChange = useCallback(() => {
    if (typeof onFilterChangeAction !== 'function') return;

    const statusList: string[] = [];
    if (showDeleted) statusList.push('deleted');
    if (showActive) statusList.push('active');

    if (JSON.stringify(statusList) !== JSON.stringify(prevStatusRef.current)) {
      onFilterChangeAction(statusList);
      prevStatusRef.current = statusList;
    }
  }, [showDeleted, showActive, onFilterChangeAction]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <SealCheckIcon /> Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          checked={showActive}
          onCheckedChange={setShowActive}
        >
          Aktif
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          checked={showDeleted}
          onCheckedChange={setShowDeleted}
        >
          Dihapus
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

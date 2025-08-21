"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FunnelSimpleIcon, SealCheckIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

export type StatusFilterProps = {
  onFilterChange?: (status: string[]) => void;
};

export function StatusFilter({ onFilterChange }: StatusFilterProps) {
  const [showDeleted, setShowDeleted] = useState(false);
  const [showActive, setShowActive] = useState(false);

  useEffect(() => {
    const statusList: string[] = [];
    if (showDeleted) statusList.push("deleted");
    if (showActive) statusList.push("active");
    onFilterChange?.(statusList);
  }, [showDeleted, showActive]);

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

"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { useState, useEffect } from "react";

export type RoleFilterProps = {
  onFilterChange?: (roles: string[]) => void;
}

export function RoleFilter({ onFilterChange }: RoleFilterProps) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProcurement, setShowProcurement] = useState(false);
  const [showCashier, setShowCashier] = useState(false);

  useEffect(() => {
    const roleList: string[] = []
    if (showAdmin) roleList.push("admin")
    if (showProcurement) roleList.push("procurement")
    if (showCashier) roleList.push("cashier")
    onFilterChange?.(roleList)
  }, [showAdmin, showProcurement, showCashier]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <UserCircleIcon /> Role
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          checked={showAdmin}
          onCheckedChange={setShowAdmin}
        >
          Admin
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          checked={showProcurement}
          onCheckedChange={setShowProcurement}
        >
          Pengadaan
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          checked={showCashier}
          onCheckedChange={setShowCashier}
        >
          Kasir
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

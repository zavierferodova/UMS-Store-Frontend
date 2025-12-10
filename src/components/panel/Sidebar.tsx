'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowDownRightIcon,
  ClipboardTextIcon,
  MoneyIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  TagIcon,
} from 'lucide-react';
import { UserIcon } from '@phosphor-icons/react/dist/ssr';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { signOut, useSession } from 'next-auth/react';
import { role, roleLabel } from '@/lib/role';
import Image from 'next/image';
import Link from 'next/link';
import { panelRoutes } from '@/routes/route';
import { Role } from '@/domain/model/role';

export interface MenuItem {
  title: string;
  href: string;
  disabled?: boolean;
  roles?: Role[];
}

export interface Menu {
  title: string;
  href?: string;
  icon: React.ReactNode;
  disabled?: boolean;
  roles?: Role[];
  items?: MenuItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface MenuGroup {
  label: string;
  items: Menu[];
  roles?: Role[];
}

const menu: MenuGroup[] = [
  {
    label: 'Menu',
    items: [
      {
        title: 'Beranda',
        href: panelRoutes.home,
        icon: <HomeIcon />,
      },
    ],
    roles: [role.admin, role.procurement],
  },
  {
    label: 'Transaksi',
    items: [
      {
        title: 'Kasir',
        href: panelRoutes.cashier,
        icon: <ShoppingCartIcon />,
        roles: [role.cashier],
      },
      {
        title: 'Transaksi',
        href: panelRoutes.transactions,
        icon: <MoneyIcon />,
        roles: [role.admin, role.cashier],
      },
      {
        title: 'Purchase Order',
        href: panelRoutes.purchaseOrders,
        icon: <ShoppingCartIcon />,
        roles: [role.admin, role.procurement],
      },
    ],
    roles: [role.admin, role.procurement, role.cashier],
  },
  {
    label: 'Manajemen',
    items: [
      {
        title: 'Produk',
        href: panelRoutes.products,
        icon: <ShoppingBagIcon />,
        roles: [role.admin, role.procurement],
      },
      {
        title: 'Pemasok',
        icon: <ArrowDownRightIcon />,
        roles: [role.admin, role.procurement],
        collapsible: true,
        defaultOpen: false,
        items: [
          {
            title: 'Daftar',
            href: panelRoutes.suppliers,
            roles: [role.admin, role.procurement],
          },
          {
            title: 'Metode Pembayaran',
            href: panelRoutes.supplierPayments,
            roles: [role.admin, role.procurement],
          },
        ],
      },
      {
        title: 'Kupon',
        href: '#',
        icon: <TagIcon />,
        roles: [role.admin, role.procurement],
      },
      {
        title: 'Pengguna',
        href: panelRoutes.users,
        icon: <UserIcon />,
        roles: [role.admin],
      },
    ],
  },
  {
    label: 'Laporan',
    items: [
      {
        title: 'Laporan',
        href: '#',
        icon: <ClipboardTextIcon />,
      },
    ],
    roles: [role.admin],
  },
];

function hasRoleAccess(itemRoles: Role[] | undefined, userRole: Role | undefined) {
  if (!itemRoles || itemRoles.length === 0) return true;
  if (!userRole) return false;
  return itemRoles.includes(userRole);
}

function renderMenuItem(item: Menu, userRole: Role | undefined) {
  const visibleSubItems = item.items?.filter((subItem) => hasRoleAccess(subItem.roles, userRole));
  const hasVisibleChildren = visibleSubItems && visibleSubItems.length > 0;

  if (item.collapsible && hasVisibleChildren) {
    return (
      <Collapsible key={item.title} defaultOpen={item.defaultOpen ?? false}>
        <SidebarMenuItem>
          <SidebarMenuButton asChild disabled={item.disabled}>
            <CollapsibleTrigger className="w-full group/item-collapsible cursor-pointer">
              {item.icon}
              <div>{item.title}</div>
              <ChevronRightIcon className="ml-auto size-4 transition-transform group-data-[state=open]/item-collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarMenuButton>
          <CollapsibleContent>
            <SidebarMenuSub>
              {visibleSubItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  {subItem.disabled ? (
                    <SidebarMenuSubButton asChild>
                      <button
                        type="button"
                        disabled
                        className="w-full text-left opacity-50 cursor-not-allowed"
                      >
                        <div>{subItem.title}</div>
                      </button>
                    </SidebarMenuSubButton>
                  ) : (
                    <SidebarMenuSubButton asChild>
                      <a href={subItem.href}>
                        <div>{subItem.title}</div>
                      </a>
                    </SidebarMenuSubButton>
                  )}
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild disabled={item.disabled}>
        <a href={item.href}>
          {item.icon}
          <div className="ml-1">{item.title}</div>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function PanelSidebar() {
  const { setTheme, theme } = useTheme();
  const session = useSession();
  const { user } = session.data || {};
  const userRole = user?.role as Role | undefined;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-primary font-bold py-4 flex justify-center items-center">
          <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
        </div>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent>
        {menu
          .filter((group) => hasRoleAccess(group.roles, userRole))
          .map((group) => {
            const visibleItems = group.items.filter((item) => hasRoleAccess(item.roles, userRole));
            if (visibleItems.length === 0) return null;

            return (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems
                      .filter((item) => hasRoleAccess(item.roles, userRole))
                      .map((item) => renderMenuItem(item, userRole))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-auto cursor-pointer">
              <Avatar className="size-10 rounded-lg overflow-hidden">
                <AvatarImage
                  src={user?.profile_image}
                  alt="User profile image"
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="w-full h-full flex justify-center items-center bg-accent">
                  <UserIcon className="text-accent-foreground/60" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs text-gray-500">
                  {roleLabel(user?.role || '')}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-10 rounded-lg overflow-hidden">
                  <AvatarImage
                    src={user?.profile_image}
                    alt="User profile image"
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className="w-full h-full flex justify-center items-center bg-accent">
                    <UserIcon className="text-accent-foreground/60" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs text-gray-500">
                    {roleLabel(user?.role || '')}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={panelRoutes.profile}>
                  <BadgeCheckIcon className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon className="size-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center">
                  <SunIcon className="w-4 h-4 mr-2 dark:hidden" />
                  <MoonIcon className="w-4 h-4 mr-2 hidden dark:block" />
                  <span>Theme</span>
                </div>
                <Switch
                  className="ml-auto cursor-pointer"
                  checked={theme === 'dark'}
                  onCheckedChange={() => {
                    setTheme(theme === 'light' ? 'dark' : 'light');
                  }}
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
              <LogOutIcon className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

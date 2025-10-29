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
  SidebarSeparator,
} from '@/components/ui/sidebar';
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
  icon: React.ReactNode;
  disabled?: boolean;
  roles?: Role[];
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
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
        title: 'Transaksi',
        href: '#',
        icon: <MoneyIcon />,
        roles: [role.admin],
      },
      {
        title: 'Purchase Order',
        href: panelRoutes.purchaseOrders,
        icon: <ShoppingCartIcon />,
        roles: [role.admin, role.procurement],
      },
    ],
    roles: [role.admin, role.procurement],
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
        href: panelRoutes.suppliers,
        icon: <ArrowDownRightIcon />,
        roles: [role.admin, role.procurement],
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
                      .map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild disabled={item.disabled}>
                            <a href={item.href}>
                              {item.icon}
                              <div className="ml-1">{item.title}</div>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
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

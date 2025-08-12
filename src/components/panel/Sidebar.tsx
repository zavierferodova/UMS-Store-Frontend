"use client"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { ArrowDownRightIcon, ClipboardTextIcon, MoneyIcon, ShoppingBagIcon, ShoppingCartIcon, StudentIcon } from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BadgeCheckIcon, BellIcon, ChevronsUpDownIcon, HomeIcon, LogOutIcon, MoonIcon, SunIcon, TagIcon } from "lucide-react";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { signOut, useSession } from "next-auth/react";
import { roleLabel } from "@/lib/role";
import Image from "next/image";
import Link from "next/link";
import { panelRoutes } from "@/routes/route";

export interface MenuItem {
    title: string;
    href: string;
    icon: React.ReactNode;
    disabled?: boolean;
}

export interface MenuGroup {
    label: string;
    items: MenuItem[];
}

const menu: MenuGroup[] = [
    {
        label: "Menu",
        items: [
            {
                title: "Beranda",
                href: panelRoutes.home,
                icon: <HomeIcon />,
            },
        ]
    },
    {
        label: "Transaksi",
        items: [
            {
                title: "Transaksi",
                href: "#",
                icon: <MoneyIcon />,
            },
            {
                title: "Purchase Order",
                href: "#",
                icon: <ShoppingCartIcon />,
            },
        ]
    },
    {
        label: "Manajemen",
        items: [
            {
                title: "Produk",
                href: "#",
                icon: <ShoppingBagIcon />,
            },
            {
                title: "Supplier",
                href: "#",
                icon: <ArrowDownRightIcon />,
            },
            {
                title: "Kupon",
                href: "#",
                icon: <TagIcon />,
            },
            {
                title: "Mahasiswa",
                href: "#",
                icon: <StudentIcon />,
            },
            {
                title: "Pengguna",
                href: "#",
                icon: <UserIcon />,
            },
        ]
    },
    {
        label: "Laporan",
        items: [
            {
                title: "Laporan",
                href: "#",
                icon: <ClipboardTextIcon />,
            },
        ]
    }
]

export function PanelSidebar() {
    const { setTheme, theme } = useTheme()
    const session = useSession()
    const { user } = session.data || {}

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="text-primary font-bold py-4 flex justify-center items-center">
                    <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
                </div>
                <SidebarSeparator />
            </SidebarHeader>
            <SidebarContent>
                {menu.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.href}>
                                                {item.icon}
                                                <div className="ml-1">
                                                    {item.title}
                                                </div>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarSeparator />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="h-auto cursor-pointer">
                            <Avatar className="size-10 rounded-lg overflow-hidden">
                                <AvatarImage src={user?.profile_image} alt="User profile image" className="w-full h-full object-cover" />
                                <AvatarFallback className="w-full h-full flex justify-center items-center bg-accent">
                                    <UserIcon className="text-accent-foreground/60" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.name}</span>
                                <span className="truncate text-xs text-gray-500">{roleLabel(user?.role || "")}</span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-10 rounded-lg overflow-hidden">
                                    <AvatarImage src={user?.profile_image} alt="User profile image" className="w-full h-full object-cover"/>
                                    <AvatarFallback className="w-full h-full flex justify-center items-center bg-accent">
                                        <UserIcon className="text-accent-foreground/60" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user?.name}</span>
                                    <span className="truncate text-xs text-gray-500">{roleLabel(user?.role || "")}</span>
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
                                    checked={theme === "dark"}
                                    onCheckedChange={() => {
                                        setTheme(theme === "light" ? "dark" : "light");
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
    )
}
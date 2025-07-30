import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb";
import React from "react";

export interface BreadcrumbMenuItem {
    name: string;
    href: string;
}

export interface AdminHeaderProps {
    menu: BreadcrumbMenuItem[];
}

export function AdminHeader({ menu }: AdminHeaderProps) {
    return (
        <>
            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <SidebarTrigger className="mr-2"/>
                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-6"/>
                </div>
                <Breadcrumb>
                    <BreadcrumbList>
                        {menu.map((item, index) => (
                            <React.Fragment key={item.href}>
                                <BreadcrumbItem>
                                    {index === menu.length - 1 ? (
                                        <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < menu.length - 1 && <BreadcrumbSeparator />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </>
    )
}
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import React, { useState } from 'react';
import { createContext, useContext } from 'react';

type PanelHeaderContextType = {
  menu: PanelMenuItem[];
  setMenu: (menu: PanelMenuItem[]) => void;
};

const PanelHeaderContext = createContext<PanelHeaderContextType>({
  menu: [],
  setMenu: () => {},
});

export const usePanelHeader = () => {
  return useContext(PanelHeaderContext);
};

export interface PanelMenuItem {
  name: string;
  href: string;
}

export const PanelHeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [menu, setMenu] = useState([] as PanelMenuItem[]);
  const value = { menu, setMenu };

  return <PanelHeaderContext.Provider value={value}>{children}</PanelHeaderContext.Provider>;
};

export function PanelHeader() {
  const { menu } = usePanelHeader();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <SidebarTrigger className="mr-2 cursor-pointer" />
            {menu.length > 0 && (
              <Separator orientation="vertical" className="data-[orientation=vertical]:h-6" />
            )}
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
      </div>
    </>
  );
}

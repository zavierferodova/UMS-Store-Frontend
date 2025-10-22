'use client';
import { usePanelHeader } from '@/components/panel/Header';
import { panelRoutes } from '@/routes/route';
import { useEffect } from 'react';

export default function AdminPage() {
  const { setMenu } = usePanelHeader();

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
    ]);
  }, [setMenu]);

  return <></>;
}

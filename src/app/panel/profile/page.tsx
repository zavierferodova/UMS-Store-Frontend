'use client';
import { UpdatePasswordForm } from './components/UpdatePasswordForm/UpdatePasswordForm';
import { MyAccountForm } from './components/MyAccountForm/MyAccountForm';
import { MyProfileForm } from './components/MyProfileForm/MyProfileForm';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect } from 'react';
import { panelRoutes } from '@/routes/route';

export default function ProfilePage() {
  const { setMenu } = usePanelHeader();

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Profile',
        href: panelRoutes.profile,
      },
    ]);
  }, [setMenu]);

  return (
    <>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-[40%]">
          <MyAccountForm />
          <UpdatePasswordForm />
        </div>
        <div className="w-full lg:w-[60%]">
          <MyProfileForm />
        </div>
      </div>
    </>
  );
}

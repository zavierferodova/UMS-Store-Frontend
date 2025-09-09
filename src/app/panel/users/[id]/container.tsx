"use client";
import { User } from "@/domain/model/user";
import { usePanelHeader } from "@/components/panel/Header";
import { AccountForm } from "./components/AccountForm/AccountForm";
import { ProfileForm } from "./components/ProfileForm/ProfileForm";
import { panelRoutes } from "@/routes/route";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export type ProfilePageContainerProps = {
  user: User;
  pathId: string;
};

export function ProfilePageContainer({
  user,
  pathId,
}: ProfilePageContainerProps) {
  const { setMenu } = usePanelHeader();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.id === pathId) {
      redirect(panelRoutes.profile);
    }
  }, [session, pathId]);

  useEffect(() => {
    setMenu([
      {
        name: "Beranda",
        href: panelRoutes.home,
      },
      {
        name: "Pengguna",
        href: panelRoutes.users,
      },
      {
        name: "Detail",
        href: "",
      },
    ]);
  }, [setMenu]);

  return (
    <>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-[40%]">
          <AccountForm user={user} />
        </div>
        <div className="w-full lg:w-[60%]">
          <ProfileForm user={user} />
        </div>
      </div>
    </>
  );
}

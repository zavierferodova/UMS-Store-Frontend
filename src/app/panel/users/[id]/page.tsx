"use client";
import { usePanelHeader } from "@/components/panel/Header";
import { AccountForm } from "./components/AccountForm/AccountForm";
import { ProfileForm } from "./components/ProfileForm/ProfileForm";
import { panelRoutes } from "@/routes/route";
import { useEffect } from "react";
import { useController } from "./controller";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { setMenu } = usePanelHeader()
  const { user } = useController();
  const { data: session } = useSession();
  const params = useParams();

  useEffect(() => {
    if (session?.user.id == params.id) {
      redirect(panelRoutes.profile);
    }
  }, [session, params])

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
        href: ""
      }
    ])
  }, [setMenu])

  return (
    <>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-[40%]">
          <AccountForm user={user} />
        </div>
        <div className="w-full lg:w-[60%]">
          <ProfileForm user={user}/>
        </div>
      </div>
    </>
  );
}

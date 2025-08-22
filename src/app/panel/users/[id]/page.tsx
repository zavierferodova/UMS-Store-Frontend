import { userDataServer } from "@/data/user";
import { ProfilePageContainer } from "./container";
import { PanelNotFound } from "../../../../components/panel/PanelNotFound";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await userDataServer.getUser(id)

  if (!user) {
    return (
      <PanelNotFound message="Pengguna tidak dapat dimuat!"/>
    )
  }

  return (
    <ProfilePageContainer user={user} pathId={Number(id)} />
  )
}

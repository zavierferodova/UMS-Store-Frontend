import { userDataServer } from "@/data/user";
import { ProfilePageContainer } from "./container";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await userDataServer.getUser(id)

  if (!user) {
    return <div>Pengguna tidak ditemukan</div>
  }

  return (
    <ProfilePageContainer user={user} pathId={Number(id)} />
  )
}

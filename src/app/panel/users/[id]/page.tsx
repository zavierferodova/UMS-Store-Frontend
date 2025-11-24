import { userDataServer } from '@/data/user';
import { ProfilePageContainer } from './container';
import { notFound } from 'next/navigation';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await userDataServer.getUser(id);

  if (!user) {
    notFound();
  }

  return <ProfilePageContainer user={user} />;
}

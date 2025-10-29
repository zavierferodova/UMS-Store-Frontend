'use client';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Paginated } from '@/components/pagination/Paginated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect } from 'react';
import { panelRoutes } from '@/routes/route';
import { UserIcon } from '@phosphor-icons/react/dist/ssr';
import { useController } from './controller';
import { PageStatus } from '@/lib/page';
import { localeDateFormat } from '@/lib/utils';
import Link from 'next/link';
import { RoleFilter } from './components/RoleFilter';
import { roleLabel } from '@/lib/role';
import { EmptyDisplay } from '@/components/display/EmptyDisplay';
import { SpinAnimation } from '@/components/animation/SpinAnimation';

export default function UsersPage() {
  const { search, status, users, pagination, updatePage, updateLimit, updateSearch, updateRole } =
    useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && users.data.length == 0;
  const isLoading = status == PageStatus.LOADING;

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Pengguna',
        href: panelRoutes.users,
      },
    ]);
  }, [setMenu]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>Daftar semua pengguna yang terdaftar di sistem</CardDescription>
          </div>
          <div className="flex gap-2 md:mt-0 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                onChange={(e) => updateSearch(e.target.value)}
                value={search}
                placeholder="Cari pengguna"
                className="pl-10"
              />
            </div>
            <RoleFilter onFilterChange={updateRole} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SpinAnimation />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex justify-center">No</div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center">Image</div>
                </TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Terakhir Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex justify-center">{index + 1}</div>
                  </TableCell>
                  <TableCell className="w-20">
                    <div className="flex justify-center">
                      <Avatar>
                        <AvatarImage src={user.profile_image} className="object-cover" />
                        <AvatarFallback>
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={panelRoutes.userEdit(user.id.toString())}
                      className="font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.username || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role ? roleLabel(user.role) : '-'}</TableCell>
                  <TableCell>{user.last_login ? localeDateFormat(user.last_login) : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {isEmpty && (
          <div className="mt-8 mb-8">
            <EmptyDisplay
              title="Kosong"
              description={
                search ? 'Tidak ada data yang ditemukan' : 'Belum ada pengguna yang terdaftar'
              }
            />
          </div>
        )}
        {!isLoading && !isEmpty && (
          <Paginated
            state={pagination}
            onPageChange={(page) => updatePage(page)}
            onLimitChange={(limit) => updateLimit(limit)}
          />
        )}
      </CardContent>
    </Card>
  );
}

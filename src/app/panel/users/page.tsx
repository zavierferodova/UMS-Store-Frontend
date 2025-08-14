"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Paginated } from "@/components/pagination/Paginated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePanelHeader } from "@/components/panel/Header";
import { useEffect } from "react";
import { panelRoutes } from "@/routes/route";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";
import { useController } from "./controller";
import { UsersTableSkeleton } from "@/components/skeleton/users-table-skeleton";
import { PageStatus } from "@/lib/page";
import Link from "next/link";

export default function UsersPage() {
  const {
    search,
    status,
    users,
    updatePage,
    updateLimit,
    updateSearch,
  } = useController();
  const { setMenu } = usePanelHeader();
  const { meta } = users;

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
    ]);
  }, [setMenu]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Daftar Pengguna</CardTitle>
          <div className="w-1/4">
            <Input
              onChange={(e) => updateSearch(e.target.value)}
              value={search}
              placeholder="Cari pengguna..."
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status == PageStatus.LOADING ? (
          <UsersTableSkeleton />
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
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
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
                    <Link href={panelRoutes.userEdit(user.id.toString())} className="font-medium">
                     {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.username || "-"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role ?? "-"}</TableCell>
                  <TableCell>
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString("id-ID")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Paginated
          meta={meta}
          onPageChange={(page) => updatePage(page)}
          onLimitChange={(limit) => updateLimit(limit)}
        />
      </CardContent>
    </Card>
  );
}

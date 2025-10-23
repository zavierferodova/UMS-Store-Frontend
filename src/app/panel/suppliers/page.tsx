'use client';
import { Button } from '@/components/ui/button';
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
import { Paginated } from '@/components/pagination/Paginated';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect } from 'react';
import { panelRoutes } from '@/routes/route';
import { useController } from './controller';
import { PageStatus } from '@/lib/page';
import { localeDateFormat } from '@/lib/utils';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { StatusFilter } from '../../../components/filter/StatusFilter';
import { isAdmin } from '@/lib/role';
import { EmptyDisplay } from '@/components/display/EmptyDisplay';
import { SpinAnimation } from '@/components/animation/SpinAnimation';

export default function SuppliersPage() {
  const {
    user,
    search,
    status,
    suppliers,
    pagination,
    updatePage,
    updateLimit,
    updateSearch,
    updateStatusFilter,
  } = useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && suppliers.data.length == 0;

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Pemasok',
        href: panelRoutes.suppliers,
      },
    ]);
  }, [setMenu]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Daftar Pemasok</CardTitle>
            <CardDescription>Daftar semua pemasok yang terdaftar di sistem</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                onChange={(e) => updateSearch(e.target.value)}
                value={search}
                placeholder="Cari pemasok"
                className="pl-10 w-full md:w-64"
              />
            </div>
            {isAdmin(user) && <StatusFilter onFilterChange={updateStatusFilter} />}
            <Link href={panelRoutes.supplierAdd} className="w-full md:w-auto">
              <Button className="cursor-pointer w-full">
                <PlusIcon className="h-4 w-4" /> <span className="ml-1">Tambah</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status == PageStatus.LOADING ? (
          <SpinAnimation />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex justify-center">No</div>
                </TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>No Telp</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Diubah</TableHead>
                {isAdmin(user) && <TableHead>Status</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.data.map((supplier, index) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="flex justify-center">{index + 1}</div>
                  </TableCell>
                  <TableCell>{supplier.code}</TableCell>
                  <TableCell>
                    <Link
                      href={panelRoutes.supplierEdit(supplier.id.toString())}
                      className="font-medium hover:underline"
                    >
                      {supplier.name}
                    </Link>
                  </TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.email || '-'}</TableCell>
                  <TableCell>
                    {supplier.created_at ? localeDateFormat(supplier.created_at) : '-'}
                  </TableCell>
                  <TableCell>
                    {supplier.updated_at ? localeDateFormat(supplier.updated_at) : '-'}
                  </TableCell>
                  {isAdmin(user) && (
                    <TableCell>{supplier.is_deleted ? 'Dihapus' : 'Aktif'}</TableCell>
                  )}
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
                search ? 'Tidak ada data yang ditemukan' : 'Belum ada pemasok yang terdaftar'
              }
            />
          </div>
        )}
        {!isEmpty && (
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

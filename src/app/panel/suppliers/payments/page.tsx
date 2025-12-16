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
import { useEffect, Suspense, useState } from 'react';
import { panelRoutes } from '@/routes/route';
import { useController } from './controller';
import { PageStatus } from '@/lib/page';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { DeletionFilter } from '../../../../components/filter/DeletionFilter';
import { isAdmin } from '@/lib/role';
import { EmptyDisplay } from '@/components/display/EmptyDisplay';
import { SpinAnimation } from '@/components/animation/SpinAnimation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { DialogPaymentMethod } from './components/DialogPaymentMethod';
import { PaymentMethod } from '@/domain/model/payment-method';
import Link from 'next/link';
import { localeDateFormat } from '@/lib/utils';

function PaymentMethodsPageContent() {
  const {
    user,
    search,
    status,
    paymentMethods,
    pagination,
    updatePage,
    updateLimit,
    updateSearch,
    updateStatusFilter,
    handleDelete,
    refetch,
  } = useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && paymentMethods.data.length == 0;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod | null>(null);

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
      {
        name: 'Metode Pembayaran',
        href: panelRoutes.supplierPayments,
      },
    ]);
  }, [setMenu]);

  const onDeleteClick = (id: string) => {
    setSelectedPaymentMethodId(id);
    setDeleteDialogOpen(true);
  };

  const onEditClick = (paymentMethod: PaymentMethod) => {
    setEditPaymentMethod(paymentMethod);
    setPaymentDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setPaymentDialogOpen(open);
    if (!open) {
      setEditPaymentMethod(null);
    }
  };

  const onDeleteConfirm = async () => {
    if (selectedPaymentMethodId) {
      const result = await handleDelete(selectedPaymentMethodId);
      if (result) {
        toast.success('Metode pembayaran berhasil dihapus');
      } else {
        toast.error('Gagal menghapus metode pembayaran');
      }
      setDeleteDialogOpen(false);
      setSelectedPaymentMethodId(null);
    }
  };

  const handleSuccessChange = () => {
    updatePage(1);
    refetch();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle>Daftar Metode Pembayaran</CardTitle>
              <CardDescription>
                Daftar semua metode pembayaran pemasok yang terdaftar di sistem
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={(e) => updateSearch(e.target.value)}
                  value={search}
                  placeholder="Cari metode pembayaran"
                  className="pl-10 w-full md:w-64"
                />
              </div>
              {isAdmin(user) && <DeletionFilter onFilterChangeAction={updateStatusFilter} />}
              <Button
                onClick={() => setPaymentDialogOpen(true)}
                className="cursor-pointer w-full md:w-auto"
              >
                <PlusIcon className="h-4 w-4" /> <span className="ml-1">Tambah</span>
              </Button>
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
                  <TableHead>Kode Supplier</TableHead>
                  <TableHead>Nama Supplier</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Nomor Rekening</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Diubah</TableHead>
                  {isAdmin(user) && <TableHead>Penghapusan</TableHead>}
                  <TableHead>
                    <div className="flex justify-center">Aksi</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods.data.map((paymentMethod, index) => (
                  <TableRow key={paymentMethod.id}>
                    <TableCell>
                      <div className="flex justify-center">{index + 1}</div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={panelRoutes.supplierEdit(paymentMethod.supplier.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline"
                      >
                        {paymentMethod.supplier.code}
                      </Link>
                    </TableCell>
                    <TableCell>{paymentMethod.supplier.name}</TableCell>
                    <TableCell>{paymentMethod.name}</TableCell>
                    <TableCell>{paymentMethod.owner}</TableCell>
                    <TableCell>{paymentMethod.account_number}</TableCell>
                    <TableCell>{localeDateFormat(paymentMethod.created_at)}</TableCell>
                    <TableCell>{localeDateFormat(paymentMethod.updated_at)}</TableCell>
                    {isAdmin(user) && (
                      <TableCell>{paymentMethod.is_deleted ? 'Dihapus' : 'Aktif'}</TableCell>
                    )}
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditClick(paymentMethod)}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteClick(paymentMethod.id.toString())}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
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
                  search
                    ? 'Tidak ada data yang ditemukan'
                    : 'Belum ada metode pembayaran yang terdaftar'
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

      <DialogPaymentMethod
        open={paymentDialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={handleSuccessChange}
        editData={editPaymentMethod}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Metode Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus metode pembayaran ini? Aksi ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm} className="cursor-pointer">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function PaymentMethodsPage() {
  return (
    <Suspense>
      <PaymentMethodsPageContent />
    </Suspense>
  );
}

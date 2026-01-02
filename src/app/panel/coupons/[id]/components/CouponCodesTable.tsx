import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Search } from 'lucide-react';
import { useCouponCodesController } from './codes-controller';
import { CouponCodeDialog } from './CouponCodeDialog';
import { useState } from 'react';
import { CouponCode } from '@/domain/model/coupon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { CreateCodeFormValues, UpdateCodeFormValues } from './codes-validation';

interface CouponCodesTableProps {
  couponId: string;
}

export function CouponCodesTable({ couponId }: CouponCodesTableProps) {
  const { codes, loading, search, setSearch, createCode, updateCode } =
    useCouponCodesController(couponId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'update'>('create');
  const [selectedCode, setSelectedCode] = useState<CouponCode | undefined>(undefined);

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedCode(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (code: CouponCode) => {
    setDialogMode('update');
    setSelectedCode(code);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: CreateCodeFormValues | UpdateCodeFormValues) => {
    if (dialogMode === 'create') {
      return await createCode(values as CreateCodeFormValues);
    } else {
      if (selectedCode) {
        return await updateCode(selectedCode.code, values as UpdateCodeFormValues);
      }
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Kode Kupon</CardTitle>
        <CardDescription>Kelola kode kupon anda di sini</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative w-full mr-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Button onClick={handleCreate} size="sm" className="cursor-pointer">
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Terpakai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : codes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Tidak ada kode kupon ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                codes.map((code) => (
                  <TableRow key={code.code}>
                    <TableCell className="font-medium">{code.code}</TableCell>
                    <TableCell>{code.stock}</TableCell>
                    <TableCell>{code.used}</TableCell>
                    <TableCell>
                      <Badge variant={code.disabled ? 'destructive' : 'default'}>
                        {code.disabled ? 'Nonaktif' : 'Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(code)}
                        className="cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CouponCodeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedCode}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}

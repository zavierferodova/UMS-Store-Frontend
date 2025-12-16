import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { SelectSupplierSearch } from '../../../../../components/panel/form/SelectSupplierSearch';
import { Supplier } from '@/domain/model/supplier';

export type SKUItem = {
  id?: string;
  sku: string;
  supplier?: string | null;
  supplierName?: string | null;
  stock?: number;
};

export type SKUError = {
  sku?: { message?: string };
  supplier?: { message?: string };
};

export type ProductSKUInputProps = {
  skus: SKUItem[];
  onSkusChange: (skus: SKUItem[]) => void;
  errors?: SKUError[];
  isEditMode?: boolean;
  originalSkus?: SKUItem[];
};

export function ProductSKUInput({
  skus,
  onSkusChange,
  errors,
  isEditMode = false,
  originalSkus,
}: ProductSKUInputProps) {
  const handleAddSku = () => {
    onSkusChange([...skus, { sku: '', supplier: null }]);
  };

  const handleRemoveSku = (index: number) => {
    const newSkus = [...skus];
    newSkus.splice(index, 1);
    onSkusChange(newSkus);
  };

  const handleSkuChange = (index: number, field: keyof SKUItem, value: string) => {
    const newSkus = [...skus];
    newSkus[index] = { ...newSkus[index], [field]: value };
    onSkusChange(newSkus);
  };

  const handleSupplierChange = (index: number, supplier: Supplier | null) => {
    const newSkus = [...skus];
    newSkus[index] = {
      ...newSkus[index],
      supplier: supplier?.id || null,
      supplierName: supplier?.name || null,
    };
    onSkusChange(newSkus);
  };

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="max-h-[400px] overflow-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[15rem]">SKU</TableHead>
              <TableHead>Supplier</TableHead>
              {isEditMode && <TableHead>Stok</TableHead>}
              <TableHead className="w-[50px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skus.map((sku, index) => {
              const isExisting = !!sku.id;
              const originalSku = originalSkus?.find((s) => s.id === sku.id);
              const originallyHadSupplier = isExisting && !!originalSku?.supplier;

              const isReadOnly = isEditMode && isExisting;
              const isSupplierEditable = !isReadOnly || !originallyHadSupplier;
              const skuError = errors?.[index]?.sku?.message;
              const supplierError = errors?.[index]?.supplier?.message;

              return (
                <TableRow key={index}>
                  <TableCell className="align-middle">
                    {isReadOnly ? (
                      <span className="text-sm font-medium">{sku.sku}</span>
                    ) : (
                      <div className="space-y-1">
                        <Input
                          value={sku.sku}
                          onChange={(e) => handleSkuChange(index, 'sku', e.target.value)}
                          placeholder="Masukkan SKU"
                          className={skuError ? 'border-destructive' : ''}
                        />
                        {skuError && <p className="text-xs text-destructive">{skuError}</p>}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="align-middle min-w-[200px]">
                    {!isSupplierEditable ? (
                      <span className="text-sm font-medium">
                        {sku.supplierName || 'Unknown Supplier'}
                      </span>
                    ) : (
                      <div className="space-y-1">
                        <SelectSupplierSearch
                          value={
                            sku.supplier
                              ? ({
                                  id: sku.supplier,
                                  name: sku.supplierName,
                                } as Supplier)
                              : null
                          }
                          onChange={(value) => handleSupplierChange(index, value)}
                          error={!!supplierError}
                        />
                        {supplierError && (
                          <p className="text-xs text-destructive">{supplierError}</p>
                        )}
                      </div>
                    )}
                  </TableCell>
                  {isEditMode && (
                    <TableCell className="align-middle">
                      <span className="text-sm font-medium">{sku.stock || 0}</span>
                    </TableCell>
                  )}
                  <TableCell className="align-middle text-center">
                    {isReadOnly && <span className="text-sm text-muted-foreground">-</span>}
                    {!isReadOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSku(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90 cursor-pointer"
                        disabled={skus.length === 1 && !isEditMode}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddSku}
        className="w-full cursor-pointer"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Tambah SKU
      </Button>
    </div>
  );
}

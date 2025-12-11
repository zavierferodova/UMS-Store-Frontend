import { toast } from 'sonner';
import { ProductSingleSKU } from '@/domain/model/product';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PackageOpenIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { DialogImagePreview } from '@/components/panel/DialogImagePreview';
import { ImageIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { panelRoutes } from '@/routes/route';
import { FormValues } from '../../../app/panel/purchase-orders/add/validation';
import { UseFormReturn } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type PoProductsTableInputProps = {
  products: ProductSingleSKU[];
  form?: UseFormReturn<FormValues>;
  disableDelete?: boolean;
  readonly?: boolean;
  onRemove: (productId: string) => void;
};

export function PoProductsTableInput({
  products,
  form,
  readonly,
  onRemove,
}: PoProductsTableInputProps) {
  const supplier = form?.watch ? form.watch('supplier') : undefined;
  const items = form?.watch ? form.watch('items') : [];
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState('');
  const [useDefaultDiscount, setUseDefaultDiscount] = useState<{ [sku: string]: boolean }>({});

  // Update discount when supplier changes and useDefaultDiscount is checked
  useEffect(() => {
    if (!form || !supplier) return;

    const currentItems = form.getValues('items') || [];
    const updatedItems = currentItems.map((item) => {
      if (useDefaultDiscount[item.product_sku]) {
        return {
          ...item,
          supplier_discount: supplier.discount || 0,
        };
      }
      return item;
    });

    form.setValue('items', updatedItems, { shouldValidate: false });
  }, [supplier, useDefaultDiscount, form]);

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
        <PackageOpenIcon size={40} className="mx-auto mb-1" />
        <div>No products selected.</div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">No</TableHead>
            <TableHead className="w-16">Image</TableHead>
            <TableHead className="min-w-[200px]">Product</TableHead>
            <TableHead className="min-w-[150px]">SKU</TableHead>
            <TableHead className="min-w-[150px]">Harga Supplier (Rp)</TableHead>
            <TableHead className="min-w-[120px]">Jumlah Pesan</TableHead>
            <TableHead className="min-w-[180px]">Diskon Supplier (%)</TableHead>
            {!readonly && <TableHead className="w-16 text-center">Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, idx) => {
            const item = items.find((i) => i.product_sku === product.sku.sku) || {
              product_sku: product.sku.sku,
              price: 0,
              amounts: 0,
              supplier_discount: 0,
            };

            const updateItem = (field: string, value: number) => {
              if (!form) return;
              const currentItems = form.getValues('items') || [];
              const itemIndex = currentItems.findIndex((i) => i.product_sku === product.sku.sku);

              if (itemIndex >= 0) {
                currentItems[itemIndex] = { ...currentItems[itemIndex], [field]: value };
              } else {
                currentItems.push({
                  product_sku: product.sku.sku,
                  price: field === 'price' ? value : 0,
                  amounts: field === 'amounts' ? value : 0,
                  supplier_discount: field === 'supplier_discount' ? value : 0,
                });
              }

              form.setValue('items', currentItems, { shouldValidate: true });
            };

            return (
              <TableRow key={product.sku.sku}>
                <TableCell className="text-center">{idx + 1}</TableCell>
                <TableCell>
                  <div className="w-12 h-12 relative rounded-md overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]?.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full bg-gray-200 cursor-pointer"
                        onClick={() => {
                          if (readonly) return;
                          setCurrentImagePreview(product.images[0]?.image);
                          setShowImageDialog(true);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={panelRoutes.productEdit(product.id)}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="hover:underline cursor-pointer font-medium"
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{product.sku.sku}</span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {readonly ? (
                      <span>{`Rp ${item.price ? item.price.toLocaleString('id-ID') : '0'}`}</span>
                    ) : (
                      <Input
                        id={`base-price-${product.sku.sku}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={9}
                        className="w-full"
                        placeholder="Rp 0,-"
                        value={item.price > 0 ? Number(item.price).toLocaleString('id-ID') : ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          updateItem('price', val ? Number(val) : 0);
                        }}
                      />
                    )}
                    {!readonly && item.price === 0 && (
                      <p className="text-xs text-destructive">Harga harus lebih dari 0</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {readonly ? (
                      <span>{item.amounts ? item.amounts : 0}</span>
                    ) : (
                      <Input
                        id={`stock-${product.sku.sku}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full"
                        placeholder="0"
                        maxLength={5}
                        value={item.amounts > 0 ? String(item.amounts) : ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const numVal = val ? Number(val) : 0;
                          updateItem('amounts', numVal);
                        }}
                      />
                    )}
                    {!readonly && item.amounts === 0 && (
                      <p className="text-xs text-destructive">Jumlah harus lebih dari 0</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {readonly ? (
                      <span>
                        {item.supplier_discount != null ? `${item.supplier_discount}%` : '0%'}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            id={`discount-${product.sku.sku}`}
                            type="number"
                            inputMode="decimal"
                            pattern="[0-9,\.]*"
                            className="w-full"
                            placeholder="0"
                            maxLength={5}
                            value={
                              item.supplier_discount != null && item.supplier_discount > 0
                                ? String(item.supplier_discount)
                                : ''
                            }
                            onChange={(e) => {
                              let val = e.target.value.replace(/[^0-9.]/g, '');
                              if (val.includes('.')) {
                                const [intPart, decPart] = val.split('.');
                                val = intPart + '.' + decPart.slice(0, 1);
                              }
                              updateItem('supplier_discount', val ? Number(val) : 0);
                              setUseDefaultDiscount((prev) => ({
                                ...prev,
                                [product.sku.sku]: false,
                              }));
                            }}
                            disabled={useDefaultDiscount[product.sku.sku]}
                          />
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Checkbox
                              id={`discount-checkbox-${product.sku.sku}`}
                              checked={useDefaultDiscount[product.sku.sku] || false}
                              className="cursor-pointer"
                              onCheckedChange={(checked) => {
                                if (checked && !supplier) {
                                  toast.error('Supplier belum dipilih!');
                                  return;
                                }
                                setUseDefaultDiscount((prev) => ({
                                  ...prev,
                                  [product.sku.sku]: !!checked,
                                }));
                                if (checked && supplier) {
                                  updateItem('supplier_discount', supplier.discount || 0);
                                }
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>Terapkan default diskon supplier</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                    {!readonly &&
                      item.supplier_discount != null &&
                      item.supplier_discount > 100 && (
                        <p className="text-xs text-destructive">
                          Diskon tidak boleh lebih dari 100%
                        </p>
                      )}
                  </div>
                </TableCell>
                {!readonly && (
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onRemove(product.sku.sku)}
                      className="text-destructive hover:text-destructive cursor-pointer"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <DialogImagePreview
        isOpen={showImageDialog}
        onOpenChange={setShowImageDialog}
        src={currentImagePreview}
      />
    </>
  );
}

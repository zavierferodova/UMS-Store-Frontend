import { toast } from 'sonner';
import { Product, ProductSingleSKU } from '@/domain/model/product';
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
import { Field, FieldSet } from '@/components/ui/field';
import { FormValues } from '../validation';
import { UseFormReturn } from 'react-hook-form';

export interface PurchaseOrderProduct {
  product: ProductSingleSKU;
  stock: number;
}

export type PurchaseOrderProductsListProps = {
  products: PurchaseOrderProduct[];
  onStockChange: (productId: string, stock: number) => void;
  onRemove: (productId: string) => void;
  form?: UseFormReturn<FormValues>;
};

export function PurchaseOrderProductsList({
  products,
  onStockChange,
  onRemove,
  form,
}: PurchaseOrderProductsListProps) {
  const supplier = form?.watch ? form.watch('supplier') : undefined;
  const items = form?.watch ? form.watch('items') : [];
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState('');
  const [useDefaultDiscount, setUseDefaultDiscount] = useState<{ [sku: string]: boolean }>({});

  // Initialize items for new products
  useEffect(() => {
    if (!form) return;

    const currentItems = form.getValues('items') || [];
    const newItems = [...currentItems];
    let hasChanges = false;

    // Add new products that don't exist in items
    products.forEach((product) => {
      const exists = newItems.find((item) => item.product_sku === product.product.sku.sku);
      if (!exists) {
        newItems.push({
          product_sku: product.product.sku.sku,
          price: 0,
          amounts: 0,
          supplier_discount: 0,
        });
        hasChanges = true;
      }
    });

    // Remove items for products that are no longer selected
    const filteredItems = newItems.filter((item) =>
      products.find((p) => p.product.sku.sku === item.product_sku),
    );

    if (hasChanges || filteredItems.length !== newItems.length) {
      form.setValue('items', filteredItems, { shouldValidate: false });
    }
  }, [products, form]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, productIndex) => {
          const itemIndex = items.findIndex((item) => item.product_sku === product.product.sku.sku);
          const item = itemIndex !== -1 ? items[itemIndex] : null;

          if (!item) return null;

          const updateItem = (field: keyof typeof item, value: number) => {
            if (!form) return;
            const currentItems = form.getValues('items') || [];
            const updatedItems = [...currentItems];
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
            form.setValue('items', updatedItems, { shouldValidate: true });
          };

          return (
            <div
              key={product.product.sku.sku}
              className="flex flex-col p-4 border rounded-lg transition-colors"
            >
              <div className="w-full h-40 relative rounded-md overflow-hidden mb-2">
                {product.product.images && product.product.images.length > 0 ? (
                  <Image
                    src={product.product.images[0]?.image}
                    alt={product.product.name}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setCurrentImagePreview(product.product.images[0]?.image);
                      setShowImageDialog(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 w-full">
                <div className="mb-5">
                  <div className="font-medium text-base sm:text-lg">
                    <Link
                      href={panelRoutes.productEdit(product.product.id)}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="hover:underline cursor-pointer block truncate"
                    >
                      {product.product.name}
                    </Link>
                  </div>
                  <span className="text-sm text-muted-foreground break-words">
                    {product.product.sku.sku}
                  </span>
                </div>
                <FieldSet className="gap-4">
                  <Field>
                    <Input
                      id={`base-price-${product.product.sku.sku}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={9}
                      className="w-full"
                      placeholder="Harga dasar (Rp)"
                      value={item.price > 0 ? String(item.price) : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        updateItem('price', val ? Number(val) : 0);
                      }}
                    />
                    {item.price === 0 && (
                      <p className="text-xs text-destructive mt-1">Harga harus lebih dari 0</p>
                    )}
                  </Field>
                  <Field>
                    <Input
                      id={`stock-${product.product.sku.sku}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-full"
                      placeholder="Stock dipesan"
                      maxLength={5}
                      value={item.amounts > 0 ? String(item.amounts) : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const numVal = val ? Number(val) : 0;
                        updateItem('amounts', numVal);
                        onStockChange(product.product.id, numVal);
                      }}
                    />
                    {item.amounts === 0 && (
                      <p className="text-xs text-destructive mt-1">Jumlah harus lebih dari 0</p>
                    )}
                  </Field>
                  <Field>
                    <div className="flex items-center w-full gap-2">
                      <div className="flex-1">
                        <Input
                          id={`discount-${product.product.sku.sku}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-full"
                          placeholder="Diskon supplier (%)"
                          maxLength={3}
                          value={
                            item.supplier_discount && item.supplier_discount > 0
                              ? String(item.supplier_discount)
                              : ''
                          }
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            updateItem('supplier_discount', val ? Number(val) : 0);
                            setUseDefaultDiscount((prev) => ({
                              ...prev,
                              [product.product.sku.sku]: false,
                            }));
                          }}
                          disabled={useDefaultDiscount[product.product.sku.sku]}
                        />
                        {item.supplier_discount != null && item.supplier_discount > 100 && (
                          <p className="text-xs text-destructive mt-1">
                            Diskon tidak boleh lebih dari 100%
                          </p>
                        )}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Checkbox
                            id={`discount-checkbox-${product.product.sku.sku}`}
                            checked={useDefaultDiscount[product.product.sku.sku] || false}
                            className="cursor-pointer"
                            onCheckedChange={(checked) => {
                              if (checked && !supplier) {
                                toast.error('Supplier belum dipilih!');
                                return;
                              }
                              setUseDefaultDiscount((prev) => ({
                                ...prev,
                                [product.product.sku.sku]: !!checked,
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
                  </Field>
                </FieldSet>
              </div>
              <div className="w-full flex justify-center items-center mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(product.product.sku.sku)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <DialogImagePreview
        isOpen={showImageDialog}
        onOpenChange={setShowImageDialog}
        src={currentImagePreview}
      />
    </>
  );
}

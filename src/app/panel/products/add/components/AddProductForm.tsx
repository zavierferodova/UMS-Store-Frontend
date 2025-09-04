import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import {
  CheckIcon,
  CaretUpDownIcon,
  XCircleIcon,
  ImageIcon,
  PlusCircleIcon,
  EyeIcon,
  TrashIcon,
  XIcon,
  PencilSimpleIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import React, { useState, useRef, useEffect } from "react";
import { Reorder } from "motion/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ImageFile = {
  id: string;
  file: File;
  preview: string;
}

type AdditionalInfoItem = {
  label: string;
  value: string;
}

export function AddProductForm() {
    const triggerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const [categories, setCategories] = useState([
    { value: "electronics", label: "Elektronik" },
    { value: "clothing", label: "Pakaian" },
    { value: "books", label: "Buku" },
    { value: "home-appliances", label: "Peralatan Rumah Tangga" },
    { value: "sports", label: "Olahraga" },
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState("");
  const [skus, setSkus] = useState<string[]>([""]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryLabel, setNewCategoryLabel] = useState<string>("");

  const handleViewImage = (imageUrl: string) => {
    setCurrentImagePreview(imageUrl);
    setShowImageDialog(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages: ImageFile[] = Array.from(event.target.files).map(
        (file) => ({
          id: `image-${nextId.current++}`,
          file,
          preview: URL.createObjectURL(file),
        })
      );
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prevImages.filter((img) => img.id !== id);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSkuChange = (index: number, value: string) => {
    const newSkus = [...skus];
    newSkus[index] = value;
    setSkus(newSkus);
  };

  const addSku = () => {
    setSkus([...skus, ""]);
  };

  const removeSku = (index: number) => {
    const newSkus = skus.filter((_, i) => i !== index);
    setSkus(newSkus);
  };

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoItem[]>([
    { label: "", value: "" },
  ]);

  const handleAdditionalInfoChange = (
    index: number,
    field: keyof AdditionalInfoItem,
    val: string
  ) => {
    const newAdditionalInfo = [...additionalInfo];
    newAdditionalInfo[index][field] = val;
    setAdditionalInfo(newAdditionalInfo);
  };

  const addAdditionalInfo = () => {
    setAdditionalInfo([...additionalInfo, { label: "", value: "" }]);
  };

  const removeAdditionalInfo = (index: number) => {
    const newAdditionalInfo = additionalInfo.filter((_, i) => i !== index);
    setAdditionalInfo(newAdditionalInfo);
  };

  const handleEditCategory = (categoryValue: string, currentLabel: string) => {
    setEditingCategory(categoryValue);
    setNewCategoryLabel(currentLabel);
  };

  const handleDeleteCategory = (categoryValue: string) => {
    console.log("Delete category:", categoryValue);
    // Implement actual delete logic here
  };

  const handleSaveCategory = (categoryValue: string, newLabel: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.value === categoryValue ? { ...cat, label: newLabel } : cat
      )
    );
    setEditingCategory(null); // Exit editing mode
  };

  const handleCancelEdit = () => {
    setEditingCategory(null); // Exit editing mode
  };

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth); 
    }
  }, [open]);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  return (
    <div className="flex justify-center mb-6">
      <div className="w-full md:w-4/5">
        <Card>
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
            <CardDescription>Informasi dasar tentang produk</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Gambar Produk</Label>
              <div className="overflow-x-auto pb-2">
                <Reorder.Group
                  axis="x"
                  values={images}
                  onReorder={setImages}
                  className="flex items-center gap-2"
                >
                  {images.map((image) => (
                    <Reorder.Item
                      key={image.id}
                      value={image}
                      className="relative h-24 w-24 flex-shrink-0"
                    >
                      <div className="group relative w-full h-full">
                        <img
                          src={image.preview}
                          alt="Pratinjau Produk"
                          className="h-full w-full rounded-md object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:flex hidden items-center justify-center gap-2 rounded-md">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer bg-white text-black"
                            onClick={() => handleViewImage(image.preview)}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => removeImage(image.id)}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                  <div
                    className="flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed"
                    onClick={triggerFileInput}
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </Reorder.Group>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" placeholder="Nama Produk" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? categories.find((category) => category.value === value)
                          ?.label
                      : "Pilih kategori..."}
                    <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  style={{ minWidth: triggerWidth }}
                  className="p-0"
                >
                  <Command>
                    <CommandInput placeholder="Cari kategori..." />
                    <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.value}
                          value={category.value}
                          onSelect={(currentValue) => {
                            if (editingCategory !== category.value) {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }
                          }}
                          className="flex items-center justify-between"
                        >
                          {editingCategory === category.value ? (
                            <>
                              <Input
                                value={newCategoryLabel}
                                onChange={(e) => setNewCategoryLabel(e.target.value)}
                                className="h-8"
                              />
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveCategory(category.value, category.label);
                                  }}
                                >
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-500 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit();
                                  }}
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center">
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value === category.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {category.label}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCategory(category.value, category.label);
                                  }}
                                >
                                  <PencilSimpleIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-500 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category.value);
                                  }}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" placeholder="Deskripsi Produk" />
            </div>

            <Separator className="my-4" />

            <div className="grid gap-2">
              <Label htmlFor="additional-price">Harga</Label>
              <Input id="additional-price" type="number" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skus">SKU</Label>
              {skus.map((sku, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    id={`sku-${index}`}
                    placeholder="Masukkan SKU"
                    value={sku}
                    onChange={(e) => handleSkuChange(index, e.target.value)}
                  />
                  {skus.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => removeSku(index)}
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer text-primary hover:text-primary/80"
                  onClick={addSku}
                >
                  <PlusCircleIcon size={20} />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-2">
              <Label>Informasi Tambahan</Label>
              {additionalInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, "label", e.target.value)
                    }
                    className="w-1/2"
                  />
                  <Input
                    placeholder="Nilai"
                    value={item.value}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, "value", e.target.value)
                    }
                    className="w-1/2"
                  />
                  {additionalInfo.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => removeAdditionalInfo(index)}
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer text-primary hover:text-primary/80"
                  onClick={addAdditionalInfo}
                >
                  <PlusCircleIcon size={20} />
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Simpan</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      
      {showImageDialog && (
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <Button
              type="button"
              variant="ghost"
              size="default"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white hover:text-black cursor-pointer"
              onClick={() => setShowImageDialog(false)}
            >
              <XIcon className="h-8 w-8" />
            </Button>
            <TransformWrapper
              initialScale={0.75}
              minScale={0.75}
              maxScale={7}
              centerOnInit
            >
              <TransformComponent>
                <img src={currentImagePreview} alt="Product Preview" />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </Dialog>
      )}
    </div>
  );
}
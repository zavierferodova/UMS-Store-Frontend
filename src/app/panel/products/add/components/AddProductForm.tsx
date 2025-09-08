import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { SelectProductCategory } from "@/components/panel/Form/SelectProductCategory";
import { ImageFile, ProductImagesInput } from "@/components/panel/Form/ProductImagesInput";
import { DialogImagePreview } from "@/components/panel/DialogImagePreview";
import { MultiSkuInput } from "@/components/panel/Form/MultiSkuInput";
import { AdditionalInfoItem, ProductAdditionalInputs } from "@/components/panel/Form/ProductAdditionalInputs";

export function AddProductForm() {
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState("");
  const [skus, setSkus] = useState<string[]>([""]);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoItem[]>([
    { label: "", value: "" },
  ]);

  const handleImagesChange = (newImages: ImageFile[]) => {
    setImages(newImages);
  };

  const handleSkusChange = (newSkus: string[]) => {
    setSkus(newSkus);
  };

  const handleAdditionalInfoChange = (newAdditionalInfo: AdditionalInfoItem[]) => {
    setAdditionalInfo(newAdditionalInfo);
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
            <CardDescription>Informasi dasar tentang produk</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Gambar Produk</Label>
              <ProductImagesInput 
                onImagesChange={handleImagesChange}
                initialImages={images}
                onImagePreview={(imageUrl) => {
                  setCurrentImagePreview(imageUrl);
                  setShowImageDialog(true);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" placeholder="Nama Produk" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <SelectProductCategory 
                value={categoryId}
                onChange={setCategoryId}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" placeholder="Deskripsi Produk" />
            </div>
            <div className="grid gap-2">
              <Label>Informasi Tambahan</Label>
              <ProductAdditionalInputs 
                additionalInfo={additionalInfo}
                onAdditionalInfoChange={handleAdditionalInfoChange}
              />
            </div>

            <Separator className="my-4" />

            <div className="grid gap-2">
              <Label htmlFor="additional-price">Harga</Label>
              <Input id="additional-price" type="number" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label>SKU</Label>
              <MultiSkuInput 
                skus={skus}
                onSkusChange={handleSkusChange}
              />
            </div>
            <div className="flex justify-end">
              <Button>Simpan</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogImagePreview 
        isOpen={showImageDialog}
        onOpenChange={(open) => {
          console.log("open", open);
          setShowImageDialog(open)
        }}
        src={currentImagePreview}
      />
    </div>
  );
}
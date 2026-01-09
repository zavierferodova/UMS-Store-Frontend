import { useRef, useState, useEffect } from 'react';
import { Reorder } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ImageIcon, EyeIcon, TrashIcon } from '@phosphor-icons/react';
import { DialogImagePreview } from '../../../../../components/panel/DialogImagePreview';
import Image from 'next/image';
import { toast } from 'sonner';

export type ImageFile = {
  id: string;
  file?: File;
  src: string;
};

export type ProductImagesInputProps = {
  onImagesChange?: (images: ImageFile[]) => void;
  images?: ImageFile[];
};

export function ProductImagesInput({ onImagesChange, images = [] }: ProductImagesInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const oversizedFiles = files.filter((file) => file.size > 800 * 1024);

      if (oversizedFiles.length > 0) {
        toast.error('Ukuran file melebihi batas 800KB. Silakan pilih file yang lebih kecil.');
        return;
      }

      const newImages: ImageFile[] = files.map((file) => ({
        id: `image-${nextId.current++}`,
        file,
        src: URL.createObjectURL(file),
      }));
      onImagesChange?.([...(images || []), ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    const imageToRemove = images?.find((img) => img.id === id);
    if (imageToRemove) {
      if (imageToRemove.file) {
        URL.revokeObjectURL(imageToRemove.src);
      }
      onImagesChange?.(images.filter((img) => img.id !== id));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleViewImage = (imageUrl: string) => {
    setCurrentImagePreview(imageUrl);
    setShowImageDialog(true);
  };

  useEffect(() => {
    return () => {
      images?.forEach((image) => {
        if (image.file) {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, [images]);

  return (
    <>
      <div className="overflow-x-auto pb-2">
        <Reorder.Group
          axis="x"
          values={images || []}
          onReorder={(newOrder) => onImagesChange?.(newOrder)}
          className="flex items-center gap-2"
        >
          {(images || []).map((image) => (
            <Reorder.Item key={image.id} value={image} className="relative h-24 w-24 flex-shrink-0">
              <div className="group relative h-full w-full">
                <div className="absolute flex h-full w-full items-center justify-center rounded-md bg-gray-100">
                  <ImageIcon className="text-muted-foreground h-8 w-8" />
                </div>
                <Image
                  src={image.src}
                  alt="Pratinjau Produk"
                  fill
                  className="rounded-md object-cover"
                />
                <div className="bg-opacity-50 absolute inset-0 hidden items-center justify-center gap-2 rounded-md bg-black group-hover:flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer bg-white text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewImage(image.src);
                    }}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
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
            <ImageIcon className="text-muted-foreground h-8 w-8" />
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </Reorder.Group>
      </div>
      <DialogImagePreview
        isOpen={showImageDialog}
        onOpenChange={(open) => {
          setShowImageDialog(open);
        }}
        src={currentImagePreview}
      />
    </>
  );
}

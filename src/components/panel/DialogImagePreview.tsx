import { XIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Image from 'next/image';

type DialogImagePreviewProps = {
  isOpen: boolean;
  src: string;
  onOpenChange: (open: boolean) => void;
};

export function DialogImagePreview({ isOpen, onOpenChange, src }: DialogImagePreviewProps) {
  if (!src || !isOpen) return null;

  return (
    <Dialog>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <Button
          type="button"
          variant="ghost"
          size="default"
          className="absolute top-4 right-4 z-50 cursor-pointer text-white hover:bg-white hover:text-black"
          onClick={() => onOpenChange(false)}
        >
          <XIcon className="h-8 w-8" />
        </Button>
        <div onClick={(e) => e.stopPropagation()}>
          <TransformWrapper initialScale={0.75} minScale={0.75} maxScale={7} centerOnInit>
            <TransformComponent>
              <div className="relative h-[100vh] w-[90vw] overflow-hidden">
                <Image
                  src={src}
                  alt="Product Preview"
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                  priority
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
    </Dialog>
  );
}

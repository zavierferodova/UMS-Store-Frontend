import { PlusCircleIcon, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type MultiSkuInputProps = {
  skus: string[];
  onSkusChange: (skus: string[]) => void;
};

export function MultiSkuInput({ skus, onSkusChange }: MultiSkuInputProps) {
  const handleSkuChange = (index: number, value: string) => {
    const newSkus = [...skus];
    newSkus[index] = value;
    onSkusChange(newSkus);
  };

  const addSku = () => {
    onSkusChange([...skus, ""]);
  };

  const removeSku = (index: number) => {
    const newSkus = skus.filter((_, i) => i !== index);
    onSkusChange(newSkus);
  };

  return (
    <div className="space-y-2">
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
              type="button"
            >
              <XCircle className="h-4 w-4" />
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
          type="button"
        >
          <PlusCircleIcon size={20} />
        </Button>
      </div>
    </div>
  );
}

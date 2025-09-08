import { PlusCircleIcon, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type MultiSkuInputProps = {
  skus: string[];
  onSkusChange: (skus: string[]) => void;
  errors?: string[] | string;
};

export function MultiSkuInput({ 
  skus, 
  onSkusChange, 
  errors,
}: MultiSkuInputProps) {
  const [localTouched, setLocalTouched] = useState<boolean[]>([]);

  const handleBlur = (index: number) => {
    if (!localTouched[index]) {
      const newTouched = [...localTouched];
      newTouched[index] = true;
      setLocalTouched(newTouched);
    }
  };

  // Get error message for a specific SKU
  const getError = (index: number) => {
    if (!errors) return null;
    
    // Handle array of errors (one per SKU)
    if (Array.isArray(errors)) {
      if (index < errors.length && errors[index]) {
        return errors[index];
      }
      return null;
    }
    
    // Handle single error message
    if (typeof errors === 'string' && !skus[index] && localTouched[index]) {
      return errors;
    }
    
    return null;
  };
  
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
      {skus.map((sku, index) => {
        const error = getError(index);
        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                id={`sku-${index}`}
                placeholder="Masukkan SKU"
                value={sku}
                onChange={(e) => handleSkuChange(index, e.target.value)}
                onBlur={() => handleBlur(index)}
                className={cn("w-full", {
                  "border-destructive focus-visible:ring-destructive": error,
                })}
                aria-invalid={!!error}
              />
              {skus.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer h-9 w-9"
                  onClick={() => removeSku(index)}
                  type="button"
                  aria-label="Hapus SKU"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive" id={`sku-${index}-error`}>
                {error}
              </p>
            )}
          </div>
        );
      })}
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

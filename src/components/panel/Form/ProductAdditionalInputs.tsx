import { PlusCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AdditionalInfoItem = {
  label: string;
  value: string;
};

export type ProductAdditionalInputsProps = {
  additionalInfo: AdditionalInfoItem[];
  onAdditionalInfoChange: (info: AdditionalInfoItem[]) => void;
  errors?: Array<{
    label?: string;
    value?: string;
  }> | string;
};

export function ProductAdditionalInputs({ 
  additionalInfo, 
  onAdditionalInfoChange,
  errors 
}: ProductAdditionalInputsProps) {
  const getError = (index: number, field: 'label' | 'value') => {
    if (!errors) return null;
    
    if (Array.isArray(errors) && errors[index]) {
      return errors[index][field];
    }
    
    if (typeof errors === 'string') {
      return errors;
    }
    
    return null;
  };
  const handleAdditionalInfoChange = (
    index: number,
    field: keyof AdditionalInfoItem,
    value: string
  ) => {
    const newAdditionalInfo = [...additionalInfo];
    newAdditionalInfo[index] = {
      ...newAdditionalInfo[index],
      [field]: value
    };
    onAdditionalInfoChange(newAdditionalInfo);
  };

  const addAdditionalInfo = () => {
    onAdditionalInfoChange([...additionalInfo, { label: "", value: "" }]);
  };

  const removeAdditionalInfo = (index: number) => {
    const newAdditionalInfo = additionalInfo.filter((_, i) => i !== index);
    onAdditionalInfoChange(newAdditionalInfo);
  };

  return (
    <div className="space-y-4">
      {additionalInfo.map((item, index) => {
        const labelError = getError(index, 'label');
        const valueError = getError(index, 'value');
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1/2 space-y-1">
                <Input
                  placeholder="Label"
                  value={item.label}
                  maxLength={128}
                  onChange={(e) =>
                    handleAdditionalInfoChange(index, "label", e.target.value)
                  }
                  className={cn({
                    "border-destructive focus-visible:ring-destructive": labelError
                  })}
                  aria-invalid={!!labelError}
                />
                {labelError && (
                  <p className="text-sm font-medium text-destructive">
                    {labelError}
                  </p>
                )}
              </div>
              <div className="w-1/2 space-y-1">
                <Input
                  placeholder="Nilai"
                  value={item.value}
                  onChange={(e) =>
                    handleAdditionalInfoChange(index, "value", e.target.value)
                  }
                  maxLength={128}
                  className={cn({
                    "border-destructive focus-visible:ring-destructive": valueError
                  })}
                  aria-invalid={!!valueError}
                />
                {valueError && (
                  <p className="text-sm font-medium text-destructive">
                    {valueError}
                  </p>
                )}
              </div>
              {additionalInfo.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer h-9 w-9 mt-1"
                  onClick={() => removeAdditionalInfo(index)}
                  type="button"
                  aria-label="Hapus info tambahan"
                >
                  <XCircleIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-primary hover:text-primary/80"
          onClick={addAdditionalInfo}
          type="button"
        >
          <PlusCircleIcon size={20} />
        </Button>
      </div>
    </div>
  );
}

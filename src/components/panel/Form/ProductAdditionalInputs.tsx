import { PlusCircleIcon, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AdditionalInfoItem = {
  label: string;
  value: string;
};

export type ProductAdditionalInputsProps = {
  additionalInfo: AdditionalInfoItem[];
  onAdditionalInfoChange: (info: AdditionalInfoItem[]) => void;
};

export function ProductAdditionalInputs({ 
  additionalInfo, 
  onAdditionalInfoChange 
}: ProductAdditionalInputsProps) {
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
    <div className="space-y-2">
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
          onClick={addAdditionalInfo}
          type="button"
        >
          <PlusCircleIcon size={20} />
        </Button>
      </div>
    </div>
  );
}

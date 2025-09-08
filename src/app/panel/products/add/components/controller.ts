import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "./validation";
import { ImageFile } from "@/components/panel/Form/ProductImagesInput";
import { AdditionalInfoItem } from "@/components/panel/Form/ProductAdditionalInputs";

export const useController = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any, // Type assertion needed due to complex generic types
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      images: [] as ImageFile[],
      skus: [""],
      additionalInfo: [{ label: "", value: "" }] as AdditionalInfoItem[],
    },
  });

  const onSubmit = (data: FormValues) => {
  };

  return {
    form,
    onSubmit,
  };
};

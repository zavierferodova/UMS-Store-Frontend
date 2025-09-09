import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "./validation";
import { ImageFile } from "@/components/panel/Form/ProductImagesInput";
import { AdditionalInfoItem } from "@/components/panel/Form/ProductAdditionalInputs";

export const useController = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
    console.log(data);
  };

  return {
    form,
    onSubmit,
  };
};

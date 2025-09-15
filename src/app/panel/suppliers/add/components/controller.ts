import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import supplierData from "@/data/supplier";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { panelRoutes } from "@/routes/route";
import { FormValues, formSchema } from "./validation";


export const useController = () => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      discount: "",
      contacts: [{ name: "", phone: "" }],
    },
  });

  const onSubmit = (data: FormValues) => {
    const cleanedData = {
      ...data,
      discount: Number(data.discount),
      sales: data.contacts?.filter(contact => contact.name.trim() !== '' || contact.phone.trim() !== ''),
    };

    const promise = new Promise((resolve, reject) => {
      supplierData
        .createSupplier(cleanedData)
        .then((res) => {
          if (res) {
            resolve(res);
          } else {
            reject(new Error("Gagal menambah data pemasok"));
          }
        });
    });

    toast.promise(promise, {
      loading: "Sedang menambah data pemasok",
      success: () => {
        router.push(panelRoutes.suppliers);
        return "Data pemasok berhasil ditambah";
      },
      error: "Gagal menambah data pemasok",
    });
  };

  return {
    form,
    onSubmit,
  };
};

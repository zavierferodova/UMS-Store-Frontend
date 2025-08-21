import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import supplierData from "@/data/supplier";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { panelRoutes } from "@/routes/route";

const formSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  phone: z
    .string()
    .min(1, "No telp tidak boleh kosong")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
  email: z.string().email("Email tidak valid").or(z.literal("")).optional(),
  address: z.string().min(1, "Alamat tidak boleh kosong"),
  discount: z
    .string()
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((val) => val >= 0 && val <= 100, {
      message: "Diskon harus antara 0–100",
    })
    .transform(val => val.toString()),
});

export const useController = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      discount: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const promise = new Promise((resolve, reject) => {
      supplierData
        .createSupplier({
          ...data,
          discount: Number(data.discount),
        })
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

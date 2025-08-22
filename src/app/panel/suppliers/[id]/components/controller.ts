import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Supplier } from "@/domain/model/supplier";
import supplierData from "@/data/supplier";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  phone: z
    .string()
    .min(1, "No telp tidak boleh kosong")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
  email: z.email("Email tidak valid").or(z.string().optional()),
  address: z.string().min(1, "Alamat tidak boleh kosong"),
  discount: z
    .string()
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((val) => val >= 0 && val <= 100, {
      message: "Diskon harus antara 0–100",
    })
    .transform((val) => val.toString()),
  active: z.boolean(),
});

export const useController = (supplier: Supplier | null) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      discount: "",
      active: true,
    },
  });
  const user = session?.user;

  useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email || "",
        address: supplier.address || "",
        discount: supplier.discount?.toString() || "",
        active: !supplier.is_deleted,
      });
    }
  }, [supplier, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (supplier) {
      const promise = new Promise((resolve, reject) => {
        supplierData
          .updateSupplier(supplier.id, {
            ...data,
            discount: Number(data.discount),
            is_deleted: !data.active,
          })
          .then((res) => {
            if (res) {
              resolve(res);
            } else {
              reject(new Error("Gagal mengubah data pemasok"));
            }
          });
      });

      toast.promise(promise, {
        loading: "Sedang mengubah data pemasok",
        success: "Data pemasok berhasil diubah",
        error: "Gagal mengubah data pemasok",
      });
    }
  };

  const onDelete = () => {
    if (supplier) {
      const promise = new Promise((resolve, reject) => {
        supplierData.deleteSupplier(supplier.id).then((success) => {
          if (success) {
            resolve("Data pemasok berhasil dihapus");
          } else {
            reject(new Error("Gagal menghapus data pemasok"));
          }
        });
      });

      toast.promise(promise, {
        loading: "Sedang menghapus data pemasok",
        success: (message) => {
          router.push("/panel/suppliers");
          return message as string;
        },
        error: "Gagal menghapus data pemasok",
      });
    }
  };

  return {
    user,
    form,
    onSubmit,
    open,
    setOpen,
    onDelete,
  };
};

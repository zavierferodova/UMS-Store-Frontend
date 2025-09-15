import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Supplier } from "@/domain/model/supplier";
import supplierData from "@/data/supplier";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formSchema, FormValues } from "./validation";

export const useController = (supplier: Supplier | null) => {
  const { data: session } = useSession();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      discount: "",
      active: true,
      contacts: [],
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
        contacts: supplier.sales?.map(contact => ({
          name: contact.name,
          phone: contact.phone,
        })) || [],
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
            sales: data.contacts?.map(contact => ({
              name: contact.name,
              phone: contact.phone,
            })) || [],
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
    deleteDialogOpen,
    setDeleteDialogOpen,
    onSubmit,
    onDelete,
  };
};

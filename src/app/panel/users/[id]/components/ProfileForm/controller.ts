import userData from "@/data/user";
import { User } from "@/domain/model/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  gender: z.enum(["male", "female"]).or(z.string().optional()),
  phone: z.string().regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka").or(z.string().optional()),
  address: z.string().optional(),
});

export const useController = (user: User | null) => {
  const { data: session } = useSession()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (user) {
      const promise = new Promise((resolve, reject) => {
        userData
          .updateUser(user.id.toString(), {
            name: data.name,
            gender: data.gender,
            phone: data.phone || undefined,
            address: data.address || undefined,
          })
          .then((user) => {
            if (user) {
              resolve(user);
            } else {
              reject("Gagal memperbaharui akun");
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

      toast.promise(promise, {
        loading: "Sedang memperbaharui akun",
        success: () => {
          return "Akun berhasil diperbarui!";
        },
        error: "Gagal memperbarui akun!",
      });
    }
  };

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        gender:
          user.gender == null ? undefined : (user.gender as "male" | "female"),
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  return { session, form, onSubmit };
};

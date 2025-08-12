import authData from "@/data/auth";
import { User } from "@/domain/model/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female"]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const useController = () => {
  const { update: updateSession, data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      phone: "",
      address: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const promise = new Promise((resolve, reject) => {
      authData
        .updateUser(data)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Gagal memperbarui profile"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(promise as Promise<User|null>, {
      loading: "Sedang memperbaharui profile",
      success: async (data: User|null) => {
        updateSession({
          user: data
        });
        return "Profile berhasil diperbarui!";
      },
      error: "Gagal memperbarui profile!",
    });
  };

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        gender:
          session.user.gender == null
            ? undefined
            : (session.user.gender as "male" | "female"),
        phone: session.user.phone || "",
        address: session.user.address || "",
      });
    }
  }, [session, form]);

  return { form, onSubmit };
};

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect } from "react"
import { panelRoutes } from "@/routes/route"

const formSchema = z.object({
    username: z.string().min(1, { message: "Username tidak boleh kosong" }),
    password: z.string().min(1, { message: "Password tidak boleh kosong" }),
})

export function useController() {
    const router = useRouter()
    const { status } = useSession()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
        })

        if (result?.ok) {
            router.push(panelRoutes.home)
        } else {
            toast.error("Username atau password salah!", {
                position: "top-center"
            })
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            router.push(panelRoutes.home)
        }
    }, [status, router])

    return { form, onSubmit }
}

import { formSchema as supplierFormSchema } from "@/app/panel/suppliers/add/components/validation";
import * as z from "zod";

export const formSchema = supplierFormSchema.extend({ 
    active: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;
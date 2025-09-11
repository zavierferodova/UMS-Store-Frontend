import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "./validation";
import productData from "@/data/product";
import { toast } from "sonner";
import { Product } from "@/domain/model/product";

export const useController = (product: Product) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?.id,
      images: product.images.map(image => ({ id: image.id, src: image.image })),
      skus: product.skus.map(sku => ({ id: sku.id, sku: sku.sku })),
      additionalInfo: (!product.additional_info || product.additional_info.length === 0) ? [{ label: "", value: "" }] : product.additional_info.map(info => ({ label: info.label, value: info.value }))
    },
  });

  const updateProductForm = async () => {
    const promise = new Promise<Product>((resolve, reject) => {
      productData.getProduct(product.id).then((response) => {
        if (response) {
          resolve(response);
        } else {
          reject(new Error("Gagal memuat produk"));
        }
      });
    });

    toast.promise(promise, {
      loading: "Memuat data baru...",
      success: (product) => {
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category?.id,
          images: product.images.map(image => ({ id: image.id, src: image.image })),
          skus: product.skus.map(sku => ({ id: sku.id, sku: sku.sku })),
          additionalInfo: (!product.additional_info || product.additional_info.length === 0) ? [{ label: "", value: "" }] : product.additional_info.map(info => ({ label: info.label, value: info.value }))
        });
        return "Produk berhasil dimuat"
      },
      error: "Gagal memuat produk",
    });
  };

  const onSubmit = async (data: FormValues) => {
    const promise = new Promise(async (resolve, reject) => {
      const oldSkus = data.skus.filter(sku => sku.id);
      const newSkus = data.skus.filter(sku => !sku.id);

      const updatedProduct = await productData.updateProduct(product.id, {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        images: data.images.map(img => ({ id: img.id, file: img.file, src: img.src })),
        skus: [...oldSkus, ...newSkus],
        additional_info: data.additionalInfo?.map((info) => ({ label: info.label, value: info.value })) || [],
      })

      if (updatedProduct) {
        resolve(updatedProduct);
      } else {
        reject(new Error("Gagal memperbarui produk"));
      }
    });

    toast.promise(promise, {
      loading: "Memperbarui produk...",
      success: () => {
        updateProductForm();
        return "Produk berhasil diperbarui";
      },
      error: "Gagal memperbarui produk",
    });
  };

  return {
    form,
    onSubmit,
  };
};
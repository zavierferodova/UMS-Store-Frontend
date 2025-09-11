"use client";
import { usePanelHeader } from "@/components/panel/Header";
import { panelRoutes } from "@/routes/route";
import { useEffect } from "react";
import { ProductDetailForm } from "./components/ProductDetailForm";
import { Product } from "@/domain/model/product";

export type ProductPageContainerProps = {
    product: Product
}

export function ProductPageContainer({ product }: ProductPageContainerProps) {
  const { setMenu } = usePanelHeader();

  useEffect(() => {
    setMenu([
      {
        name: "Beranda",
        href: panelRoutes.home,
      },
      {
        name: "Produk",
        href: panelRoutes.products,
      },
      {
        name: "Detail",
        href: "",
      },
    ]);
  }, [setMenu]);

  return (
    <ProductDetailForm product={product} />
  );
}

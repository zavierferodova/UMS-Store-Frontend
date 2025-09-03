"use client";
import { usePanelHeader } from "@/components/panel/Header";
import { useEffect } from "react";
import { panelRoutes } from "@/routes/route";
import { AddProductForm } from "./components/AddProductForm";

export default function AddProductPage() {
  const { setMenu } = usePanelHeader();
  useEffect(() => {
    setMenu([
      {
        name: "Produk",
        href: panelRoutes.products,
      },
      {
        name: "Tambah Produk",
        href: panelRoutes.addProduct,
      },
    ]);
  }, [setMenu]);

  return (
    <AddProductForm />
  )
}

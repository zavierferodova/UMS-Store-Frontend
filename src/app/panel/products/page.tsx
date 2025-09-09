"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Paginated } from "@/components/pagination/Paginated";
import { usePanelHeader } from "@/components/panel/Header";
import { useEffect } from "react";
import { panelRoutes } from "@/routes/route";
import { useController } from "./controller";
import { ProductsTableSkeleton } from "@/components/skeleton/ProductsTableSkeleton";
import { PageStatus } from "@/lib/page";
import { EmptyDisplay } from "@/components/display/EmptyDisplay";
import { ProductsTable } from "./components/ProductsTable";
import { Button } from "@/components/ui/button";
import { PlusIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function ProductsPage() {
  const {
    search,
    status,
    products,
    updatePage,
    updateLimit,
    updateSearch,
  } = useController();
  const { setMenu } = usePanelHeader();
  const isEmpty = status == PageStatus.SUCCESS && products.data.length == 0;

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
    ]);
  }, [setMenu]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Daftar Produk</CardTitle>
            <CardDescription>Daftar semua produk yang terdaftar di sistem</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                onChange={(e) => updateSearch(e.target.value)}
                value={search}
                placeholder="Cari produk"
                className="pl-10 w-full md:w-64"
              />
            </div>
            <Button className="cursor-pointer w-full md:w-auto" variant="default" asChild>
              <Link href={panelRoutes.addProduct} className="flex items-center justify-center">
                <PlusIcon className="h-4 w-4" />
                <span className="ml-1">Tambah</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status == PageStatus.LOADING ? (
          <ProductsTableSkeleton />
        ) : (
          <ProductsTable products={products} />
        )}
        {isEmpty && (
          <div className="mt-8 mb-8">
            <EmptyDisplay
              title="Kosong"
              description={
                search ? "Tidak ada data yang ditemukan" : "Belum ada produk yang terdaftar"
              }
            />
          </div>
        )}
        {!isEmpty && (
          <Paginated
            meta={products.meta}
            onPageChange={(page) => updatePage(page)}
            onLimitChange={(limit) => updateLimit(limit)}
          />
        )}
      </CardContent>
    </Card>
  );
}

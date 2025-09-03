"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="flex justify-between items-center">
          <CardTitle>Daftar Produk</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                onChange={(e) => updateSearch(e.target.value)}
                value={search}
                placeholder="Cari produk"
                className="pl-10"
              />
            </div>
            <Button className="cursor-pointer" variant="default" asChild>
              <Link href={panelRoutes.addProduct}>
                <PlusIcon/> Tambah
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status == PageStatus.LOADING ? (
          <ProductsTableSkeleton />
        ) : (
          <ProductsTable products={{
            content: products.data,
            number: products.meta.page,
            size: products.meta.limit,
            totalElements: products.meta.total,
            totalPages: Math.ceil(products.meta.total / products.meta.limit),
          }} />
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

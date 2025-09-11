import { productDataServer } from "@/data/product";
import { ProductPageContainer } from "./container";
import { PanelNotFound } from "@/components/panel/PanelNotFound";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await productDataServer.getProduct(id);

  if (!product) {
    return (
      <PanelNotFound message="Produk tidak dapat dimuat!"/>
    )
  }

  return (
    <ProductPageContainer product={product} />
  )
}

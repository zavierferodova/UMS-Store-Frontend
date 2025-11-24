import { productDataServer } from '@/data/product';
import { ProductPageContainer } from './container';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productDataServer.getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductPageContainer product={product} />;
}

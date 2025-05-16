import { notFound } from "next/navigation";

import { ProductDialog } from "@/app/(example)/example-03/@dialog/(.)products/[id]/_components/product-dialog";
import { products } from "@/features/products/data";

export default async function InterceptedProductDialog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return <ProductDialog product={product} />;
}

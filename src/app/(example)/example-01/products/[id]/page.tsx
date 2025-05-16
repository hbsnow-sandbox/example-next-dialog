import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetails } from "@/features/products/components/product-details";
import { products } from "@/features/products/data";

export default async function Page({
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

  return (
    <>
      <Link
        href="/example-01"
        className="mb-6 inline-flex items-center text-sm hover:underline"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        商品一覧に戻る
      </Link>

      <ProductDetails
        productTitle={
          <h1 className="mb-2 text-2xl font-medium">{product.name}</h1>
        }
        product={product}
      />
    </>
  );
}

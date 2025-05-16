import { Suspense } from "react";

import { products } from "@/features/products/data";

import { ProductCard } from "./_components/product-card";
import { ProductDialog } from "./_components/product-dialog";

export default function Page() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-medium">商品一覧</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Suspense fallback={<>Loading...</>}>
        <ProductDialog />
      </Suspense>
    </>
  );
}

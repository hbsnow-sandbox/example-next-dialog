import Link from "next/link";

import { ProductCard } from "@/features/products/components/product-card";
import { products } from "@/features/products/data";

export default function Page() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-medium">商品一覧</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} href={`/example-01//products/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";

import type { Product } from "@/features/products/data";

import { ProductCard as ProductCardOrigin } from "@/features/products/components/product-card";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(`/example-02?id=${product.id}`);
      }}
      className="group cursor-pointer"
    >
      <ProductCardOrigin product={product} />
    </button>
  );
}

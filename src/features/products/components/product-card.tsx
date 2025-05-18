"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import type { Product } from "../data";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(`/?id=${product.id}`);
      }}
      className="group cursor-pointer"
    >
      <div className="overflow-hidden rounded-lg border transition-all hover:shadow-md">
        <div className="flex items-center justify-center bg-gray-50 p-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="h-48 w-auto object-contain"
          />
        </div>
        <div className="p-4">
          <h2 className="font-medium group-hover:text-gray-700">
            {product.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>
          <p className="mt-2 font-bold">¥{product.price.toLocaleString()}</p>
        </div>
      </div>
    </button>
  );
}

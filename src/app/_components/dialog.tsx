"use client";

import type React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { Product } from "@/features/products/data";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductDetails } from "@/features/products/components/product-details";
import { products } from "@/features/products/data";

export function ProductDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [product, setProduct] = useState<Product>();

  const id = searchParams.get("id");

  useEffect(() => {
    const productId = Number(id);
    const result = products.find((p) => p.id === productId);

    setProduct(result);
  }, [id]);

  return (
    <Dialog
      open={!!product}
      onOpenChange={(open) => {
        if (!open) {
          router.replace(pathname);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-2xl lg:max-w-4xl"
        aria-describedby={undefined}
      >
        {product ? (
          <ProductDetails
            productTitle={
              <DialogHeader>
                <DialogTitle className="mb-2 text-2xl font-medium">
                  {product.name}
                </DialogTitle>
              </DialogHeader>
            }
            product={product}
          />
        ) : (
          "loading"
        )}
      </DialogContent>
    </Dialog>
  );
}

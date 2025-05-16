"use client";

import { useRouter } from "next/navigation";

import type { Product } from "@/features/products/data";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductDetails } from "@/features/products/components/product-details";

export function ProductDialog({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-2xl lg:max-w-4xl"
        aria-describedby={undefined}
      >
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
      </DialogContent>
    </Dialog>
  );
}

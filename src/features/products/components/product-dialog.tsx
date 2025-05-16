"use client";

import type React from "react";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Product } from "../data";

import { ProductDetails } from "./product-details";

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

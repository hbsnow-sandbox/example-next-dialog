import { ShoppingCart } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Product } from "../data";

export function ProductDetails({
  product,
  productTitle,
}: {
  product: Product;
  productTitle: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex items-center justify-center rounded-lg bg-gray-50 p-4">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={500}
          height={500}
          className="h-auto max-w-full"
        />
      </div>
      <div>
        {productTitle}
        <p className="mb-4 text-xl font-bold">
          ¥{product.price.toLocaleString()}
        </p>
        <div className="mb-6">
          <p className="mb-4 text-gray-700">{product.description}</p>

          <ul className="space-y-2">
            {product.details?.map((detail, index) => (
              <li key={index} className="text-sm text-gray-600">
                {detail}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          {product?.size && product.size.length > 0 && (
            <div className="flex items-center space-x-4">
              <label htmlFor="size" className="w-12 text-sm font-medium">
                サイズ:
              </label>
              <Select>
                <SelectTrigger id="size">
                  <SelectValue placeholder="サイズを選択" />
                </SelectTrigger>
                <SelectContent>
                  {product.size.map((item) => {
                    return (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="w-12 text-sm font-medium">
              数量:
            </label>

            <Select>
              <SelectTrigger id="quantity">
                <SelectValue placeholder="個数を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            カートに追加
          </Button>
        </div>
      </div>
    </div>
  );
}

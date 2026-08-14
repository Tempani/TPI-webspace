"use client";

import Image from "next/image";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { getProductPriceLabel, getProductThumbnail } from "@/lib/products";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

export function ProductCard({
  product,
}: {
  product: HttpTypes.StoreProduct;
  index?: number;
}) {
  const image = getProductThumbnail(product);
  const price = getProductPriceLabel(product);
  const href = `/products/${product.handle}`;

  return (
    <article className="group animate-[fadeUp_0.5s_ease-out]">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-blush)]">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
            <Image
              src={image}
              alt={product.title || "Product"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="absolute right-3 top-3 z-10">
            <WishlistButton product={product} />
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-[family-name:var(--font-serif)] text-xl leading-tight text-[var(--color-ink)]">
            {product.title}
          </h3>
          <p className="text-sm text-[var(--color-muted)]">{price}</p>
        </div>
      </Link>
    </article>
  );
}

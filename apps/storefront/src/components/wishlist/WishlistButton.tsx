"use client";

import { useEffect, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";
import {
  getProductPriceLabel,
  getProductThumbnail,
} from "@/lib/products";
import {
  isInWishlist,
  toggleWishlistItem,
} from "@/lib/wishlist";

export function WishlistButton({
  product,
  className,
}: {
  product: HttpTypes.StoreProduct;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isInWishlist(product.id));
    const sync = () => setActive(isInWishlist(product.id));
    window.addEventListener("tempani:wishlist", sync);
    return () => window.removeEventListener("tempani:wishlist", sync);
  }, [product.id]);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={clsx(
        "flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--color-border)] bg-white/90 text-sm transition hover:border-[var(--color-accent)]",
        active && "border-[var(--color-accent)] text-[var(--color-accent)]",
        className
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlistItem({
          id: product.id,
          handle: product.handle || product.id,
          title: product.title || "Product",
          thumbnail: getProductThumbnail(product),
          priceLabel: getProductPriceLabel(product),
        });
      }}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}

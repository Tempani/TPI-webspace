"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  getWishlist,
  removeWishlistItem,
  type WishlistItem,
} from "@/lib/wishlist";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getWishlist());
    sync();
    window.addEventListener("tempani:wishlist", sync);
    return () => window.removeEventListener("tempani:wishlist", sync);
  }, []);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <h1 className="mb-8 font-[family-name:var(--font-serif)] text-5xl">
          Wishlist
        </h1>
        <EmptyState
          title="Nothing saved yet"
          description="Tap the heart on a product to keep it here."
          actionHref="/shop"
          actionLabel="Browse the collection"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-5xl">Wishlist</h1>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="border border-[var(--color-border)] bg-white"
          >
            <Link href={`/products/${item.handle}`} className="block">
              <div className="relative aspect-[4/5] bg-[var(--color-blush)]">
                <Image
                  src={item.thumbnail || PLACEHOLDER_IMAGE}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h2 className="font-[family-name:var(--font-serif)] text-2xl">
                  {item.title}
                </h2>
                {item.priceLabel ? (
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {item.priceLabel}
                  </p>
                ) : null}
              </div>
            </Link>
            <div className="border-t border-[var(--color-border)] px-4 py-3">
              <Button
                variant="link"
                onClick={() => removeWishlistItem(item.id)}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

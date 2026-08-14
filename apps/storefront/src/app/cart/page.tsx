"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const items = cart?.items || [];
  const currency = cart?.currency_code || "eur";

  if (loading) {
    return (
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-5 py-20 md:px-10">
        <Spinner />
        <span className="text-sm text-[var(--color-muted)]">Loading bag…</span>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <h1 className="mb-8 font-[family-name:var(--font-serif)] text-5xl">
          Your bag
        </h1>
        <EmptyState
          title="Your bag is empty"
          description="Discover the collection and add pieces you love."
          actionHref="/shop"
          actionLabel="Continue shopping"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-5xl">Your bag</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
        <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-6 md:gap-6">
              <div className="relative h-28 w-24 overflow-hidden bg-[var(--color-blush)] md:h-36 md:w-28">
                <Image
                  src={item.thumbnail || PLACEHOLDER_IMAGE}
                  alt={item.title || "Product"}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.product_handle || ""}`}
                      className="font-[family-name:var(--font-serif)] text-2xl"
                    >
                      {item.product_title || item.title}
                    </Link>
                    {item.variant_title ? (
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {item.variant_title}
                      </p>
                    ) : null}
                  </div>
                  <p className="text-sm">{formatMoney(item.total, currency)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="inline-flex items-center border border-[var(--color-border)]">
                    <button
                      type="button"
                      className="px-3 py-1"
                      onClick={() =>
                        void updateItem(
                          item.id,
                          Math.max(1, (item.quantity || 1) - 1)
                        )
                      }
                    >
                      −
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="px-3 py-1"
                      onClick={() =>
                        void updateItem(item.id, (item.quantity || 0) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]"
                    onClick={() => void removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Summary
          </h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Subtotal</span>
              <span>{formatMoney(cart?.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Shipping</span>
              <span>
                {cart?.shipping_total
                  ? formatMoney(cart.shipping_total, currency)
                  : "Calculated at checkout"}
              </span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-base">
              <span>Total</span>
              <span>{formatMoney(cart?.total, currency)}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full">Proceed to checkout</Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}

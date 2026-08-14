"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { clsx } from "clsx";

export function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateItem,
    removeItem,
    loading,
  } = useCart();

  const items = cart?.items || [];
  const currency = cart?.currency_code || "eur";

  return (
    <>
      <button
        type="button"
        aria-label="Close cart"
        className={clsx(
          "fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300",
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeDrawer}
      />
      <aside
        className={clsx(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300",
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Your bag
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-[11px] uppercase tracking-[0.16em]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <p className="text-sm text-[var(--color-muted)]">Loading…</p>
          ) : items.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-muted)]">
                Your bag is empty.
              </p>
              <Link href="/shop" onClick={closeDrawer}>
                <Button variant="secondary">Continue shopping</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative h-24 w-20 overflow-hidden bg-[var(--color-blush)]">
                    <Image
                      src={item.thumbnail || PLACEHOLDER_IMAGE}
                      alt={item.title || "Product"}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-[family-name:var(--font-serif)] text-lg leading-tight">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {formatMoney(item.unit_price, currency)}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center border border-[var(--color-border)]">
                        <button
                          type="button"
                          className="px-2 py-1"
                          onClick={() =>
                            updateItem(item.id, Math.max(1, (item.quantity || 1) - 1))
                          }
                        >
                          −
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-2 py-1"
                          onClick={() =>
                            updateItem(item.id, (item.quantity || 1) + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] px-6 py-5">
          <div className="mb-4 flex justify-between text-sm">
            <span className="text-[var(--color-muted)]">Subtotal</span>
            <span>{formatMoney(cart?.subtotal || 0, currency)}</span>
          </div>
          <Link href="/checkout" onClick={closeDrawer}>
            <Button className="w-full" disabled={!items.length}>
              Checkout
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

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
    <AnimatePresence>
      {isDrawerOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[60] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
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
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-[family-name:var(--font-serif)] text-lg leading-tight">
                              {item.product_title || item.title}
                            </p>
                            {item.variant_title ? (
                              <p className="mt-1 text-xs text-[var(--color-muted)]">
                                {item.variant_title}
                              </p>
                            ) : null}
                          </div>
                          <p className="text-sm">
                            {formatMoney(item.total, currency)}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-[var(--color-border)]">
                            <button
                              type="button"
                              className="px-3 py-1 text-sm"
                              onClick={() =>
                                void updateItem(
                                  item.id,
                                  Math.max(1, (item.quantity || 1) - 1)
                                )
                              }
                            >
                              −
                            </button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              className="px-3 py-1 text-sm"
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
              )}
            </div>

            <div className="border-t border-[var(--color-border)] px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted)]">Subtotal</span>
                <span>{formatMoney(cart?.subtotal, currency)}</span>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/cart" onClick={closeDrawer}>
                  <Button variant="secondary" className="w-full">
                    View bag
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeDrawer}>
                  <Button className="w-full" disabled={!items.length}>
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

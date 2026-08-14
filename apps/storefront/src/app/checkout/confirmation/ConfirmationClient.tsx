"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatMoney } from "@/lib/format";
import { getAuthHeaders, sdk } from "@/lib/medusa";
import { AUTH_TOKEN_KEY } from "@/lib/constants";

export default function ConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!orderId) {
        setError("Missing order reference.");
        setLoading(false);
        return;
      }

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem(AUTH_TOKEN_KEY)
            : null;
        const { order: next } = await sdk.store.order.retrieve(
          orderId,
          { fields: "*items,*shipping_address" },
          getAuthHeaders(token)
        );
        setOrder(next);
      } catch {
        // Guest retrieval may fail depending on backend config — show id fallback
        setOrder({ id: orderId } as HttpTypes.StoreOrder);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16">
        <Spinner />
        <span className="text-sm text-[var(--color-muted)]">
          Loading confirmation…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl">
          Confirmation unavailable
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">{error}</p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  const currency = order?.currency_code || "eur";

  return (
    <div className="py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Thank you
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-serif)] text-5xl">
        Order confirmed
      </h1>
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        Your order{" "}
        <span className="text-[var(--color-ink)]">
          {order?.display_id ? `#${order.display_id}` : order?.id}
        </span>{" "}
        has been received.
      </p>

      {order?.items?.length ? (
        <div className="mt-10 border border-[var(--color-border)]">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl">
              Summary
            </h2>
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-5 py-4 text-sm"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{formatMoney(item.total, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-[var(--color-border)] px-5 py-4 text-sm">
            <span>Total</span>
            <span>{formatMoney(order.total, currency)}</span>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex gap-3">
        <Link href="/shop">
          <Button>Continue shopping</Button>
        </Link>
        <Link href="/account/orders">
          <Button variant="secondary">View orders</Button>
        </Link>
      </div>
    </div>
  );
}

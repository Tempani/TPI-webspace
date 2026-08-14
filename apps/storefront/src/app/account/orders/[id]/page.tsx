"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/format";
import { getAuthHeaders, sdk } from "@/lib/medusa";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { customer, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !customer) {
      router.replace("/account/login");
    }
  }, [authLoading, customer, router]);

  useEffect(() => {
    async function load() {
      if (!token || !params.id) return;
      try {
        const { order: next } = await sdk.store.order.retrieve(
          params.id,
          { fields: "*items,*shipping_address,*billing_address" },
          getAuthHeaders(token)
        );
        setOrder(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Order not found.");
      } finally {
        setLoading(false);
      }
    }
    if (token) void load();
  }, [token, params.id]);

  if (authLoading || loading || !customer) {
    return (
      <div className="mx-auto flex max-w-[900px] items-center gap-3 px-5 py-20 md:px-10">
        <Spinner />
        <span className="text-sm text-[var(--color-muted)]">Loading order…</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-16 md:px-10">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl">
          Order unavailable
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {error || "We couldn’t find that order."}
        </p>
        <Link href="/account/orders" className="mt-6 inline-block underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const currency = order.currency_code || "eur";

  return (
    <div className="mx-auto max-w-[900px] px-5 py-12 md:px-10 md:py-16">
      <Link
        href="/account/orders"
        className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]"
      >
        ← Orders
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl">
        Order #{order.display_id || order.id.slice(0, 8)}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Placed{" "}
        {order.created_at
          ? new Date(order.created_at).toLocaleString("en-GB")
          : "—"}
      </p>

      <div className="mt-10 border border-[var(--color-border)]">
        <ul className="divide-y divide-[var(--color-border)]">
          {(order.items || []).map((item) => (
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
        <div className="space-y-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Subtotal</span>
            <span>{formatMoney(order.subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Shipping</span>
            <span>{formatMoney(order.shipping_total, currency)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>Total</span>
            <span>{formatMoney(order.total, currency)}</span>
          </div>
        </div>
      </div>

      {order.shipping_address ? (
        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Shipping address
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
            {order.shipping_address.first_name} {order.shipping_address.last_name}
            <br />
            {order.shipping_address.address_1}
            <br />
            {order.shipping_address.postal_code} {order.shipping_address.city}
            <br />
            {order.shipping_address.country_code?.toUpperCase()}
          </p>
        </div>
      ) : null}
    </div>
  );
}

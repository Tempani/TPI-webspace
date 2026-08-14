"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/format";
import { getAuthHeaders, sdk } from "@/lib/medusa";

export default function OrdersPage() {
  const { customer, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<HttpTypes.StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !customer) {
      router.replace("/account/login");
    }
  }, [authLoading, customer, router]);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const { orders: next } = await sdk.store.order.list(
          { limit: 50, fields: "*items" },
          getAuthHeaders(token)
        );
        setOrders(next);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    if (token) void load();
  }, [token]);

  if (authLoading || loading || !customer) {
    return (
      <div className="mx-auto flex max-w-[900px] items-center gap-3 px-5 py-20 md:px-10">
        <Spinner />
        <span className="text-sm text-[var(--color-muted)]">Loading orders…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-5 py-12 md:px-10 md:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Account
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-serif)] text-5xl">
            Orders
          </h1>
        </div>
        <Link
          href="/account"
          className="text-[11px] uppercase tracking-[0.14em] underline-offset-4 hover:underline"
        >
          Back
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionHref="/shop"
          actionLabel="Start shopping"
        />
      ) : (
        <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-4 py-5">
              <div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="font-[family-name:var(--font-serif)] text-2xl"
                >
                  Order #{order.display_id || order.id.slice(0, 8)}
                </Link>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-GB")
                    : "—"}{" "}
                  · {order.status || "received"}
                </p>
              </div>
              <p className="text-sm">
                {formatMoney(order.total, order.currency_code || "eur")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

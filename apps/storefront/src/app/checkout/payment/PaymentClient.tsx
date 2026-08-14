"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useCart } from "@/context/CartContext";
import { completeCart, getStoredCartId } from "@/lib/cart";

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, refreshCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Confirming your payment…");

  useEffect(() => {
    let cancelled = false;

    async function finalize() {
      const cartId = getStoredCartId();
      if (!cartId) {
        setStatus("error");
        setMessage("No cart was found for this payment session.");
        return;
      }

      try {
        const mollieStatus = searchParams.get("status");
        if (
          mollieStatus &&
          ["failed", "canceled", "expired"].includes(mollieStatus)
        ) {
          setStatus("error");
          setMessage(
            "Payment was not completed. You can return to checkout and try again."
          );
          return;
        }

        const result = await completeCart();
        if (cancelled) return;

        if (result.type === "order" && result.order) {
          clearCart();
          setStatus("success");
          setMessage("Payment received. Redirecting to your confirmation…");
          router.replace(`/checkout/confirmation?order_id=${result.order.id}`);
          return;
        }

        if (result.type === "cart") {
          await refreshCart();
          setStatus("error");
          setMessage(
            "Payment is still pending or could not be authorized. Please try again."
          );
          return;
        }

        setStatus("error");
        setMessage("Unexpected checkout response. Please contact support.");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "We could not complete your order after payment."
        );
      }
    }

    void finalize();
    return () => {
      cancelled = true;
    };
  }, [clearCart, refreshCart, router, searchParams]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[720px] flex-col items-start justify-center px-5 py-20 md:px-10">
      {status === "loading" ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <p className="text-sm text-[var(--color-muted)]">{message}</p>
        </div>
      ) : null}

      {status === "success" ? (
        <>
          <h1 className="font-[family-name:var(--font-serif)] text-4xl">
            Payment confirmed
          </h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{message}</p>
        </>
      ) : null}

      {status === "error" ? (
        <>
          <h1 className="font-[family-name:var(--font-serif)] text-4xl">
            Payment incomplete
          </h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{message}</p>
          <div className="mt-8 flex gap-3">
            <Link href="/checkout">
              <Button>Return to checkout</Button>
            </Link>
            <Link href="/cart">
              <Button variant="secondary">View bag</Button>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

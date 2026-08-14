import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentClient from "./PaymentClient";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Payment",
  robots: { index: false, follow: false },
};

export default function CheckoutPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-3 px-5 py-20 md:px-10">
          <Spinner />
          <span className="text-sm text-[var(--color-muted)]">Loading…</span>
        </div>
      }
    >
      <PaymentClient />
    </Suspense>
  );
}

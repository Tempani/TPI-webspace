import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-5xl text-[var(--color-ink)]">
        Checkout
      </h1>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}

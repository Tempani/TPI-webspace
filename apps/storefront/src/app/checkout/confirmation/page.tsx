import { Suspense } from "react";
import type { Metadata } from "next";
import ConfirmationClient from "./ConfirmationClient";
import { Spinner } from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-[900px] px-5 py-12 md:px-10 md:py-16">
      <Suspense
        fallback={
          <div className="flex items-center gap-3 py-16">
            <Spinner />
            <span className="text-sm text-[var(--color-muted)]">Loading…</span>
          </div>
        }
      >
        <ConfirmationClient />
      </Suspense>
    </div>
  );
}

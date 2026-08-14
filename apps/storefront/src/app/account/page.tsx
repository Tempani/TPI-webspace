"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { customer, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) {
      router.replace("/account/login");
    }
  }, [customer, loading, router]);

  if (loading || !customer) {
    return (
      <div className="mx-auto flex max-w-[900px] items-center gap-3 px-5 py-20 md:px-10">
        <Spinner />
        <span className="text-sm text-[var(--color-muted)]">Loading account…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-5 py-12 md:px-10 md:py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-5xl">Account</h1>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        Signed in as {customer.email}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]"
        >
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Orders
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            View your order history and details.
          </p>
        </Link>
        <Link
          href="/wishlist"
          className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]"
        >
          <h2 className="font-[family-name:var(--font-serif)] text-2xl">
            Wishlist
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Pieces you’ve saved for later.
          </p>
        </Link>
      </div>

      <div className="mt-10">
        <Button
          variant="secondary"
          onClick={() => {
            void logout().then(() => router.push("/"));
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}

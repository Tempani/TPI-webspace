import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <p className="font-[family-name:var(--font-serif)] text-3xl tracking-[0.22em] text-[var(--color-ink)]">
            {SITE_NAME}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
            {SITE_TAGLINE}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink)]">
            Explore
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--color-muted)]">
            <Link href="/shop">Shop</Link>
            <Link href="/search">Search</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Cart</Link>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink)]">
            Account
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--color-muted)]">
            <Link href="/account">Dashboard</Link>
            <Link href="/account/orders">Orders</Link>
            <Link href="/account/login">Sign in</Link>
            <Link href="/checkout">Checkout</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-5 text-xs text-[var(--color-muted)] md:flex-row md:items-center md:justify-between md:px-10">
          <p>© {new Date().getFullYear()} Tempani. All rights reserved.</p>
          <p>Crafted for considered living.</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getWishlist } from "@/lib/wishlist";

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCart();
  const { customer } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sync = () => setWishlistCount(getWishlist().length);
    sync();
    window.addEventListener("tempani:wishlist", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tempani:wishlist", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-10">
        <button
          type="button"
          className="md:hidden text-[11px] uppercase tracking-[0.18em]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink)]"
              >
                {link.label}
                <span
                  className={clsx(
                    "absolute -bottom-1 left-0 h-px bg-[var(--color-accent)] transition-all duration-250",
                    active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--font-serif)] text-2xl tracking-[0.28em] text-[var(--color-ink)] md:text-[1.75rem]"
        >
          {SITE_NAME}
        </Link>

        <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.18em]">
          <Link
            href={customer ? "/account" : "/account/login"}
            className="hidden sm:inline"
          >
            {customer ? "Account" : "Sign in"}
          </Link>
          <Link href="/wishlist" className="relative">
            Wish
            {wishlistCount > 0 ? (
              <span className="absolute -right-3 -top-2 text-[10px] text-[var(--color-accent)]">
                {wishlistCount}
              </span>
            ) : null}
          </Link>
          <button type="button" onClick={openDrawer} className="relative">
            Bag
            {itemCount > 0 ? (
              <span className="absolute -right-3 -top-2 text-[10px] text-[var(--color-accent)]">
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "border-t border-[var(--color-border)] bg-white md:hidden",
          menuOpen ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-4 px-5 py-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] uppercase tracking-[0.18em]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={customer ? "/account" : "/account/login"}
            className="text-[12px] uppercase tracking-[0.18em]"
          >
            {customer ? "Account" : "Sign in"}
          </Link>
        </div>
      </div>
    </header>
  );
}

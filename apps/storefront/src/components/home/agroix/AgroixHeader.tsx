"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

const NAV = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#solutions", label: "Solutions" },
  { href: "/shop", label: "Products" },
  { href: "#stories", label: "Success Story" },
] as const;

export function AgroixHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#0c1f12]/92 backdrop-blur-md shadow-lg" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9fcf3a]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M7 19c2.5-1.5 4-4 5-7 1 3 2.5 5.5 5 7"
                stroke="#163016"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M12 18V9"
                stroke="#163016"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M12 10c2.2-2.8 5.2-3.8 7.5-3.2-1.2 3.4-3.8 5.2-7.5 5.7-3.7-.5-6.3-2.3-7.5-5.7C6.8 6.2 9.8 7.2 12 10Z"
                fill="#163016"
              />
            </svg>
          </span>
          <span className="font-[family-name:var(--font-display)] text-[1.35rem] font-semibold tracking-tight">
            Agroix
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[15px] font-medium text-white/90 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="hidden rounded-full bg-gradient-to-r from-[#2f6bff] to-[#5aa8ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(47,107,255,0.35)] transition hover:brightness-110 sm:inline-flex"
          >
            Contact Us
          </Link>
          <button
            type="button"
            className="rounded-full border border-white/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "border-t border-white/10 bg-[#0c1f12]/95 md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-4 px-5 py-5">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="text-sm font-semibold text-[#9fcf3a]"
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}

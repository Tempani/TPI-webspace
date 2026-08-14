"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function LayoutChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome ? <SiteHeader /> : null}
      <main className={isHome ? "min-h-screen" : "min-h-[70vh]"}>{children}</main>
      {!isHome ? <SiteFooter /> : null}
      <CartDrawer />
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HERO_IMAGE, SITE_NAME } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-[var(--color-ink)]">
      <Image
        src={HERO_IMAGE}
        alt="Tempani vineyard landscape"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/20" />
      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 md:px-10 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl text-white"
        >
          <p className="font-[family-name:var(--font-serif)] text-5xl tracking-[0.28em] md:text-7xl">
            {SITE_NAME}
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-serif)] text-3xl leading-tight md:text-5xl">
            Quiet luxury for the table and the home
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
            An editorial edit of wines and lifestyle pieces chosen for texture,
            provenance, and lasting presence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button className="bg-white text-[var(--color-ink)] border-white hover:bg-[var(--color-surface)]">
                Shop the collection
              </Button>
            </Link>
            <Link href="/categories/shirts">
              <Button
                variant="secondary"
                className="border-white/60 text-white hover:border-white"
              >
                Discover more
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { AgroixHeader } from "./AgroixHeader";

const HERO =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80";

export function AgroixHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#102416]">
      <Image
        src={HERO}
        alt="Green wheat field under open sky"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />
      <AgroixHeader />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-center px-5 pb-24 pt-28 md:px-8">
        <div className="max-w-[720px] animate-[agroixFade_0.85s_ease-out]">
          <h1 className="font-[family-name:var(--font-display)] text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-[4.25rem]">
            Smart Farming for Future{" "}
            <em className="font-[family-name:var(--font-accent)] font-medium italic text-white">
              Generations
            </em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            We help growers build a sustainable future with advanced agricultural
            technologies that respect the land and raise productivity.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#b6d93b] px-6 py-3.5 text-sm font-semibold text-[#142014] transition hover:bg-[#c4e54a]"
            >
              Start Investing
              <span aria-hidden className="text-base">
                →
              </span>
            </Link>
            <Link
              href="#partners"
              className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Meet Our Partners
              <span aria-hidden className="text-base">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-5 flex flex-col items-center gap-3 md:left-8">
          <span className="rotate-180 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80 [writing-mode:vertical-rl]">
            Scroll
          </span>
          <span className="h-10 w-px bg-white/50" />
        </div>
      </div>
    </section>
  );
}

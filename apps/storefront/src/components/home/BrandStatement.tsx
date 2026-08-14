"use client";

import { motion } from "framer-motion";

export function BrandStatement() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[900px] px-5 py-20 text-center md:px-10 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="font-[family-name:var(--font-serif)] text-3xl leading-snug text-[var(--color-ink)] md:text-5xl"
        >
          We believe luxury is{" "}
          <em className="italic text-[var(--color-accent)]">restraint</em> —
          fewer pieces, better made, meant to be lived with.
        </motion.p>
      </div>
    </section>
  );
}

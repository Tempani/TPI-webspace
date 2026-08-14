"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-blush)]">
        <motion.div
          key={current}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          <Image
            src={current}
            alt={alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={clsx(
                "relative aspect-square overflow-hidden border bg-[var(--color-blush)]",
                active === index
                  ? "border-[var(--color-accent)]"
                  : "border-transparent"
              )}
            >
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

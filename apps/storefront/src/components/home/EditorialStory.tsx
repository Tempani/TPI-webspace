import Image from "next/image";
import { EDITORIAL_IMAGE } from "@/lib/constants";

export function EditorialStory() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24">
        <div className="relative aspect-[4/5] overflow-hidden animate-[fadeUp_0.55s_ease-out]">
          <Image
            src={EDITORIAL_IMAGE}
            alt="Editorial wine still life"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="max-w-lg">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Our story
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl leading-tight text-[var(--color-ink)] md:text-5xl">
            From vineyard to living room
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
            Tempani is a house of considered objects — bottles with character,
            linens with weight, and tableware that holds a room without raising
            its voice. Every piece is selected for how it ages with use.
          </p>
        </div>
      </div>
    </section>
  );
}

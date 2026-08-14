"use client";

import Image from "next/image";
import { useState } from "react";
import { clsx } from "clsx";

const FIELD =
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=80";

const ITEMS = [
  {
    id: "crop",
    title: "Intelligent Crop Optimization",
    body: "AI-guided insights help you time planting, irrigation, and harvest with precision — so every acre works harder without depleting the soil.",
  },
  {
    id: "productivity",
    title: "Proven Farm Productivity",
    body: "Connect equipment, sensors, and field records in one place. Spot bottlenecks early and turn operational data into higher yields.",
  },
  {
    id: "sustainability",
    title: "Sustainable Resource Planning",
    body: "Balance water, nutrients, and energy use with recommendations tailored to your climate, crop mix, and long-term soil health.",
  },
] as const;

export function SmartSolutions() {
  const [openId, setOpenId] = useState<string>(ITEMS[0].id);

  return (
    <section id="solutions" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.03em] text-[#152028] md:text-5xl md:leading-[1.1]">
          Smart Farming Solutions{" "}
          <em className="font-[family-name:var(--font-accent)] font-medium italic text-[#152028]">
            That Deliver Real Results
          </em>
        </h2>

        <div className="mt-14 grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-3">
            {ITEMS.map((item) => {
              const open = openId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  className={clsx(
                    "w-full rounded-2xl border px-5 py-5 text-left transition md:px-6",
                    open
                      ? "border-[#cfe6a0] bg-[#f4f9e8]"
                      : "border-transparent bg-transparent hover:bg-[#f6f7f9]"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={clsx(
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        open ? "bg-[#9fcf3a] text-[#163016]" : "bg-[#e8ecf0] text-[#5d6670]"
                      )}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                        <path d="M12 3c4 3 6 6 6 9a6 6 0 1 1-12 0c0-3 2-6 6-9Z" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#152028]">
                        {item.title}
                      </p>
                      <div
                        className={clsx(
                          "grid transition-all duration-300",
                          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <p className="overflow-hidden text-sm leading-relaxed text-[#5d6670]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] md:min-h-[420px]">
            <Image
              src={FIELD}
              alt="Farmers reviewing irrigation across green fields"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { clsx } from "clsx";
import { useState, type ReactNode } from "react";

type Item = {
  id: string;
  title: string;
  content: ReactNode;
};

export function Accordion({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between py-4 text-left"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
            >
              <span className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-ink)]">
                {item.title}
              </span>
              <span
                className={clsx(
                  "text-sm text-[var(--color-muted)] transition-transform",
                  open && "rotate-45"
                )}
              >
                +
              </span>
            </button>
            {open ? (
              <div className="pb-5 text-sm leading-relaxed text-[var(--color-muted)]">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

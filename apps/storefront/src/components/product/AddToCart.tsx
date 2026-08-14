"use client";

import { useMemo, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatMoney, getVariantPrice } from "@/lib/format";

export function AddToCart({ product }: { product: HttpTypes.StoreProduct }) {
  const { addItem } = useCart();
  const variants = product.variants || [];
  const options = product.options || [];

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      for (const option of options) {
        const first = option.values?.[0]?.value;
        if (option.id && first) initial[option.id] = first;
      }
      return initial;
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return undefined;
    if (!options.length) return variants[0];

    const matched = variants.find((variant) =>
      (variant.options || []).every((opt) => {
        const optionId = opt.option_id;
        if (!optionId) return true;
        return selectedOptions[optionId] === opt.value;
      })
    );

    return matched || variants[0];
  }, [variants, options, selectedOptions]);

  const price = selectedVariant
    ? getVariantPrice(selectedVariant)
    : { amount: null, currency: "eur" };

  async function handleAdd() {
    if (!selectedVariant?.id) {
      setError("Please select a variant.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await addItem(selectedVariant.id, quantity);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add to bag.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-lg text-[var(--color-ink)]">
        {formatMoney(price.amount, price.currency)}
      </p>

      {options.map((option) => (
        <div key={option.id} className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
            {option.title}
          </p>
          <div className="flex flex-wrap gap-2">
            {(option.values || []).map((value) => {
              const active = selectedOptions[option.id!] === value.value;
              return (
                <button
                  key={value.id}
                  type="button"
                  className={clsx(
                    "min-w-12 rounded-[6px] border px-3 py-2 text-sm transition",
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-blush)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-ink)]"
                  )}
                  onClick={() =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [option.id!]: value.value!,
                    }))
                  }
                >
                  {value.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Quantity
        </p>
        <div className="inline-flex items-center border border-[var(--color-border)]">
          <button
            type="button"
            className="px-4 py-2"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            className="px-4 py-2"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      <Button
        className="w-full md:w-auto"
        loading={loading}
        onClick={() => void handleAdd()}
        disabled={!selectedVariant}
      >
        Add to bag
      </Button>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? (
        <p className="text-sm text-[var(--color-accent)]">Added to your bag.</p>
      ) : null}
    </div>
  );
}

export function formatMoney(
  amount: number | null | undefined,
  currencyCode = "eur",
  locale = "en-GB"
): string {
  if (amount == null || Number.isNaN(amount)) {
    return "—";
  }

  // Medusa v2 calculated_price amounts are typically major units (e.g. 19.5)
  // but some legacy price fields may arrive as minor units. Prefer treating
  // values with decimals / small magnitudes as major units.
  const value = amount;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode.toUpperCase()}`;
  }
}

export function getVariantPrice(variant: {
  calculated_price?: {
    calculated_amount?: number | null;
    currency_code?: string | null;
  } | null;
  prices?: Array<{ amount?: number | null; currency_code?: string | null }> | null;
}): { amount: number | null; currency: string } {
  const calculated = variant.calculated_price;
  if (calculated?.calculated_amount != null) {
    return {
      amount: calculated.calculated_amount,
      currency: calculated.currency_code || "eur",
    };
  }

  const first = variant.prices?.[0];
  if (first?.amount != null) {
    return {
      amount: first.amount,
      currency: first.currency_code || "eur",
    };
  }

  return { amount: null, currency: "eur" };
}

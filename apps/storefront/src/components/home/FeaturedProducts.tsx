import type { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProducts({
  products,
}: {
  products: HttpTypes.StoreProduct[];
}) {
  return (
    <section className="bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Featured
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-serif)] text-4xl text-[var(--color-ink)]">
              The current edit
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink)] underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        {products.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">
            Products will appear here once the catalogue is available.
          </p>
        )}
      </div>
    </section>
  );
}

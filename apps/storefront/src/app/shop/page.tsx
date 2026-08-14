import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { listCategories, listProducts } from "@/lib/cart";
import { sortProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the Tempani collection of wines and lifestyle pieces.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;

  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = [];
  let error: string | null = null;

  try {
    categories = await listCategories();
  } catch {
    categories = [];
  }

  try {
    const categoryEntity = category
      ? categories.find((c) => c.handle === category || c.id === category)
      : undefined;

    const result = await listProducts({
      q,
      category_id: categoryEntity?.id ? [categoryEntity.id] : undefined,
      limit: 48,
    });
    products = sortProducts(result.products, sort);
  } catch {
    error = "We couldn’t load the catalogue right now.";
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Shop
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-serif)] text-5xl text-[var(--color-ink)]">
          The collection
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center gap-3 py-6">
            <Spinner />
            <span className="text-sm text-[var(--color-muted)]">Loading filters…</span>
          </div>
        }
      >
        <ShopToolbar categories={categories} />
      </Suspense>

      <div className="mt-10">
        {error ? (
          <EmptyState title="Catalogue unavailable" description={error} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try another search or browse the full collection."
            actionHref="/shop"
            actionLabel="Clear filters"
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { listProducts } from "@/lib/cart";
import { SearchForm } from "@/components/search/SearchForm";

export const metadata: Metadata = {
  title: "Search",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";

  let products: Awaited<ReturnType<typeof listProducts>>["products"] = [];
  if (q) {
    try {
      const result = await listProducts({ q, limit: 48 });
      products = result.products;
    } catch {
      products = [];
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-5xl text-[var(--color-ink)]">
        Search
      </h1>
      <div className="mt-8 max-w-xl">
        <Suspense fallback={<Spinner />}>
          <SearchForm initialQuery={q} />
        </Suspense>
      </div>

      <div className="mt-10">
        {!q ? (
          <EmptyState
            title="Find something beautiful"
            description="Search by product name or keyword."
          />
        ) : products.length === 0 ? (
          <EmptyState
            title={`No results for “${q}”`}
            description="Try a broader term or browse the full shop."
            actionHref="/shop"
            actionLabel="Browse shop"
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-[var(--color-muted)]">
              {products.length} result{products.length === 1 ? "" : "s"} for “{q}”
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

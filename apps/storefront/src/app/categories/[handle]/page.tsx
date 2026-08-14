import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { listProducts, retrieveCategoryByHandle } from "@/lib/cart";

type Params = Promise<{ handle: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { handle } = await params;
  const category = await retrieveCategoryByHandle(handle).catch(() => null);
  return {
    title: category?.name || "Category",
    description: category?.description || undefined,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { handle } = await params;
  const category = await retrieveCategoryByHandle(handle).catch(() => null);
  if (!category) notFound();

  let products: Awaited<ReturnType<typeof listProducts>>["products"] = [];
  try {
    const result = await listProducts({
      category_id: [category.id],
      limit: 48,
    });
    products = result.products;
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        Category
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-serif)] text-5xl text-[var(--color-ink)]">
        {category.name}
      </h1>
      {category.description ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
          {category.description}
        </p>
      ) : null}

      <div className="mt-10">
        {products.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing here yet"
            description="This category has no products at the moment."
            actionHref="/shop"
            actionLabel="Browse shop"
          />
        )}
      </div>
    </div>
  );
}

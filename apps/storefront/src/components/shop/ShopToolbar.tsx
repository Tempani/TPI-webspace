"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ShopToolbar({
  categories,
}: {
  categories: Array<{ id: string; name: string; handle?: string | null }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`/shop?${params.toString()}`);
  }

  function onSearch(event: FormEvent) {
    event.preventDefault();
    updateParam("q", q.trim());
  }

  return (
    <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 md:flex-row md:items-end md:justify-between">
      <form onSubmit={onSearch} className="flex w-full max-w-md gap-2">
        <Input
          name="q"
          placeholder="Search the collection"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
      <div className="flex flex-wrap gap-3">
        <select
          className="h-11 rounded-[6px] border border-[var(--color-border)] bg-white px-3 text-sm"
          value={searchParams.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.handle || category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="h-11 rounded-[6px] border border-[var(--color-border)] bg-white px-3 text-sm"
          value={searchParams.get("sort") || ""}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="">Featured</option>
          <option value="price-asc">Price · Low to high</option>
          <option value="price-desc">Price · High to low</option>
          <option value="title-asc">Title · A–Z</option>
          <option value="title-desc">Title · Z–A</option>
        </select>
      </div>
    </div>
  );
}

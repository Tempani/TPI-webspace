import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HomeCTA() {
  return (
    <section className="bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[900px] px-5 py-20 text-center md:py-28">
        <h2 className="font-[family-name:var(--font-serif)] text-4xl text-[var(--color-ink)] md:text-5xl">
          Begin with the collection
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
          Explore the current season — an edit shaped by light, texture, and the
          ritual of gathering.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/shop">
            <Button size="lg">Shop now</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

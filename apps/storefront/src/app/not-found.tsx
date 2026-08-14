import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[720px] flex-col items-start justify-center px-5 py-20 md:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        404
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-serif)] text-5xl text-[var(--color-ink)]">
        Page not found
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
        The page you requested is no longer available, or the link may be
        incorrect.
      </p>
      <Link href="/" className="mt-8">
        <Button>Return home</Button>
      </Link>
    </div>
  );
}

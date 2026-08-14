import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12">
      <h2 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-ink)]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}
      {actionHref && actionLabel ? (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  );
}

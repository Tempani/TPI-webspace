import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          {label}
        </span>
      ) : null}
      <input
        id={inputId}
        className={clsx(
          "h-11 w-full rounded-[6px] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]",
          error && "border-red-700",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
}

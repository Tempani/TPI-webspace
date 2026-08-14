import { clsx, type ClassValue } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: ReactNode;
};

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] border border-[var(--color-accent)]",
  secondary:
    "bg-transparent text-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-ink)]",
  ghost:
    "bg-transparent text-[var(--color-ink)] border border-transparent hover:border-[var(--color-border)]",
  link: "bg-transparent text-[var(--color-ink)] border-0 rounded-none px-0 underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs tracking-[0.14em] uppercase",
  md: "h-11 px-6 text-xs tracking-[0.16em] uppercase",
  lg: "h-12 px-8 text-sm tracking-[0.18em] uppercase",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[6px] font-[family-name:var(--font-sans)] transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        variant !== "link" ? sizes[size] : "text-sm tracking-[0.08em]",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

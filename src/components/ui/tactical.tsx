import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Button --------------------------------- */

type Variant = "danger" | "steel" | "ghost" | "success";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  danger:
    "bg-primary text-primary-foreground border border-primary/60 hover:brightness-110 hover:shadow-[0_0_30px_-8px_var(--primary)]",
  steel:
    "bg-secondary text-secondary-foreground border border-border-strong hover:bg-accent hover:border-primary/50",
  ghost:
    "bg-transparent text-muted-foreground border border-transparent hover:text-foreground hover:border-border-strong",
  success:
    "bg-success text-success-foreground border border-success/60 hover:brightness-110 hover:shadow-[0_0_30px_-8px_var(--success)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

export function TacButton({
  variant = "steel",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-display font-semibold uppercase tracking-[0.14em]",
        "transition-all duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

/* ---------------------------------- Panel ---------------------------------- */

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel overflow-hidden", className)}>
      {(title || action) && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3">
          <div className="min-w-0">
            {title && <h2 className="label-caps truncate text-foreground">{title}</h2>}
            {subtitle && <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ---------------------------------- Badge ---------------------------------- */

type Tone = "danger" | "success" | "warning" | "signal" | "muted";

const tones: Record<Tone, string> = {
  danger: "border-primary/50 text-primary bg-primary/10",
  success: "border-success/50 text-success bg-success/10",
  warning: "border-warning/50 text-warning bg-warning/10",
  signal: "border-signal/50 text-signal bg-signal/10",
  muted: "border-border-strong text-muted-foreground bg-muted/40",
};

export function Badge({
  tone = "muted",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-display text-[0.65rem] font-semibold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = "muted", pulse }: { tone?: Tone; pulse?: boolean }) {
  const bg: Record<Tone, string> = {
    danger: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    signal: "bg-signal",
    muted: "bg-steel",
  };
  return (
    <span
      className={cn("inline-block size-2 rounded-full", bg[tone], pulse && "animate-pulse-danger")}
    />
  );
}

/* ---------------------------------- Field ---------------------------------- */

export function Field({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="label-caps">{label}</span>
      <input
        className={cn(
          "mt-2 h-11 w-full rounded-sm border border-border bg-input/60 px-3 font-mono text-sm text-foreground",
          "placeholder:text-muted-foreground/60 transition-colors",
          "focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/25",
          className,
        )}
        {...props}
      />
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

/* ---------------------------------- Stat ----------------------------------- */

export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: Tone }) {
  const color =
    tone === "danger"
      ? "text-primary"
      : tone === "success"
        ? "text-success"
        : tone === "warning"
          ? "text-warning"
          : "text-foreground";
  return (
    <div className="rounded-sm border border-border bg-secondary/40 px-4 py-3">
      <div className="label-caps">{label}</div>
      <div className={cn("mt-1 font-display text-2xl font-bold tabular-nums", color)}>{value}</div>
    </div>
  );
}

import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/ui/tactical";

export function Brand({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-sm border border-primary/50 bg-primary/10 font-display text-sm font-bold text-primary transition-shadow group-hover:glow-danger">
        BD
      </span>
      <span className="font-display text-sm font-bold uppercase tracking-[0.22em] text-foreground">
        Bomb Defusal
      </span>
    </Link>
  );
}

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/lobby", label: "Lobby" },
  { to: "/game", label: "Bomb" },
  { to: "/manual", label: "Manual" },
] as const;

export function AppShell({
  children,
  status = "STANDBY",
  nav = true,
}: {
  children: ReactNode;
  status?: string;
  nav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 tactical-grid opacity-[0.35]" />
      <div className="relative">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between">
            <Brand className="min-w-0" />
            {nav && (
              <nav className="hidden items-center gap-1 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeProps={{ className: "text-foreground border-primary/50 bg-primary/10" }}
                    className="rounded-sm border border-transparent px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
            <div className="flex shrink-0 items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
              <StatusDot tone="success" />
              {status}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground/70">
          Bomb Defusal // Cooperative Ordnance Simulator // Prototype Build
        </footer>
      </div>
    </div>
  );
}

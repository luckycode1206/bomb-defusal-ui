import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Panel, StatusDot, TacButton } from "@/components/ui/tactical";
import { KeypadModule, PasswordModule, WiresModule } from "@/components/game/BombModules";
import { mockTeam } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Defuser View — Bomb Defusal" },
      { name: "description", content: "The live device: countdown, strikes, wires, keypad and password." },
      { property: "og:title", content: "Defuser View — Bomb Defusal" },
      { property: "og:description", content: "Five minutes. Three strikes. Three modules." },
    ],
  }),
  component: GameScreen;
});

function GameScreen() {
  const [seconds, setSeconds] = useState(287);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const critical = seconds < 60;
  const strikes = 1;

  return (
    <AppShell status="Live" nav={false}>
      <div className="animate-rise-in space-y-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <Badge tone="danger">Defuser view</Badge>
            <h1 className="mt-2 truncate font-display text-2xl font-bold uppercase tracking-wide">
              {mockTeam.name} · Device MK-IV
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-sm border border-warning/40 bg-warning/10 px-3 py-1.5">
            <StatusDot tone="warning" pulse />
            <span className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-warning">
              Do not show your screen
            </span>
          </div>
        </header>

        <div
          className={cn(
            "panel scanlines relative overflow-hidden px-4 py-8 text-center",
            critical && "glow-danger",
          )}
        >
          <div className="pointer-events-none absolute inset-0 tactical-grid opacity-30" />
          <div className="relative">
            <div className="label-caps">Time remaining</div>
            <div
              className={cn(
                "mt-2 font-mono text-6xl font-bold tabular-nums tracking-tight sm:text-8xl",
                critical ? "animate-pulse-danger text-primary" : "text-foreground",
              )}
            >
              {mm}:{ss}
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="label-caps">Strikes</span>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "size-4 rounded-full border transition-colors",
                      i < strikes
                        ? "border-primary bg-primary shadow-[0_0_16px_-2px_var(--primary)]"
                        : "border-border-strong bg-muted",
                    )}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-muted-foreground">{strikes} / 3</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <WiresModule index={1} />
          <KeypadModule index={2} />
          <PasswordModule index={3} />
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <Panel title="Device intel" bodyClassName="grid gap-2 sm:grid-cols-3 font-mono text-xs">
            {[
              ["Serial", "CX9-4B2"],
              ["Indicators", "FRK · CAR"],
              ["Batteries", "2"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-2 rounded-sm bg-secondary/50 px-3 py-2">
                <span className="label-caps">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </Panel>
          <div className="flex flex-wrap gap-2">
            <Link to="/results">
              <TacButton variant="success">Submit defusal</TacButton>
            </Link>
            <Link to="/lobby">
              <TacButton variant="ghost">Abort</TacButton>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

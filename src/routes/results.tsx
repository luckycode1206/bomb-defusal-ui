import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Stat, TacButton } from "@/components/ui/tactical";
import { mockResult } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Mission Debrief — Bomb Defusal" },
      { name: "description", content: "Victory or defeat: time, strikes and modules solved." },
      { property: "og:title", content: "Mission Debrief — Bomb Defusal" },
      { property: "og:description", content: "Your squad's defusal record for this deployment." },
    ],
  }),
  component: Results,
});

function Results() {
  const { victory, team, time, strikes, modulesSolved, modulesTotal } = mockResult;
  return (
    <AppShell status={victory ? "Defused" : "Detonated"} nav={false}>
      <div className="animate-rise-in mx-auto max-w-3xl space-y-6">
        <div
          className={cn(
            "panel scanlines relative overflow-hidden px-6 py-12 text-center",
            victory ? "border-success/40" : "border-primary/40 glow-danger",
          )}
        >
          <div className="pointer-events-none absolute inset-0 tactical-grid opacity-30" />
          <div className="relative">
            <Badge tone={victory ? "success" : "danger"}>Mission debrief</Badge>
            <h1
              className={cn(
                "mt-4 font-display text-5xl font-extrabold uppercase tracking-tight sm:text-7xl",
                victory ? "text-success" : "animate-pulse-danger text-primary",
              )}
            >
              {victory ? "Defused" : "Detonated"}
            </h1>
            <p className="mt-3 font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {team}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Completion time" value={time} />
          <Stat label="Strikes" value={`${strikes} / 3`} tone={strikes > 0 ? "warning" : "success"} />
          <Stat
            label="Modules solved"
            value={`${modulesSolved} / ${modulesTotal}`}
            tone={victory ? "success" : "danger"}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/game">
            <TacButton variant="danger" size="lg">
              Play again
            </TacButton>
          </Link>
          <Link to="/dashboard">
            <TacButton variant="steel" size="lg">
              Return to dashboard
            </TacButton>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

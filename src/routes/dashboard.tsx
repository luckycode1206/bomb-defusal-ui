import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Panel, Stat, StatusDot, TacButton } from "@/components/ui/tactical";
import { currentPlayer, mockPlayers, mockTeam, recentGames } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Operative Dashboard — Bomb Defusal" },
      { name: "description", content: "Your squad, recent missions and defusal record." },
      { property: "og:title", content: "Operative Dashboard — Bomb Defusal" },
      { property: "og:description", content: "Create a team, join with a room code, review missions." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell status="Standby">
      <div className="animate-rise-in space-y-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-sm border border-primary/40 bg-primary/10 font-display text-lg font-bold text-primary">
              {currentPlayer.username.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                {currentPlayer.username}
              </h1>
              <p className="mt-1 truncate font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {currentPlayer.rank} · Clearance {currentPlayer.clearance}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link to="/lobby">
              <TacButton variant="danger">Create Team</TacButton>
            </Link>
            <Link to="/lobby">
              <TacButton variant="steel">Join Team</TacButton>
            </Link>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Defusals" value={currentPlayer.defusals} tone="success" />
          <Stat label="Detonations" value={currentPlayer.detonations} tone="danger" />
          <Stat label="Best time" value="02:41" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Panel
            title="Recent games"
            subtitle="Last four deployments"
            bodyClassName="p-0"
            action={<Badge tone="muted">Archive</Badge>}
          >
            <ul className="divide-y divide-border">
              {recentGames.map((g) => {
                const won = g.result === "DEFUSED";
                return (
                  <li
                    key={g.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-secondary/40"
                  >
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <StatusDot tone={won ? "success" : "danger"} />
                        <span className="truncate font-display text-sm font-semibold uppercase tracking-wide">
                          {g.team}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {g.date} · {g.strikes} strike{g.strikes === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-sm tabular-nums text-muted-foreground">
                        {g.time}
                      </span>
                      <Badge tone={won ? "success" : "danger"}>{g.result}</Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel
            title="Your team"
            subtitle={mockTeam.name}
            action={<Badge tone="signal">{mockTeam.roomCode}</Badge>}
          >
            <ul className="space-y-2">
              {mockPlayers.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-sm border border-border bg-secondary/40 px-3 py-2"
                >
                  <span className="min-w-0 truncate font-mono text-sm">{p.name}</span>
                  <Badge tone={p.role === "Defuser" ? "danger" : "signal"}>{p.role}</Badge>
                </li>
              ))}
            </ul>
            <Link to="/lobby" className="mt-4 block">
              <TacButton variant="steel" className="w-full">
                Open lobby
              </TacButton>
            </Link>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

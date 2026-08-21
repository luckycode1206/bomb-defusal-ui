import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Panel, StatusDot, TacButton } from "@/components/ui/tactical";
import { mockPlayers, mockTeam } from "@/lib/mock-data";

export const Route = createFileRoute("/lobby")({
  head: () => ({
    meta: [
      { title: "Team Lobby — Bomb Defusal" },
      { name: "description", content: "Assemble your squad, assign roles and launch the mission." },
      { property: "og:title", content: "Team Lobby — Bomb Defusal" },
      { property: "og:description", content: "Room code, ready checks and role assignment before deployment." },
    ],
  }),
  component: Lobby,
});

function Lobby() {
  const [copied, setCopied] = useState(false);
  const readyCount = mockPlayers.filter((p) => p.ready).length;
  const allReady = readyCount === mockPlayers.length;

  return (
    <AppShell status={allReady ? "Ready" : "Awaiting"}>
      <div className="animate-rise-in space-y-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="label-caps text-primary">Team lobby</div>
            <h1 className="mt-1 truncate font-display text-3xl font-bold uppercase tracking-wide">
              {mockTeam.name}
            </h1>
          </div>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(mockTeam.roomCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="shrink-0 rounded-sm border border-border-strong bg-secondary px-4 py-2 text-left transition-colors hover:border-primary/50"
          >
            <span className="label-caps">Room code</span>
            <span className="mt-0.5 block font-mono text-xl font-bold tracking-[0.3em] text-signal">
              {mockTeam.roomCode}
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              {copied ? "Copied" : "Click to copy"}
            </span>
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Panel
            title="Operatives"
            subtitle={`${readyCount} of ${mockPlayers.length} ready`}
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {mockPlayers.map((p) => (
                <li
                  key={p.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 transition-colors hover:bg-secondary/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-border-strong bg-muted font-display text-xs font-bold">
                      {p.name.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-mono text-sm">{p.name}</span>
                        {p.host && <Badge tone="warning">Host</Badge>}
                      </div>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{p.role}</span>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-2">
                    <StatusDot tone={p.ready ? "success" : "muted"} pulse={!p.ready} />
                    <span
                      className={`font-display text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${p.ready ? "text-success" : "text-muted-foreground"}`}
                    >
                      {p.ready ? "Ready" : "Standby"}
                    </span>
                  </span>
                </li>
              ))}
              <li className="px-4 py-3.5">
                <span className="block rounded-sm border border-dashed border-border-strong px-3 py-2 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Empty slot — share the room code
                </span>
              </li>
            </ul>
          </Panel>

          <div className="space-y-6">
            <Panel title="Mission status">
              <dl className="space-y-3 font-mono text-sm">
                {[
                  ["Device", "MK-IV Serial CX9"],
                  ["Modules", "Wires · Keypad · Password"],
                  ["Timer", "05:00"],
                  ["Strike limit", "3"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <dt className="label-caps">{k}</dt>
                    <dd className="truncate text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-center gap-2 rounded-sm border border-warning/40 bg-warning/10 px-3 py-2">
                <StatusDot tone="warning" pulse />
                <span className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-warning">
                  {allReady ? "All operatives ready" : mockTeam.missionStatus}
                </span>
              </div>
            </Panel>

            <div className="space-y-2">
              <Link to="/game">
                <TacButton variant="danger" size="lg" className="w-full">
                  Start game
                </TacButton>
              </Link>
              <Link to="/manual">
                <TacButton variant="steel" className="w-full">
                  Open expert manual
                </TacButton>
              </Link>
              <Link to="/dashboard">
                <TacButton variant="ghost" className="w-full">
                  Leave lobby
                </TacButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

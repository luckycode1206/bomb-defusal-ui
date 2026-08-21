import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Panel, TacButton } from "@/components/ui/tactical";

export const Route = createFileRoute("/manual")({
  head: () => ({
    meta: [
      { title: "Expert Manual — Bomb Defusal" },
      { name: "description", content: "Defusal procedures for wires, keypad and password modules." },
      { property: "og:title", content: "Expert Manual — Bomb Defusal" },
      { property: "og:description", content: "The rules the Defuser can never see. Read them out loud." },
    ],
  }),
  component: ManualScreen,
});

const wireRules = [
  "3 wires: no red — cut the second. Last wire white — cut the last. More than one blue — cut the last blue. Otherwise cut the last wire.",
  "4 wires: more than one red and serial ends odd — cut the last red. Last wire yellow and no red — cut the first. Exactly one blue — cut the first.",
  "5 wires: last wire black and serial ends odd — cut the fourth. Exactly one red and more than one yellow — cut the first. Otherwise cut the second.",
];

const keypadColumns = [
  ["Ω", "λ", "¶", "★", "Ψ", "∆", "Ж"],
  ["Ѯ", "Ω", "©", "Ж", "★", "λ", "∆"],
  ["©", "¶", "Ψ", "Ѯ", "∆", "Ω", "★"],
];

const passwordWords = ["about", "after", "again", "below", "could", "hunts", "there", "which"];

function ManualScreen() {
  return (
    <AppShell status="Manual" nav={false}>
      <div className="animate-rise-in space-y-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-signal/30 pb-5 sm:flex sm:justify-between">
          <div className="min-w-0">
            <Badge tone="signal">Expert manual</Badge>
            <h1 className="mt-2 truncate font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
              Defusal Procedures · Rev. 7
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Never touch the device. Read the rules aloud and ask for details.
            </p>
          </div>
          <Link to="/game" className="shrink-0">
            <TacButton variant="ghost" size="sm">
              Defuser view
            </TacButton>
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Section 1 — Wires" subtitle="Cut exactly one wire" className="border-signal/25">
            <ol className="space-y-3">
              {wireRules.map((r, i) => (
                <li key={i} className="rounded-sm border border-border bg-secondary/40 p-3 text-sm leading-relaxed">
                  <span className="mr-2 font-mono text-xs text-signal">1.{i + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Section 2 — Keypad" subtitle="Press four symbols in column order" className="border-signal/25">
            <p className="mb-3 text-sm text-muted-foreground">
              Find the one column containing all four displayed symbols. Press them in the order they
              appear top to bottom in that column.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {keypadColumns.map((col, i) => (
                <div key={i} className="rounded-sm border border-border bg-secondary/40 p-2 text-center">
                  <div className="label-caps mb-2">Col {i + 1}</div>
                  <ul className="space-y-1 font-mono text-lg">
                    {col.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Section 3 — Password" subtitle="Only one valid word" className="border-signal/25 lg:col-span-2">
            <p className="mb-3 text-sm text-muted-foreground">
              Ask the Defuser to cycle the first dial and read out its letters. Eliminate words until
              one candidate remains, then have them spell it.
            </p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {passwordWords.map((w) => (
                <li
                  key={w}
                  className="rounded-sm border border-border bg-secondary/40 px-3 py-2 text-center font-mono text-sm uppercase tracking-[0.2em] transition-colors hover:border-signal/50 hover:text-signal"
                >
                  {w}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="rounded-sm border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
          <span className="font-display font-semibold uppercase tracking-[0.16em] text-primary">
            Warning ·{" "}
          </span>
          A strike is issued for any wrong input. Three strikes detonate the device immediately.
        </div>
      </div>
    </AppShell>
  );
}

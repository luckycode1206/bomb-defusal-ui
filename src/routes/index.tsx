import { createFileRoute, Link } from "@tanstack/react-router";
import { Brand } from "@/components/layout/AppShell";
import { TacButton, Badge, Panel } from "@/components/ui/tactical";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bomb Defusal — Co-op Bomb Defusal Game" },
      {
        name: "description",
        content:
          "One player faces the bomb. The others hold the manual. Talk fast, cut right, and defuse before the timer hits zero.",
      },
      { property: "og:title", content: "Bomb Defusal — Co-op Bomb Defusal Game" },
      {
        property: "og:description",
        content: "Cooperative multiplayer bomb defusal. Communicate under pressure or detonate.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Form a squad",
    body: "Create a team or join with a room code. Two to five operatives per bomb.",
  },
  {
    n: "02",
    title: "Split the intel",
    body: "One player is the Defuser and sees the bomb. Everyone else holds the manual — and never the bomb.",
  },
  {
    n: "03",
    title: "Talk it out",
    body: "Wires, keypad, password. The manual has the answers, the Defuser has the hands. Describe everything.",
  },
  {
    n: "04",
    title: "Beat the clock",
    body: "Three strikes and it detonates. Clear every module before the countdown ends.",
  },
];

function Landing() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 tactical-grid opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]" />

      <div className="relative">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Brand />
          <Link to="/login">
            <TacButton variant="ghost" size="sm">
              Sign In
            </TacButton>
          </Link>
        </header>

        <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:pt-20">
          <div className="animate-rise-in max-w-3xl">
            <Badge tone="danger" className="animate-flicker">
              Live ordnance simulator
            </Badge>
            <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Bomb
              <br />
              <span className="text-primary">Defusal</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              A cooperative game of nerve and language. One operative kneels in front of a live
              device. The rest read a manual they can never show. You have five minutes, three
              strikes, and each other.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/dashboard">
                <TacButton variant="danger" size="lg">
                  Play Now
                </TacButton>
              </Link>
              <a href="#how-it-works">
                <TacButton variant="steel" size="lg">
                  How it works
                </TacButton>
              </a>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 font-mono">
              {[
                ["05:00", "Timer"],
                ["03", "Strikes"],
                ["03", "Modules"],
              ].map(([v, l]) => (
                <div key={l} className="border-l-2 border-primary/40 pl-3">
                  <dt className="label-caps">{l}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-24">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
              How it works
            </h2>
            <span className="label-caps hidden sm:block">Field procedure</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((s) => (
              <article
                key={s.n}
                className="panel group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="font-mono text-sm text-primary">{s.n}</span>
                <h3 className="mt-3 text-lg font-bold uppercase tracking-wide">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </article>
            ))}
          </div>

          <Panel
            title="Two screens, one bomb"
            className="mt-6"
            bodyClassName="grid gap-4 sm:grid-cols-2"
          >
            <div className="rounded-sm border border-primary/30 bg-primary/5 p-5">
              <Badge tone="danger">Defuser</Badge>
              <p className="mt-3 text-sm text-muted-foreground">
                Sees the device: wires, keypad, password dials, the countdown and the strike lights.
                No instructions whatsoever.
              </p>
            </div>
            <div className="rounded-sm border border-signal/30 bg-signal/5 p-5">
              <Badge tone="signal">Expert</Badge>
              <p className="mt-3 text-sm text-muted-foreground">
                Holds the manual: every rule, table and exception. Sees nothing of the bomb itself.
              </p>
            </div>
          </Panel>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-border bg-card p-6">
            <p className="font-display text-lg font-bold uppercase tracking-wide">
              The clock is already running.
            </p>
            <Link to="/signup">
              <TacButton variant="danger">Create account</TacButton>
            </Link>
          </div>
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-6 font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground/70">
            Bomb Defusal // Cooperative Ordnance Simulator // Prototype Build
          </div>
        </footer>
      </div>
    </div>
  );
}

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/tactical";
import { mockWires, type WireColor } from "@/lib/mock-data";

const wireClass: Record<WireColor, string> = {
  red: "bg-primary",
  blue: "bg-signal",
  yellow: "bg-warning",
  white: "bg-foreground",
  black: "bg-steel",
};

export function ModuleShell({
  name,
  index,
  solved,
  children,
}: {
  name: string;
  index: number;
  solved?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-secondary/60 p-4 transition-all duration-300",
        solved ? "border-success/50 shadow-[var(--glow-success)]" : "border-border-strong",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="label-caps text-foreground">
          {String(index).padStart(2, "0")} · {name}
        </span>
        <Badge tone={solved ? "success" : "muted"}>{solved ? "Solved" : "Armed"}</Badge>
      </div>
      {children}
    </div>
  );
}

export function WiresModule({ index }: { index: number }) {
  const [cut, setCut] = useState<number[]>([]);
  return (
    <ModuleShell name="Wires" index={index} solved={cut.length >= 3}>
      <div className="space-y-2.5">
        {mockWires.map((c, i) => (
          <button
            key={i}
            onClick={() => setCut((p) => (p.includes(i) ? p : [...p, i]))}
            className="group flex w-full items-center gap-3"
            aria-label={`Cut ${c} wire`}
          >
            <span className="w-6 font-mono text-[0.65rem] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
                  wireClass[c],
                  cut.includes(i) ? "w-[38%] opacity-50" : "w-full group-hover:brightness-125",
                )}
              />
              {cut.includes(i) && (
                <span className={cn("absolute inset-y-0 right-0 w-[38%] rounded-full opacity-50", wireClass[c])} />
              )}
            </span>
            <span className="w-12 text-right font-mono text-[0.65rem] uppercase text-muted-foreground">
              {cut.includes(i) ? "cut" : c}
            </span>
          </button>
        ))}
      </div>
    </ModuleShell>
  );
}

export function KeypadModule({ index }: { index: number }) {
  const [entry, setEntry] = useState("");
  const keys = ["Ω", "λ", "¶", "★", "Ψ", "∆", "Ж", "©", "Ѯ"];
  return (
    <ModuleShell name="Keypad" index={index} solved={entry.length >= 4}>
      <div className="mb-3 flex h-9 items-center rounded-sm border border-border bg-background px-3 font-mono text-lg tracking-[0.4em] text-signal">
        {entry || <span className="text-muted-foreground/50">····</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => setEntry((e) => (e.length >= 4 ? e : e + k))}
            className="aspect-square rounded-sm border border-border-strong bg-muted text-lg transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary active:translate-y-0"
          >
            {k}
          </button>
        ))}
      </div>
      <button
        onClick={() => setEntry("")}
        className="mt-3 w-full rounded-sm border border-border px-3 py-1.5 font-display text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Clear
      </button>
    </ModuleShell>
  );
}

export function PasswordModule({ index }: { index: number }) {
  const columns = [
    ["b", "d", "f", "h", "l"],
    ["a", "e", "i", "o", "u"],
    ["r", "t", "s", "n", "m"],
    ["b", "k", "p", "c", "g"],
    ["s", "t", "d", "n", "y"],
  ];
  const [pos, setPos] = useState([0, 0, 0, 0, 0]);
  const word = pos.map((p, i) => columns[i][p]).join("");
  return (
    <ModuleShell name="Password" index={index} solved={word === "hunts"}>
      <div className="grid grid-cols-5 gap-2">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => setPos((p) => p.map((v, j) => (j === i ? (v + col.length - 1) % col.length : v)))}
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              aria-label="Previous letter"
            >
              ▲
            </button>
            <span className="grid h-10 w-full place-items-center rounded-sm border border-border-strong bg-background font-mono text-lg uppercase text-signal">
              {col[pos[i]]}
            </span>
            <button
              onClick={() => setPos((p) => p.map((v, j) => (j === i ? (v + 1) % col.length : v)))}
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              aria-label="Next letter"
            >
              ▼
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Reading: {word}
      </p>
    </ModuleShell>
  );
}

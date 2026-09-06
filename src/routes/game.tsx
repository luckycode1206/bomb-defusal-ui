import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Panel, StatusDot, TacButton } from "@/components/ui/tactical";
import { KeypadModule, PasswordModule, WiresModule } from "@/components/game/BombModules";
import { mockTeam } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Defuser View — Bomb Defusal" },
      { name: "description", content: "The live device: countdown, strikes, wires, keypad and password." },
      { property: "og:title", content: "Defuser View — Bomb Defusal" },
      { property: "og:description", content: "Five minutes. Three strikes. Three modules." },
    ],
  }),
  component: GameScreen,
});

function GameScreen() {
  const [seconds, setSeconds] = useState(300);
const [roomId, setRoomId] = useState<string | null>(null);
const [gameSessionId, setGameSessionId] = useState<string | null>(null);
const [strikes, setStrikes] = useState(0);
const [gameStatus, setGameStatus] = useState("active");
    useEffect(() => {
  async function loadRoom() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: playerData, error: playerError } = await supabase
      .from("room_players")
      .select("room_id")
      .eq("user_id", user.id)
      .order("joined_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (playerError) {
      console.error("Room lookup error:", playerError);
      return;
    }

    if (!playerData?.room_id) {
      console.error("No room found for player");
      return;
    }

    console.log("Current game room:", playerData.room_id);
    setRoomId(playerData.room_id);

    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", playerData.room_id)
      .single();

    if (roomError) {
      console.error("Game room fetch error:", roomError);
      return;
    }

    console.log("Game room data:", roomData);
  }

  loadRoom();
}, []);
useEffect(() => {
  if (!roomId) return;

  async function loadGameStartTime() {
    const { data, error } = await supabase
      .from("rooms")
      .select("game_started_at")
      .eq("id", roomId)
      .single();

    if (error) {
      console.error("Game start time error:", error);
      return;
    }

    if (!data?.game_started_at) {
      console.error("Game has not started yet.");
      return;
    }

    const startTime = new Date(data.game_started_at).getTime();

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(300 - elapsed, 0);

      setSeconds(remaining);
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }

  loadGameStartTime();
}, [roomId]);
  
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const critical = seconds < 60;
  

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
            <Link to="/lobby" search={{ mode: "create" }}>
              <TacButton variant="ghost">Abort</TacButton>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

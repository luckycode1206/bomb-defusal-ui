import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Panel, StatusDot, TacButton } from "@/components/ui/tactical";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/lobby")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search["mode"] === "join" ? "join" : "create",
  }),
  head: () => ({
    meta: [
      { title: "Team Lobby — Bomb Defusal" },
      {
        name: "description",
        content: "Assemble your squad, assign roles and launch the mission.",
      },
      { property: "og:title", content: "Team Lobby — Bomb Defusal" },
      {
        property: "og:description",
        content: "Room code, ready checks and role assignment before deployment.",
      },
    ],
  }),
  component: Lobby,
});

type Player = {
  id: string;
  user_id: string;
  role: string;
  ready: boolean;
  username: string;
};

type Room = {
  id: string;
  room_code: string;
  name: string;
  host_id: string;
  status: string;
};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function Lobby() {
  const mode = Route.useSearch()["mode"];

  const [room, setRoom] = useState<Room | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  async function loadPlayers(roomId: string) {
  const { data: playersData, error: playersError } = await supabase
    .from("room_players")
    .select("id, user_id, role, ready, joined_at")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  if (playersError) {
    console.error("Players error:", playersError);
    return;
  }

  if (!playersData || playersData.length === 0) {
    setPlayers([]);
    return;
  }

  const userIds = playersData.map((player) => player.user_id);

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds);

  if (profilesError) {
    console.error("Profiles error:", profilesError);
    return;
  }

  const profileMap = new Map(
    (profilesData ?? []).map((profile) => [
      profile.id,
      profile.username,
    ])
  );

  const formattedPlayers: Player[] = playersData.map((player) => ({
    id: player.id,
    user_id: player.user_id,
    role: player.role,
    ready: player.ready,
    username: profileMap.get(player.user_id) ?? "Unknown operative",
  }));

  setPlayers(formattedPlayers);
}

  useEffect(() => {
    async function setupLobby() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setError("Authentication required.");
          return;
        }
        setCurrentUserId(user.id);

        if (mode === "create") {
          const roomCode = generateRoomCode();

          const { data: newRoom, error: roomError } = await supabase
            .from("rooms")
            .insert({
              room_code: roomCode,
              name: "Alpha Squad",
              host_id: user.id,
              status: "waiting",
            })
            .select("id, room_code, name, host_id, status")
            .single();

          if (roomError || !newRoom) {
            console.error("Room creation error:", roomError);
            setError("Unable to create room.");
            return;
          }

          const { error: playerError } = await supabase
            .from("room_players")
            .insert({
              room_id: newRoom.id,
              user_id: user.id,
              role: "Defuser",
              ready: false,
            });

          if (playerError) {
            console.error("Player creation error:", playerError);

            await supabase
              .from("rooms")
              .delete()
              .eq("id", newRoom.id);

            setError("Unable to add you to the new room.");
            return;
          }

          setRoom(newRoom);
          await loadPlayers(newRoom.id);
        }

        if (mode === "join") {
  const savedRoomId = localStorage.getItem("activeRoomId");

  if (savedRoomId) {
    const { data: existingRoom, error: existingRoomError } = await supabase
      .from("rooms")
      .select("id, room_code, name, host_id, status")
      .eq("id", savedRoomId)
      .maybeSingle();

    if (existingRoomError) {
      console.error("Saved room lookup error:", existingRoomError);
    } else if (existingRoom) {
      const { data: playerEntry } = await supabase
        .from("room_players")
        .select("id")
        .eq("room_id", savedRoomId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (playerEntry) {
        setRoom(existingRoom);
        await loadPlayers(existingRoom.id);

        if (existingRoom.status === "playing") {
          window.location.href = "/game";
          return;
        }
      } else {
        localStorage.removeItem("activeRoomId");
      }
    } else {
      localStorage.removeItem("activeRoomId");
    }
  }
}
      } catch (err) {
        console.error("Lobby error:", err);
        setError("Something went wrong while loading the lobby.");
      } finally {
        setLoading(false);
      }
    }

        setupLobby();
  }, [mode]);

  useEffect(() => {
    if (!room?.id) return;

    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_players",
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          loadPlayers(room.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id]);

    async function toggleReady() {
    if (!room?.id) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const currentPlayer = players.find(
      (player) => player.user_id === user.id
    );

    if (!currentPlayer) return;

    const { error } = await supabase
      .from("room_players")
      .update({
        ready: !currentPlayer.ready,
      })
      .eq("room_id", room.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Ready status error:", error);
    }
  }
    async function startGame() {
  if (!room?.id || !currentUserId) return;

  if (currentUserId !== room.host_id) {
    setError("Only the host can start the game.");
    return;
  }

  if (!allReady) {
    setError("All operatives must be ready.");
    return;
  }

  // Create the shared game session first
  const wireColors = ["red", "blue", "yellow", "white"];

const correctWireIndex = Math.floor(
  Math.random() * wireColors.length
);

const wireData = {
  wires: wireColors.map((color, index) => ({
    id: index,
    color,
    correct: index === correctWireIndex,
  })),
};

const { data: gameSession, error: sessionError } = await supabase
  .from("game_sessions")
  .insert({
    room_id: room.id,
    strikes: 0,
    status: "active",
    wire_data: wireData,
    keypad_data: null,
    password_data: null,
  })
  .select()
  .single();

if (sessionError || !gameSession) {
  console.error("Game session creation error:", sessionError);
  setError("Unable to initialize bomb.");
  return;
}

console.log("Game session created:", gameSession.id);
console.log("Generated wire configuration:", wireData);

  if (sessionError || !gameSession) {
    console.error("Game session creation error:", sessionError);
    setError("Unable to initialize bomb.");
    return;
  }

  console.log("Game session created:", gameSession.id);

  // Start the room
  const { data: updatedRoom, error: roomError } = await supabase
    .from("rooms")
    .update({
      status: "playing",
      game_started_at: new Date().toISOString(),
    })
    .eq("id", room.id)
    .select()
    .single();

  if (roomError || !updatedRoom) {
    console.error("Room start error:", roomError);
    setError("Unable to start the game.");
    return;
  }

  console.log("Room started:", updatedRoom);

  // Update local state too
  setRoom(updatedRoom);

  // Host enters the game
  window.location.href = "/game";
}
    useEffect(() => {
    if (!room?.id) return;

    const channel = supabase
      .channel(`room-status-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
  console.log("ROOM STATUS UPDATE RECEIVED:", payload);

  if (payload.new["status"] === "playing") {
    console.log("GAME STARTED — REDIRECTING TO GAME");
    window.location.href = "/game";
  }
}
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id]);
  async function joinRoom() {
    try {
      setJoining(true);
      setError("");

      const code = roomCodeInput.trim().toUpperCase();

      if (!code) {
        setError("Enter a room code.");
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Authentication required.");
        return;
      }
      setCurrentUserId(user.id);

      const { data: existingRoom, error: roomError } = await supabase
        .from("rooms")
        .select("id, room_code, name, host_id, status")
        .eq("room_code", code)
        .eq("status", "waiting")
        .maybeSingle();

      if (roomError) {
        console.error("Room lookup error:", roomError);
        setError("Unable to find room.");
        return;
      }

      if (!existingRoom) {
        setError("Room not found or no longer accepting players.");
        return;
      }

      const { data: alreadyJoined } = await supabase
        .from("room_players")
        .select("id")
        .eq("room_id", existingRoom.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!alreadyJoined) {
        const { error: playerError } = await supabase
          .from("room_players")
          .insert({
            room_id: existingRoom.id,
            user_id: user.id,
            role: "Defuser",
            ready: false,
          });

        if (playerError) {
          console.error("Join room error:", playerError);
          setError("Unable to join the room.");
          return;
        }
      }

      setRoom(existingRoom);
localStorage.setItem("activeRoomId", existingRoom.id);
await loadPlayers(existingRoom.id);
    } catch (err) {
      console.error("Join error:", err);
      setError("Something went wrong while joining the room.");
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <AppShell status="Awaiting">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Establishing secure lobby...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error && !room) {
    return (
      <AppShell status="Awaiting">
        <div className="mx-auto flex min-h-[400px] max-w-lg items-center justify-center">
          <div className="w-full space-y-4 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-danger">
              {error}
            </p>

            <Link to="/dashboard">
              <TacButton variant="steel">
                Return to dashboard
              </TacButton>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (mode === "join" && !room) {
    return (
      <AppShell status="Awaiting">
        <div className="mx-auto flex min-h-[500px] max-w-lg items-center justify-center">
          <Panel
            title="Join Team"
            subtitle="Enter the room code provided by your host"
          >
            <div className="space-y-4">
              <div>
                <label className="label-caps">
                  Room code
                </label>

                <input
                  value={roomCodeInput}
                  onChange={(event) =>
                    setRoomCodeInput(event.target.value.toUpperCase())
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      joinRoom();
                    }
                  }}
                  maxLength={6}
                  placeholder="XXXXXX"
                  className="mt-2 w-full rounded-sm border border-border-strong bg-secondary px-4 py-3 font-mono text-xl font-bold uppercase tracking-[0.3em] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              {error && (
                <p className="font-mono text-xs uppercase tracking-widest text-danger">
                  {error}
                </p>
              )}

              <TacButton
                variant="danger"
                size="lg"
                className="w-full"
                onClick={joinRoom}
                disabled={joining}
              >
                {joining ? "Joining..." : "Join Team"}
              </TacButton>

              <Link to="/dashboard" className="block">
                <TacButton variant="ghost" className="w-full">
                  Cancel
                </TacButton>
              </Link>
            </div>
          </Panel>
        </div>
      </AppShell>
    );
  }

  const readyCount = players.filter((player) => player.ready).length;
  const allReady =
    players.length > 0 && readyCount === players.length;

  return (
    <AppShell status={allReady ? "Ready" : "Awaiting"}>
      <div className="animate-rise-in space-y-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="label-caps text-primary">Team lobby</div>

            <h1 className="mt-1 truncate font-display text-3xl font-bold uppercase tracking-wide">
              {room?.name ?? "Lobby"}
            </h1>
          </div>

          {room && (
            <button
              onClick={() => {
                navigator.clipboard?.writeText(room.room_code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="shrink-0 rounded-sm border border-border-strong bg-secondary px-4 py-2 text-left transition-colors hover:border-primary/50"
            >
              <span className="label-caps">Room code</span>

              <span className="mt-0.5 block font-mono text-xl font-bold tracking-[0.3em] text-signal">
                {room.room_code}
              </span>

              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {copied ? "Copied" : "Click to copy"}
              </span>
            </button>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Panel
            title="Operatives"
            subtitle={`${readyCount} of ${players.length} ready`}
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 transition-colors hover:bg-secondary/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-border-strong bg-muted font-display text-xs font-bold">
                      {player.username.slice(0, 2).toUpperCase()}
                    </span>

                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-mono text-sm">
                          {player.username}
                        </span>

                        {player.user_id === room?.host_id && (
                          <Badge tone="warning">Host</Badge>
                        )}
                      </div>

                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {player.role}
                      </span>
                    </div>
                  </div>

                  <span className="flex shrink-0 items-center gap-2">
                    <StatusDot
                      tone={player.ready ? "success" : "muted"}
                      pulse={!player.ready}
                    />

                    <span
                      className={`font-display text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
                        player.ready
                          ? "text-success"
                          : "text-muted-foreground"
                      }`}
                    >
                      {player.ready ? "Ready" : "Standby"}
                    </span>
                  </span>
                </li>
              ))}
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
                ].map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3"
                  >
                    <dt className="label-caps">{key}</dt>
                    <dd className="truncate text-right">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex items-center gap-2 rounded-sm border border-warning/40 bg-warning/10 px-3 py-2">
                <StatusDot tone="warning" pulse />

                <span className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-warning">
                  {allReady
                    ? "All operatives ready"
                    : "Awaiting operatives"}
                </span>
              </div>
            </Panel>

            <div className="space-y-2">
  <TacButton
  variant="steel"
  className="w-full"
  onClick={toggleReady}
>
  {players.find((player) => player.user_id === currentUserId)?.ready
    ? "Unready"
    : "Ready Up"}
</TacButton>

  <TacButton
  variant="danger"
  size="lg"
  className="w-full"
  onClick={startGame}
  disabled={!allReady || currentUserId !== room?.host_id}
>
  {currentUserId !== room?.host_id
    ? "Waiting for host"
    : !allReady
      ? "Waiting for operatives"
      : "Start game"}
</TacButton>

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
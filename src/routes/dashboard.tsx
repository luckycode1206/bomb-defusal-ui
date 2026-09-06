import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Badge,
  Panel,
  Stat,
  StatusDot,
  TacButton,
} from "@/components/ui/tactical";
import { recentGames } from "@/lib/mock-data";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Operative Dashboard — Bomb Defusal" },
      {
        name: "description",
        content: "Your squad, recent missions and defusal record.",
      },
      { property: "og:title", content: "Operative Dashboard — Bomb Defusal" },
      {
        property: "og:description",
        content: "Create a team, join with a room code, review missions.",
      },
    ],
  }),
  component: Dashboard,
});

type Profile = {
  id: string;
  username: string;
  rank: string;
  clearance: string;
  defusals: number;
  detonations: number;
};

type Room = {
  id: string;
  room_code: string;
  name: string;
  host_id: string;
  status: string;
};

type RoomPlayer = {
  id: string;
  room_id: string;
  user_id: string;
  role: string;
  ready: boolean;
  joined_at: string;
  profile?: {
    username: string;
  } | undefined;
};

function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadDashboard() {
    try {
      setLoading(true);

      // Get the currently authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Auth error:", authError);
        return;
      }

      if (!user) {
        console.error("No authenticated user found.");
        return;
      }

      // Get the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, username, rank, clearance, defusals, detonations"
        )
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
      } else {
        setProfile(profileData);
      }

      // Find the room the user belongs to
      const { data: roomPlayerData, error: roomPlayerError } =
        await supabase
          .from("room_players")
          .select("room_id")
          .eq("user_id", user.id)
          .maybeSingle();

      if (roomPlayerError) {
        console.error("Room player error:", roomPlayerError);
        return;
      }

      if (!roomPlayerData) {
        setRoom(null);
        setPlayers([]);
        return;
      }

      // Get the room
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("id, room_code, name, host_id, status")
        .eq("id", roomPlayerData.room_id)
        .single();

      if (roomError) {
        console.error("Room error:", roomError);
        return;
      }

      setRoom(roomData);

      // Get all players in this room
      const { data: playersData, error: playersError } = await supabase
        .from("room_players")
        .select("id, room_id, user_id, role, ready, joined_at")
        .eq("room_id", roomData.id)
        .order("joined_at", { ascending: true });

      if (playersError) {
        console.error("Players error:", playersError);
        return;
      }

      if (!playersData || playersData.length === 0) {
        setPlayers([]);
        return;
      }

      // Get profile IDs
      const userIds = playersData.map((player) => player.user_id);

      const { data: profilesData, error: profilesError } =
        await supabase
          .from("profiles")
          .select("id, username")
          .in("id", userIds);

      if (profilesError) {
        console.error("Profiles error:", profilesError);
        return;
      }

      // Create a map of user ID → username
      const profileMap = new Map(
        (profilesData ?? []).map((profile) => [
          profile.id,
          profile.username,
        ])
      );

      // Combine room players with their usernames
      const formattedPlayers: RoomPlayer[] = playersData.map(
        (player) => {
          const username = profileMap.get(player.user_id);

          return {
            id: player.id,
            room_id: player.room_id,
            user_id: player.user_id,
            role: player.role,
            ready: player.ready,
            joined_at: player.joined_at,
            ...(username
              ? {
                  profile: {
                    username,
                  },
                }
              : {}),
          };
        }
      );

      setPlayers(formattedPlayers);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, []);

  if (loading) {
    return (
      <AppShell status="Standby">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Loading operative data...
          </p>
        </div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell status="Standby">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="font-mono text-sm uppercase tracking-widest text-danger">
            Unable to load operative profile.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell status="Standby">
      <div className="animate-rise-in space-y-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-sm border border-primary/40 bg-primary/10 font-display text-lg font-bold text-primary">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                {profile.username}
              </h1>

              <p className="mt-1 truncate font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {profile.rank} · Clearance {profile.clearance}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link to="/lobby" search={{ mode: "create" }}>
  <TacButton variant="danger">Create Team</TacButton>
</Link>

<Link to="/lobby" search={{ mode: "join" }}>
  <TacButton variant="steel">Join Team</TacButton>
</Link>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="Defusals"
            value={profile.defusals}
            tone="success"
          />

          <Stat
            label="Detonations"
            value={profile.detonations}
            tone="danger"
          />

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
                        <StatusDot
                          tone={won ? "success" : "danger"}
                        />

                        <span className="truncate font-display text-sm font-semibold uppercase tracking-wide">
                          {g.team}
                        </span>
                      </div>

                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {g.date} · {g.strikes} strike
                        {g.strikes === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-sm tabular-nums text-muted-foreground">
                        {g.time}
                      </span>

                      <Badge tone={won ? "success" : "danger"}>
                        {g.result}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel
            title="Your team"
            subtitle={room?.name ?? "No active team"}
            action={
              room ? (
                <Badge tone="signal">{room.room_code}</Badge>
              ) : undefined
            }
          >
            {room ? (
              <>
                <ul className="space-y-2">
                  {players.map((player) => (
                    <li
                      key={player.id}
                      className="flex items-center justify-between gap-3 rounded-sm border border-border bg-secondary/40 px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <StatusDot
                          tone={player.ready ? "success" : "muted"}
                        />

                        <span className="min-w-0 truncate font-mono text-sm">
                          {player.profile?.username ?? "Unknown operative"}
                        </span>
                      </div>

                      <Badge
                        tone={
                          player.role === "Defuser"
                            ? "danger"
                            : "signal"
                        }
                      >
                        {player.role}
                      </Badge>
                    </li>
                  ))}
                </ul>

                <Link
  to="/lobby"
  search={{ mode: "create" }}
  className="mt-4 block"
>
                  <TacButton variant="steel" className="w-full">
                    Open lobby
                  </TacButton>
                </Link>
              </>
            ) : (
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  You are not currently assigned to a team.
                </p>

                <Link
  to="/lobby"
  search={{ mode: "create" }}
  className="block"
>
                  <TacButton variant="steel" className="w-full">
                    Find a team
                  </TacButton>
                </Link>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
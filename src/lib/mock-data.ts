export type PlayerRole = "Defuser" | "Expert";

export interface LobbyPlayer {
  id: string;
  name: string;
  role: PlayerRole;
  ready: boolean;
  host: boolean;
}

export const currentPlayer = {
  username: "NIGHTHAWK_07",
  rank: "Sergeant",
  clearance: "LEVEL 3",
  defusals: 42,
  detonations: 11,
};

export const mockTeam = {
  name: "ORDNANCE SQUAD",
  roomCode: "K7-42X",
  missionStatus: "AWAITING OPERATIVES",
};

export const mockPlayers: LobbyPlayer[] = [
  { id: "1", name: "NIGHTHAWK_07", role: "Defuser", ready: true, host: true },
  { id: "2", name: "VOLTA", role: "Expert", ready: true, host: false },
  { id: "3", name: "CINDER", role: "Expert", ready: false, host: false },
  { id: "4", name: "MAGPIE", role: "Expert", ready: true, host: false },
];

export const recentGames = [
  { id: "g1", team: "ORDNANCE SQUAD", result: "DEFUSED", time: "03:12", strikes: 1, date: "Today" },
  { id: "g2", team: "ORDNANCE SQUAD", result: "DETONATED", time: "05:00", strikes: 3, date: "Yesterday" },
  { id: "g3", team: "RED PROTOCOL", result: "DEFUSED", time: "02:41", strikes: 0, date: "2 days ago" },
  { id: "g4", team: "RED PROTOCOL", result: "DEFUSED", time: "04:28", strikes: 2, date: "4 days ago" },
];

export const wireColors = ["red", "blue", "yellow", "white", "black"] as const;
export type WireColor = (typeof wireColors)[number];

export const mockWires: WireColor[] = ["blue", "red", "white", "yellow", "black"];

export const mockResult = {
  victory: true,
  team: mockTeam.name,
  time: "03:47",
  strikes: 1,
  modulesSolved: 3,
  modulesTotal: 3,
};

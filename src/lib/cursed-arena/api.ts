/**
 * API Client for Cursed Arena
 * 
 * Simplified API functions for fetching and mutating data.
 * In production, this would integrate with Appwrite SDK.
 */

import { Tournament, Team, Player, Match } from '@/types/cursed-arena/entities';

// Mock data storage
let mockTournaments: Tournament[] = [
  {
    $id: '1',
    name: 'Summer Championship 2024',
    game: 'League of Legends',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    prizePool: 100000,
    status: 'upcoming',
    maxTeams: 16,
    description: 'The biggest League of Legends tournament of the summer',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
  {
    $id: '2',
    name: 'Neon Nights Invitational',
    game: 'Valorant',
    startDate: new Date().toISOString(),
    prizePool: 50000,
    status: 'live',
    maxTeams: 8,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
];

let mockTeams: Team[] = [
  { $id: '1', name: 'Shadow Legends', tag: 'SL', region: 'NA', membersCount: 5, $createdAt: new Date().toISOString(), $updatedAt: new Date().toISOString() },
  { $id: '2', name: 'Neon Knights', tag: 'NK', region: 'EU', membersCount: 5, $createdAt: new Date().toISOString(), $updatedAt: new Date().toISOString() },
];

let mockPlayers: Player[] = [
  { $id: '1', gamertag: 'DarkMage', realName: 'John Doe', team: '1', role: 'Mid', country: 'USA', $createdAt: new Date().toISOString(), $updatedAt: new Date().toISOString() },
  { $id: '2', gamertag: 'ShadowStrike', realName: 'Jane Smith', team: '1', role: 'ADC', country: 'USA', $createdAt: new Date().toISOString(), $updatedAt: new Date().toISOString() },
];

let mockMatches: Match[] = [
  {
    $id: '1',
    tournament: '2',
    teamA: '1',
    teamB: '2',
    scoreA: 1,
    scoreB: 1,
    status: 'live',
    round: 'Finals',
    scheduledTime: new Date().toISOString(),
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
];

// Tournaments
export async function fetchTournaments(filters?: { status?: string; limit?: number }): Promise<Tournament[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let results = [...mockTournaments];
  if (filters?.status) {
    results = results.filter((t) => t.status === filters.status);
  }
  if (filters?.limit) {
    results = results.slice(0, filters.limit);
  }
  return results;
}

export async function fetchTournament(id: string): Promise<Tournament> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const tournament = mockTournaments.find((t) => t.$id === id);
  if (!tournament) throw new Error('Tournament not found');
  return tournament;
}

export async function createTournament(data: Partial<Tournament>): Promise<Tournament> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Validation
  if (!data.name || data.name.length < 3 || data.name.length > 100) {
    throw new Error('Tournament name must be between 3 and 100 characters');
  }
  if (data.maxTeams && (data.maxTeams < 2 || data.maxTeams > 64)) {
    throw new Error('Max teams must be between 2 and 64');
  }
  if (data.prizePool && data.prizePool < 0) {
    throw new Error('Prize pool must be non-negative');
  }
  
  const newTournament: Tournament = {
    $id: String(Date.now()),
    ...data,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  } as Tournament;
  mockTournaments.push(newTournament);
  return newTournament;
}

export async function countTournaments(): Promise<number> {
  return mockTournaments.length;
}

// Teams
export async function fetchTeams(): Promise<Team[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockTeams;
}

export async function fetchTeam(id: string): Promise<Team> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const team = mockTeams.find((t) => t.$id === id);
  if (!team) throw new Error('Team not found');
  return team;
}

export async function createTeam(data: Partial<Team>): Promise<Team> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Validation
  if (!data.name || data.name.length < 2 || data.name.length > 50) {
    throw new Error('Team name must be between 2 and 50 characters');
  }
  if (!data.tag || data.tag.length < 2 || data.tag.length > 5) {
    throw new Error('Team tag must be between 2 and 5 characters');
  }
  
  const newTeam: Team = {
    $id: String(Date.now()),
    ...data,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  } as Team;
  mockTeams.push(newTeam);
  return newTeam;
}

export async function countTeams(): Promise<number> {
  return mockTeams.length;
}

// Players
export async function fetchPlayers(filters?: { team?: string }): Promise<Player[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let results = [...mockPlayers];
  if (filters?.team) {
    results = results.filter((p) => p.team === filters.team);
  }
  return results;
}

export async function createPlayer(data: Partial<Player>): Promise<Player> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Validation
  if (!data.gamertag || data.gamertag.length < 2 || data.gamertag.length > 30) {
    throw new Error('Gamertag must be between 2 and 30 characters');
  }
  
  const newPlayer: Player = {
    $id: String(Date.now()),
    ...data,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  } as Player;
  mockPlayers.push(newPlayer);
  return newPlayer;
}

export async function countPlayers(): Promise<number> {
  return mockPlayers.length;
}

// Matches
export async function fetchMatches(filters?: { status?: string; tournament?: string; team?: string }): Promise<Match[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let results = [...mockMatches];
  if (filters?.status) {
    results = results.filter((m) => m.status === filters.status);
  }
  if (filters?.tournament) {
    results = results.filter((m) => m.tournament === filters.tournament);
  }
  if (filters?.team) {
    results = results.filter((m) => m.teamA === filters.team || m.teamB === filters.team);
  }
  return results;
}

export async function createMatch(data: Partial<Match>): Promise<Match> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newMatch: Match = {
    $id: String(Date.now()),
    scoreA: 0,
    scoreB: 0,
    ...data,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  } as Match;
  mockMatches.push(newMatch);
  return newMatch;
}

export async function updateMatchScores(matchId: string, scoreA: number, scoreB: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Validation
  if (scoreA < 0 || scoreB < 0) {
    throw new Error('Match scores must be non-negative');
  }
  
  const match = mockMatches.find((m) => m.$id === matchId);
  if (match) {
    match.scoreA = scoreA;
    match.scoreB = scoreB;
  }
}

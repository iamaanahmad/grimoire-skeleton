/**
 * API Client for Cursed Arena
 * 
 * Real Appwrite integration for fetching and mutating data.
 */

import { ID } from 'appwrite';
import { 
  databases, 
  Query,
  CURSED_ARENA_DB,
  TOURNAMENTS_COLLECTION,
  TEAMS_COLLECTION,
  MATCHES_COLLECTION,
  PLAYERS_COLLECTION
} from '@/core/lib/appwrite';
import { Tournament, Team, Player, Match } from '@/types/cursed-arena/entities';

// ============================================================================
// TOURNAMENTS
// ============================================================================

export async function fetchTournaments(filters?: { status?: string; limit?: number }): Promise<Tournament[]> {
  const queries: string[] = [];
  
  if (filters?.status) {
    queries.push(Query.equal('status', filters.status));
  }
  if (filters?.limit) {
    queries.push(Query.limit(filters.limit));
  }
  
  queries.push(Query.orderDesc('$createdAt'));
  
  const response = await databases.listDocuments(
    CURSED_ARENA_DB,
    TOURNAMENTS_COLLECTION,
    queries
  );
  
  return response.documents as unknown as Tournament[];
}

export async function fetchTournament(id: string): Promise<Tournament> {
  const response = await databases.getDocument(
    CURSED_ARENA_DB,
    TOURNAMENTS_COLLECTION,
    id
  );
  return response as unknown as Tournament;
}

export async function createTournament(data: Partial<Tournament>): Promise<Tournament> {
  // Validation
  if (!data.name || data.name.length < 3 || data.name.length > 100) {
    throw new Error('Tournament name must be between 3 and 100 characters');
  }
  if (data.prizePool && data.prizePool < 0) {
    throw new Error('Prize pool must be non-negative');
  }
  
  const response = await databases.createDocument(
    CURSED_ARENA_DB,
    TOURNAMENTS_COLLECTION,
    ID.unique(),
    {
      name: data.name,
      game: data.game || 'League of Legends',
      startDate: data.startDate || new Date().toISOString(),
      prizePool: data.prizePool || 0,
      status: data.status || 'upcoming',
    }
  );
  
  return response as unknown as Tournament;
}

export async function updateTournament(id: string, data: Partial<Tournament>): Promise<Tournament> {
  const updateData: Record<string, unknown> = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.game !== undefined) updateData.game = data.game;
  if (data.startDate !== undefined) updateData.startDate = data.startDate;
  if (data.prizePool !== undefined) updateData.prizePool = data.prizePool;
  if (data.status !== undefined) updateData.status = data.status;
  
  const response = await databases.updateDocument(
    CURSED_ARENA_DB,
    TOURNAMENTS_COLLECTION,
    id,
    updateData
  );
  
  return response as unknown as Tournament;
}

export async function deleteTournament(id: string): Promise<void> {
  await databases.deleteDocument(CURSED_ARENA_DB, TOURNAMENTS_COLLECTION, id);
}

export async function countTournaments(): Promise<number> {
  const response = await databases.listDocuments(
    CURSED_ARENA_DB,
    TOURNAMENTS_COLLECTION,
    [Query.limit(1)]
  );
  return response.total;
}

// ============================================================================
// TEAMS
// ============================================================================

export async function fetchTeams(filters?: { region?: string; limit?: number }): Promise<Team[]> {
  const queries: string[] = [];
  
  if (filters?.region) {
    queries.push(Query.equal('region', filters.region));
  }
  if (filters?.limit) {
    queries.push(Query.limit(filters.limit));
  }
  
  queries.push(Query.orderDesc('$createdAt'));
  
  const response = await databases.listDocuments(
    CURSED_ARENA_DB,
    TEAMS_COLLECTION,
    queries
  );
  
  return response.documents as unknown as Team[];
}

export async function fetchTeam(id: string): Promise<Team> {
  const response = await databases.getDocument(
    CURSED_ARENA_DB,
    TEAMS_COLLECTION,
    id
  );
  return response as unknown as Team;
}

export async function createTeam(data: Partial<Team>): Promise<Team> {
  // Validation
  if (!data.name || data.name.length < 2 || data.name.length > 50) {
    throw new Error('Team name must be between 2 and 50 characters');
  }
  if (!data.tag || data.tag.length < 2 || data.tag.length > 5) {
    throw new Error('Team tag must be between 2 and 5 characters');
  }
  
  const response = await databases.createDocument(
    CURSED_ARENA_DB,
    TEAMS_COLLECTION,
    ID.unique(),
    {
      name: data.name,
      tag: data.tag,
      membersCount: data.membersCount || 0,
      region: data.region || 'NA',
    }
  );
  
  return response as unknown as Team;
}

export async function updateTeam(id: string, data: Partial<Team>): Promise<Team> {
  const updateData: Record<string, unknown> = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.tag !== undefined) updateData.tag = data.tag;
  if (data.membersCount !== undefined) updateData.membersCount = data.membersCount;
  if (data.region !== undefined) updateData.region = data.region;
  
  const response = await databases.updateDocument(
    CURSED_ARENA_DB,
    TEAMS_COLLECTION,
    id,
    updateData
  );
  
  return response as unknown as Team;
}

export async function deleteTeam(id: string): Promise<void> {
  await databases.deleteDocument(CURSED_ARENA_DB, TEAMS_COLLECTION, id);
}

export async function countTeams(): Promise<number> {
  const response = await databases.listDocuments(
    CURSED_ARENA_DB,
    TEAMS_COLLECTION,
    [Query.limit(1)]
  );
  return response.total;
}

// ============================================================================
// PLAYERS
// ============================================================================

export async function fetchPlayers(filters?: { team?: string; limit?: number }): Promise<Player[]> {
  const queries: string[] = [];
  
  if (filters?.team) {
    queries.push(Query.equal('teamId', filters.team));
  }
  if (filters?.limit) {
    queries.push(Query.limit(filters.limit));
  }
  
  queries.push(Query.orderDesc('$createdAt'));
  
  const response = await databases.listDocuments(
    CURSED_ARENA_DB,
    PLAYERS_COLLECTION,
    queries
  );
  
  return response.documents as unknown as Player[];
}

export async function fetchPlayer(id: string): Promise<Player> {
  const response = await databases.getDocument(
    CURSED_ARENA_DB,
    PLAYERS_COLLECTION,
    id
  );
  return response as unknown as Player;
}

export async function createPlayer(data: Partial<Player>): Promise<Player> {
  // Validation
  if (!data.gamertag || data.gamertag.length < 2 || data.gamertag.length > 30) {
    throw new Error('Gamertag must be between 2 and 30 characters');
  }
  
  const response = await databases.createDocument(
    CURSED_ARENA_DB,
    PLAYERS_COLLECTION,
    ID.unique(),
    {
      name: data.realName || data.gamertag,
      playerId: ID.unique(),
      gamertag: data.gamertag,
      realName: data.realName || '',
      teamId: data.team || '',
      role: data.role || 'Flex',
      country: data.country || '',
    }
  );
  
  return response as unknown as Player;
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<Player> {
  const updateData: Record<string, unknown> = {};
  
  if (data.gamertag !== undefined) updateData.gamertag = data.gamertag;
  if (data.realName !== undefined) {
    updateData.realName = data.realName;
    updateData.name = data.realName || data.gamertag;
  }
  if (data.team !== undefined) updateData.teamId = data.team;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.country !== undefined) updateData.country = data.country;
  
  const response = await databases.updateDocument(
    CURSED_ARENA_DB,
    PLAYERS_COLLECTION,
    id,
    updateData
  );
  
  return response as unknown as Player;
}

export async function deletePlayer(id: string): Promise<void> {
  await databases.deleteDocument(CURSED_ARENA_DB, PLAYERS_COLLECTION, id);
}

export async function countPlayers(): Promise<number> {
  const response = await databases.listDocuments(
    CURSED_ARENA_DB,
    PLAYERS_COLLECTION,
    [Query.limit(1)]
  );
  return response.total;
}

// ============================================================================
// MATCHES
// ============================================================================

export async function fetchMatches(filters?: { 
  status?: string; 
  tournament?: string; 
  team?: string;
  limit?: number;
}): Promise<Match[]> {
  const queries: string[] = [];
  
  if (filters?.status) {
    queries.push(Query.equal('status', filters.status));
  }
  if (filters?.tournament) {
    queries.push(Query.equal('tournamentId', filters.tournament));
  }
  if (filters?.limit) {
    queries.push(Query.limit(filters.limit));
  }
  
  queries.push(Query.orderDesc('$createdAt'));
  
  const response = await databases.listDocuments(
    CURSED_ARENA_DB,
    MATCHES_COLLECTION,
    queries
  );
  
  // Map Appwrite field names to our interface
  const matches = response.documents.map(doc => ({
    $id: doc.$id,
    tournament: doc.tournamentId,
    teamA: doc.teamAId,
    teamB: doc.teamBId,
    scoreA: doc.scoreA || 0,
    scoreB: doc.scoreB || 0,
    status: doc.status,
    round: doc.round || '',
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
  }));
  
  return matches as Match[];
}

export async function fetchMatch(id: string): Promise<Match> {
  const doc = await databases.getDocument(
    CURSED_ARENA_DB,
    MATCHES_COLLECTION,
    id
  );
  
  return {
    $id: doc.$id,
    tournament: doc.tournamentId,
    teamA: doc.teamAId,
    teamB: doc.teamBId,
    scoreA: doc.scoreA || 0,
    scoreB: doc.scoreB || 0,
    status: doc.status,
    round: doc.round || '',
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
  } as Match;
}

export async function createMatch(data: Partial<Match>): Promise<Match> {
  const response = await databases.createDocument(
    CURSED_ARENA_DB,
    MATCHES_COLLECTION,
    ID.unique(),
    {
      tournamentId: data.tournament,
      teamAId: data.teamA,
      teamBId: data.teamB,
      scoreA: data.scoreA || 0,
      scoreB: data.scoreB || 0,
      status: data.status || 'scheduled',
      round: data.round || '',
    }
  );
  
  return {
    $id: response.$id,
    tournament: response.tournamentId,
    teamA: response.teamAId,
    teamB: response.teamBId,
    scoreA: response.scoreA || 0,
    scoreB: response.scoreB || 0,
    status: response.status,
    round: response.round || '',
    $createdAt: response.$createdAt,
    $updatedAt: response.$updatedAt,
  } as Match;
}

export async function updateMatch(id: string, data: Partial<Match>): Promise<Match> {
  const updateData: Record<string, unknown> = {};
  
  if (data.tournament !== undefined) updateData.tournamentId = data.tournament;
  if (data.teamA !== undefined) updateData.teamAId = data.teamA;
  if (data.teamB !== undefined) updateData.teamBId = data.teamB;
  if (data.scoreA !== undefined) updateData.scoreA = data.scoreA;
  if (data.scoreB !== undefined) updateData.scoreB = data.scoreB;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.round !== undefined) updateData.round = data.round;
  
  const response = await databases.updateDocument(
    CURSED_ARENA_DB,
    MATCHES_COLLECTION,
    id,
    updateData
  );
  
  return {
    $id: response.$id,
    tournament: response.tournamentId,
    teamA: response.teamAId,
    teamB: response.teamBId,
    scoreA: response.scoreA || 0,
    scoreB: response.scoreB || 0,
    status: response.status,
    round: response.round || '',
    $createdAt: response.$createdAt,
    $updatedAt: response.$updatedAt,
  } as Match;
}

export async function updateMatchScores(matchId: string, scoreA: number, scoreB: number): Promise<void> {
  if (scoreA < 0 || scoreB < 0) {
    throw new Error('Match scores must be non-negative');
  }
  
  await databases.updateDocument(
    CURSED_ARENA_DB,
    MATCHES_COLLECTION,
    matchId,
    { scoreA, scoreB }
  );
}

export async function deleteMatch(id: string): Promise<void> {
  await databases.deleteDocument(CURSED_ARENA_DB, MATCHES_COLLECTION, id);
}

export async function countMatches(): Promise<number> {
  const response = await databases.listDocuments(
    CURSED_ARENA_DB,
    MATCHES_COLLECTION,
    [Query.limit(1)]
  );
  return response.total;
}

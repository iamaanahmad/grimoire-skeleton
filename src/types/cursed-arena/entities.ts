/**
 * Cursed Arena Entity Types
 * 
 * TypeScript interfaces for all entities in the application.
 * Generated from entity definitions.
 */

/**
 * Tournament - Competitive gaming event
 */
export interface Tournament {
  $id: string;
  name: string;
  game: 'League of Legends' | 'Dota 2' | 'CS:GO' | 'Valorant' | 'Overwatch';
  startDate: string;
  endDate?: string;
  prizePool?: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  maxTeams: number;
  description?: string;
  $createdAt: string;
  $updatedAt: string;
}

/**
 * Team - Esports organization
 */
export interface Team {
  $id: string;
  name: string;
  tag: string;
  logo?: string;
  membersCount: number;
  region?: 'NA' | 'EU' | 'ASIA' | 'SA' | 'OCE';
  $createdAt: string;
  $updatedAt: string;
}

/**
 * Player - Individual competitor
 */
export interface Player {
  $id: string;
  gamertag: string;
  realName?: string;
  team?: string; // Team ID reference
  role?: 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Support' | 'Flex';
  country?: string;
  $createdAt: string;
  $updatedAt: string;
}

/**
 * Match - Game between two teams
 */
export interface Match {
  $id: string;
  tournament: string; // Tournament ID reference
  teamA: string; // Team ID reference
  teamB: string; // Team ID reference
  scoreA: number;
  scoreB: number;
  status: 'scheduled' | 'live' | 'completed';
  scheduledTime?: string;
  round?: string;
  $createdAt: string;
  $updatedAt: string;
}

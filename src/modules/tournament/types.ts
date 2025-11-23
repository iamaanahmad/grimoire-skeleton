/**
 * Tournament Type Definitions
 * Generated automatically by Grimoire Entity System
 */

export interface Tournament {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  game: string;
  startDate: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  prizePool?: number;
}

export interface CreateTournamentDTO {
  name: string;
  game: string;
  startDate: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  prizePool?: number;
}

export interface UpdateTournamentDTO extends Partial<CreateTournamentDTO> {
  $id: string;
}

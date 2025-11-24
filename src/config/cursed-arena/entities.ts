/**
 * Cursed Arena Entity Definitions
 * 
 * Declarative entity configurations for tournaments, teams, players, and matches.
 * These definitions drive the entity generator to create CRUD functionality.
 */

import { EntityDefinition } from '@/core/types/entity';

/**
 * Tournament Entity
 * Represents competitive gaming events with teams, matches, and prizes.
 */
export const tournament: EntityDefinition = {
  fields: {
    name: {
      type: 'string',
      required: true,
      label: 'Tournament Name',
      validation: { min: 3, max: 100 },
    },
    game: {
      type: 'enum',
      required: true,
      label: 'Game',
      options: ['League of Legends', 'Dota 2', 'CS:GO', 'Valorant', 'Overwatch'],
    },
    startDate: {
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    endDate: {
      type: 'date',
      label: 'End Date',
    },
    prizePool: {
      type: 'number',
      label: 'Prize Pool',
      validation: { min: 0 },
    },
    status: {
      type: 'enum',
      label: 'Status',
      options: ['upcoming', 'live', 'completed', 'cancelled'],
      defaultValue: 'upcoming',
    },
    maxTeams: {
      type: 'number',
      label: 'Max Teams',
      validation: { min: 2, max: 64 },
      defaultValue: 16,
    },
    description: {
      type: 'string',
      label: 'Description',
    },
  },
  permissions: {
    read: ['admin', 'staff', 'user'],
    write: ['admin', 'staff'],
    delete: ['admin', 'staff'],
  },
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '🏆',
    singular: 'Tournament',
    plural: 'Tournaments',
    listColumns: ['name', 'game', 'startDate', 'status', 'prizePool'],
    sortBy: 'startDate',
    sortOrder: 'desc',
  },
  collectionId: 'tournaments',
  databaseId: 'cursed_arena',
};

/**
 * Team Entity
 * Represents esports organizations competing in tournaments.
 */
export const team: EntityDefinition = {
  fields: {
    name: {
      type: 'string',
      required: true,
      label: 'Team Name',
      validation: { min: 2, max: 50 },
    },
    tag: {
      type: 'string',
      required: true,
      label: 'Team Tag',
      validation: { min: 2, max: 5 },
    },
    logo: {
      type: 'string',
      label: 'Logo URL',
    },
    membersCount: {
      type: 'number',
      label: 'Members Count',
      defaultValue: 0,
    },
    region: {
      type: 'enum',
      label: 'Region',
      options: ['NA', 'EU', 'ASIA', 'SA', 'OCE'],
    },
  },
  permissions: {
    read: ['admin', 'staff', 'user'],
    write: ['admin', 'staff'],
    delete: ['admin', 'staff'],
  },
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '⚔️',
    singular: 'Team',
    plural: 'Teams',
    listColumns: ['name', 'tag', 'region', 'membersCount'],
    sortBy: 'name',
    sortOrder: 'asc',
  },
  collectionId: 'teams',
  databaseId: 'cursed_arena',
};

/**
 * Player Entity
 * Represents individual competitors affiliated with teams.
 */
export const player: EntityDefinition = {
  fields: {
    gamertag: {
      type: 'string',
      required: true,
      label: 'Gamertag',
      validation: { min: 2, max: 30 },
    },
    realName: {
      type: 'string',
      label: 'Real Name',
    },
    team: {
      type: 'reference',
      label: 'Team',
      reference: 'team',
    },
    role: {
      type: 'enum',
      label: 'Role',
      options: ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Flex'],
    },
    country: {
      type: 'string',
      label: 'Country',
    },
  },
  permissions: {
    read: ['admin', 'staff', 'user'],
    write: ['admin', 'staff'],
    delete: ['admin', 'staff'],
  },
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '🎮',
    singular: 'Player',
    plural: 'Players',
    listColumns: ['gamertag', 'team', 'role', 'country'],
    sortBy: 'gamertag',
    sortOrder: 'asc',
  },
  collectionId: 'players',
  databaseId: 'cursed_arena',
};

/**
 * Match Entity
 * Represents individual games between two teams in a tournament.
 */
export const match: EntityDefinition = {
  fields: {
    tournament: {
      type: 'reference',
      label: 'Tournament',
      reference: 'tournament',
      required: true,
    },
    teamA: {
      type: 'reference',
      label: 'Team A',
      reference: 'team',
      required: true,
    },
    teamB: {
      type: 'reference',
      label: 'Team B',
      reference: 'team',
      required: true,
    },
    scoreA: {
      type: 'number',
      label: 'Score A',
      defaultValue: 0,
      validation: { min: 0 },
    },
    scoreB: {
      type: 'number',
      label: 'Score B',
      defaultValue: 0,
      validation: { min: 0 },
    },
    status: {
      type: 'enum',
      label: 'Status',
      options: ['scheduled', 'live', 'completed'],
      defaultValue: 'scheduled',
    },
    scheduledTime: {
      type: 'date',
      label: 'Scheduled Time',
    },
    round: {
      type: 'string',
      label: 'Round',
    },
  },
  permissions: {
    read: ['admin', 'staff', 'user'],
    write: ['admin', 'staff'],
    delete: ['admin', 'staff'],
  },
  features: ['list', 'create', 'edit', 'detail', 'delete'],
  display: {
    icon: '⚡',
    singular: 'Match',
    plural: 'Matches',
    listColumns: ['tournament', 'teamA', 'teamB', 'status', 'scheduledTime'],
    sortBy: 'scheduledTime',
    sortOrder: 'asc',
  },
  collectionId: 'matches',
  databaseId: 'cursed_arena',
};

/**
 * Entity Registry
 * Central registry of all entities in the Cursed Arena application.
 */
export const entityRegistry = {
  tournament,
  team,
  player,
  match,
};

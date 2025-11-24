/**
 * Cursed Arena End-to-End Tests
 * 
 * Tests complete user flows through the application.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createTournament, 
  createTeam, 
  createPlayer, 
  createMatch,
  updateMatchScores,
  fetchTournaments,
  fetchTeams,
  fetchPlayers,
  fetchMatches
} from '../src/lib/api';

describe('Tournament Management Flow', () => {
  it('should create tournament, add teams, create matches, and update scores', async () => {
    // 1. Create tournament
    const tournament = await createTournament({
      name: 'Test Tournament',
      game: 'League of Legends',
      startDate: new Date().toISOString(),
      maxTeams: 8,
      status: 'upcoming',
    });

    expect(tournament.$id).toBeDefined();
    expect(tournament.name).toBe('Test Tournament');

    // 2. Create teams
    const teamA = await createTeam({ 
      name: 'Team A', 
      tag: 'TMA',
      membersCount: 5,
    });
    const teamB = await createTeam({ 
      name: 'Team B', 
      tag: 'TMB',
      membersCount: 5,
    });

    expect(teamA.$id).toBeDefined();
    expect(teamB.$id).toBeDefined();

    // 3. Create players
    const player1 = await createPlayer({
      gamertag: 'TestPlayer1',
      team: teamA.$id,
      role: 'Mid',
    });

    expect(player1.$id).toBeDefined();
    expect(player1.team).toBe(teamA.$id);

    // 4. Create match
    const match = await createMatch({
      tournament: tournament.$id,
      teamA: teamA.$id,
      teamB: teamB.$id,
      status: 'scheduled',
      round: 'Finals',
    });

    expect(match.$id).toBeDefined();
    expect(match.scoreA).toBe(0);
    expect(match.scoreB).toBe(0);

    // 5. Update scores
    await updateMatchScores(match.$id, 2, 1);

    const matches = await fetchMatches({ tournament: tournament.$id });
    const updatedMatch = matches.find(m => m.$id === match.$id);
    
    expect(updatedMatch?.scoreA).toBe(2);
    expect(updatedMatch?.scoreB).toBe(1);
  });

  it('should filter tournaments by status', async () => {
    const upcomingTournaments = await fetchTournaments({ status: 'upcoming' });
    const liveTournaments = await fetchTournaments({ status: 'live' });

    expect(upcomingTournaments.every(t => t.status === 'upcoming')).toBe(true);
    expect(liveTournaments.every(t => t.status === 'live')).toBe(true);
  });

  it('should filter players by team', async () => {
    const teams = await fetchTeams();
    if (teams.length > 0) {
      const teamPlayers = await fetchPlayers({ team: teams[0].$id });
      expect(teamPlayers.every(p => p.team === teams[0].$id)).toBe(true);
    }
  });
});

describe('Data Validation', () => {
  it('should validate tournament name length', async () => {
    try {
      await createTournament({
        name: 'AB', // Too short (min 3)
        game: 'CS:GO',
        startDate: new Date().toISOString(),
        maxTeams: 8,
        status: 'upcoming',
      });
      expect.fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.message).toContain('name');
    }
  });

  it('should validate team tag length', async () => {
    try {
      await createTeam({
        name: 'Test Team',
        tag: 'T', // Too short (min 2)
        membersCount: 5,
      });
      expect.fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.message).toContain('tag');
    }
  });

  it('should validate match scores are non-negative', async () => {
    const match = await createMatch({
      tournament: '1',
      teamA: '1',
      teamB: '2',
      scoreA: 0,
      scoreB: 0,
      status: 'scheduled',
    });

    try {
      await updateMatchScores(match.$id, -1, 0);
      expect.fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.message).toContain('score');
    }
  });
});

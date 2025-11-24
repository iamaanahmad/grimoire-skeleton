/**
 * Cursed Arena Seed Script
 * 
 * Generates realistic sample data for development and demos.
 * Creates tournaments, teams, players, and matches.
 */

import { Tournament, Team, Player, Match } from '@/types/cursed-arena/entities';

// Sample data generators
function generateTournaments(): Partial<Tournament>[] {
  return [
    {
      name: 'Summer Championship 2024',
      game: 'League of Legends',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      prizePool: 100000,
      status: 'upcoming',
      maxTeams: 16,
      description: 'The biggest League of Legends tournament of the summer',
    },
    {
      name: 'Neon Nights Invitational',
      game: 'Valorant',
      startDate: new Date().toISOString(),
      prizePool: 50000,
      status: 'live',
      maxTeams: 8,
      description: 'Elite Valorant teams compete for glory',
    },
    {
      name: 'Winter Clash 2023',
      game: 'CS:GO',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      prizePool: 75000,
      status: 'completed',
      maxTeams: 16,
    },
  ];
}

function generateTeams(): Partial<Team>[] {
  return [
    { name: 'Shadow Legends', tag: 'SL', region: 'NA', membersCount: 5 },
    { name: 'Neon Knights', tag: 'NK', region: 'EU', membersCount: 5 },
    { name: 'Cyber Samurai', tag: 'CS', region: 'ASIA', membersCount: 5 },
    { name: 'Void Walkers', tag: 'VW', region: 'NA', membersCount: 5 },
    { name: 'Crimson Tide', tag: 'CT', region: 'EU', membersCount: 5 },
    { name: 'Ghost Protocol', tag: 'GP', region: 'SA', membersCount: 5 },
  ];
}

function generatePlayers(teamIds: string[]): Partial<Player>[] {
  const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'] as const;
  const gamertags = [
    'DarkMage', 'ShadowStrike', 'NeonBlade', 'CyberNinja', 'VoidWalker',
    'PhantomKing', 'StormBreaker', 'IceQueen', 'FireDragon', 'ThunderGod',
    'MoonKnight', 'SunWarrior', 'StarGazer', 'NightHawk', 'DayBreaker',
  ];

  const players: Partial<Player>[] = [];
  teamIds.forEach((teamId, teamIndex) => {
    roles.forEach((role, roleIndex) => {
      players.push({
        gamertag: gamertags[teamIndex * 5 + roleIndex],
        team: teamId,
        role,
        country: ['USA', 'UK', 'KR', 'BR', 'DE'][teamIndex % 5],
      });
    });
  });

  return players;
}

function generateMatches(tournamentIds: string[], teamIds: string[]): Partial<Match>[] {
  return [
    {
      tournament: tournamentIds[1], // Live tournament
      teamA: teamIds[0],
      teamB: teamIds[1],
      scoreA: 1,
      scoreB: 1,
      status: 'live',
      round: 'Finals',
      scheduledTime: new Date().toISOString(),
    },
    {
      tournament: tournamentIds[0], // Upcoming tournament
      teamA: teamIds[2],
      teamB: teamIds[3],
      scoreA: 0,
      scoreB: 0,
      status: 'scheduled',
      round: 'Quarter Finals',
      scheduledTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      tournament: tournamentIds[2], // Completed tournament
      teamA: teamIds[4],
      teamB: teamIds[5],
      scoreA: 2,
      scoreB: 1,
      status: 'completed',
      round: 'Finals',
      scheduledTime: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

/**
 * Main seed function
 * In production, this would use Appwrite SDK to create documents
 */
export async function seed() {
  console.log('🎮 Starting Cursed Arena seed...');

  try {
    // Create tournaments
    console.log('Creating tournaments...');
    const tournaments = generateTournaments();
    const tournamentIds = tournaments.map((_, i) => `tournament_${i + 1}`);

    // Create teams
    console.log('Creating teams...');
    const teams = generateTeams();
    const teamIds = teams.map((_, i) => `team_${i + 1}`);

    // Create players
    console.log('Creating players...');
    const players = generatePlayers(teamIds);

    // Create matches
    console.log('Creating matches...');
    const matches = generateMatches(tournamentIds, teamIds);

    console.log('✅ Seed completed successfully!');
    console.log(`   - ${tournaments.length} tournaments`);
    console.log(`   - ${teams.length} teams`);
    console.log(`   - ${players.length} players`);
    console.log(`   - ${matches.length} matches`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seed();
}

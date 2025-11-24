/**
 * Cursed Arena Dashboard
 * 
 * Main dashboard showing upcoming tournaments, live matches, and statistics.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TournamentCard } from '@/components/cursed-arena/TournamentCard';
import { fetchTournaments, fetchMatches, countTournaments, countTeams, countPlayers } from '@/lib/cursed-arena/api';
import { Tournament, Match } from '@/types/cursed-arena/entities';
import { Trophy, Users, Gamepad2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState({ totalTournaments: 0, totalTeams: 0, totalPlayers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tournaments, matches, tournamentCount, teamCount, playerCount] = await Promise.all([
        fetchTournaments({ status: 'upcoming', limit: 5 }),
        fetchMatches({ status: 'live' }),
        countTournaments(),
        countTeams(),
        countPlayers(),
      ]);
      setUpcomingTournaments(tournaments);
      setLiveMatches(matches);
      setStats({ totalTournaments: tournamentCount, totalTeams: teamCount, totalPlayers: playerCount });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1
            className="text-4xl font-bold mb-2 neon-glow"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Cursed Arena
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Esports tournament management platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-lg animate-entrance animate-hover"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-primary)',
              transition: `all var(--animation-duration-normal) var(--animation-easing)`,
            }}
          >
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8" style={{ color: 'var(--color-accent-primary)' }} />
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {stats.totalTournaments}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                  Tournaments
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-lg animate-entrance animate-hover"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-primary)',
              transition: `all var(--animation-duration-normal) var(--animation-easing)`,
            }}
          >
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8" style={{ color: 'var(--color-accent-primary)' }} />
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {stats.totalTeams}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                  Teams
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-lg animate-entrance animate-hover"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border-primary)',
              transition: `all var(--animation-duration-normal) var(--animation-easing)`,
            }}
          >
            <div className="flex items-center gap-4">
              <Gamepad2 className="w-8 h-8" style={{ color: 'var(--color-accent-primary)' }} />
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {stats.totalPlayers}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                  Players
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Live Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveMatches.map((match) => (
                <div
                  key={match.$id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-status-success)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="live-indicator text-xs font-bold" style={{ color: 'var(--color-status-success)' }}>
                      ● LIVE
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {match.round}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span style={{ color: 'var(--color-text-primary)' }}>Team A</span>
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                      {match.scoreA} - {match.scoreB}
                    </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>Team B</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Tournaments */}
        <section>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            Upcoming Tournaments
          </h2>
          {upcomingTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.$id}
                  tournament={tournament}
                  onClick={() => router.push(`/tournaments/${tournament.$id}`)}
                />
              ))}
            </div>
          ) : (
            <div
              className="p-8 rounded-lg text-center"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p style={{ color: 'var(--color-text-tertiary)' }}>
                No upcoming tournaments
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

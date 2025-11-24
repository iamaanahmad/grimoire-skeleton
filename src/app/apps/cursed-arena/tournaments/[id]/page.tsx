/**
 * Tournament Detail Page
 * 
 * Shows complete tournament information with matches and bracket view.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tournament, Match, Team } from '@/types/cursed-arena/entities';
import { fetchTournament, fetchMatches, fetchTeams } from '@/lib/cursed-arena/api';
import { BracketView } from '@/components/cursed-arena/BracketView';
import { Calendar, Trophy, Users, Edit, Trash2 } from 'lucide-react';

export default function TournamentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tournamentData, matchesData, teamsData] = await Promise.all([
        fetchTournament(params.id),
        fetchMatches({ tournament: params.id }),
        fetchTeams(),
      ]);
      
      setTournament(tournamentData);
      setMatches(matchesData);
      
      const teamsMap = teamsData.reduce((acc: Record<string, Team>, team: Team) => {
        acc[team.$id] = team;
        return acc;
      }, {} as Record<string, Team>);
      setTeams(teamsMap);
    } catch (error) {
      console.error('Failed to load tournament:', error);
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

  if (!tournament) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Tournament not found</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'var(--color-accent-primary)',
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <span
              className="px-3 py-1 rounded text-sm font-mono uppercase"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-accent-primary) 20%, transparent)`,
                color: 'var(--color-accent-primary)',
              }}
            >
              {tournament.status}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/tournaments/${tournament.$id}/edit`)}
                className="p-2 rounded"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Banish this tournament?')) {
                    router.push('/tournaments');
                  }
                }}
                className="p-2 rounded"
                style={{
                  backgroundColor: 'var(--color-status-error)',
                  color: 'white',
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1
            className="text-4xl font-bold mb-4 neon-glow"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {tournament.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Game</p>
                <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{tournament.game}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Start Date</p>
                <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{formatDate(tournament.startDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Prize Pool</p>
                <p className="font-medium text-xl" style={{ color: 'var(--color-accent-primary)' }}>
                  {tournament.prizePool ? `$${tournament.prizePool.toLocaleString()}` : 'TBD'}
                </p>
              </div>
            </div>
          </div>

          {tournament.description && (
            <p className="mt-4" style={{ color: 'var(--color-text-secondary)' }}>
              {tournament.description}
            </p>
          )}
        </div>

        {/* Bracket View */}
        <div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            Tournament Bracket
          </h2>
          <BracketView tournament={tournament} matches={matches} teams={teams} />
        </div>

        {/* Matches List */}
        <div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            All Matches
          </h2>
          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.$id}
                  className="p-4 rounded-lg flex justify-between items-center"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-primary)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {teams[match.teamA]?.name || 'Team A'}
                    </span>
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                      {match.scoreA} - {match.scoreB}
                    </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {teams[match.teamB]?.name || 'Team B'}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    {match.round}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-tertiary)' }}>No matches scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}

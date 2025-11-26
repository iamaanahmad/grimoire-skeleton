/**
 * Match Detail Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Match, Team, Tournament } from '@/types/cursed-arena/entities';
import { fetchMatches, fetchTeam, fetchTournament } from '@/lib/cursed-arena/api';
import { ArrowLeft, Edit, Trash2, Trophy, Clock, Swords } from 'lucide-react';

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const matches = await fetchMatches();
      const matchData = matches.find(m => m.$id === id);
      setMatch(matchData || null);
      
      if (matchData) {
        const [teamAData, teamBData, tournamentData] = await Promise.all([
          fetchTeam(matchData.teamA),
          fetchTeam(matchData.teamB),
          fetchTournament(matchData.tournament),
        ]);
        setTeamA(teamAData);
        setTeamB(teamBData);
        setTournament(tournamentData);
      }
    } catch (error) {
      console.error('Failed to load match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Banish this match?')) {
      router.push('/apps/cursed-arena/matches');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'live': return '#ef4444';
      case 'completed': return '#10b981';
      default: return 'var(--color-accent-primary)';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)' }} />
            <div className="h-64 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: 'var(--color-text-secondary)' }}>Match not found</p>
          <button
            onClick={() => router.push('/apps/cursed-arena/matches')}
            className="px-4 py-2 rounded font-medium"
            style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-bg-primary)' }}
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/apps/cursed-arena/matches')}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Matches
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/apps/cursed-arena/matches/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-bg-primary)' }}
            >
              <Edit className="w-4 h-4" />
              Enchant
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all hover:opacity-90"
              style={{ backgroundColor: '#dc2626', color: 'white' }}
            >
              <Trash2 className="w-4 h-4" />
              Banish
            </button>
          </div>
        </div>

        {/* Match Card */}
        <div
          className="p-8 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '2px solid var(--color-accent-primary)',
          }}
        >
          {/* Status Badge */}
          <div className="flex justify-between items-center mb-6">
            <span
              className="px-3 py-1 rounded text-sm font-mono uppercase"
              style={{ backgroundColor: getStatusColor(match.status), color: 'white' }}
            >
              {match.status === 'live' && '🔴 '}{match.status}
            </span>
            {match.round && (
              <span style={{ color: 'var(--color-text-secondary)' }}>{match.round}</span>
            )}
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center flex-1">
              <button
                onClick={() => teamA && router.push(`/apps/cursed-arena/teams/${teamA.$id}`)}
                className="text-2xl font-bold hover:underline"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {teamA?.name || 'Team A'}
              </button>
              {teamA?.tag && (
                <p className="font-mono" style={{ color: 'var(--color-accent-primary)' }}>[{teamA.tag}]</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                {match.scoreA}
              </span>
              <Swords className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} />
              <span className="text-5xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                {match.scoreB}
              </span>
            </div>

            <div className="text-center flex-1">
              <button
                onClick={() => teamB && router.push(`/apps/cursed-arena/teams/${teamB.$id}`)}
                className="text-2xl font-bold hover:underline"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {teamB?.name || 'Team B'}
              </button>
              {teamB?.tag && (
                <p className="font-mono" style={{ color: 'var(--color-accent-primary)' }}>[{teamB.tag}]</p>
              )}
            </div>
          </div>

          {/* Match Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6" style={{ borderTop: '1px solid var(--color-border-primary)' }}>
            {tournament && (
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
                <div>
                  <p className="text-xs uppercase" style={{ color: 'var(--color-text-tertiary)' }}>Tournament</p>
                  <button
                    onClick={() => router.push(`/apps/cursed-arena/tournaments/${tournament.$id}`)}
                    className="font-medium hover:underline"
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    {tournament.name}
                  </button>
                </div>
              </div>
            )}

            {match.scheduledTime && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
                <div>
                  <p className="text-xs uppercase" style={{ color: 'var(--color-text-tertiary)' }}>Scheduled</p>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {new Date(match.scheduledTime).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

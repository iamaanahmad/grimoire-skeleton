/**
 * Team Detail Page
 * 
 * Shows team information with roster and match history.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Team, Player, Match } from '@/types/cursed-arena/entities';
import { fetchTeam, fetchPlayers, fetchMatches } from '@/lib/cursed-arena/api';
import { Users, MapPin, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teamData, playersData, matchesData] = await Promise.all([
        fetchTeam(params.id),
        fetchPlayers({ team: params.id }),
        fetchMatches({ team: params.id }),
      ]);
      
      setTeam(teamData);
      setPlayers(playersData);
      setMatches(matchesData);
    } catch (error) {
      console.error('Failed to load team:', error);
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

  if (!team) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Team not found</p>
      </div>
    );
  }

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
            <div className="flex items-center gap-4">
              {team.logo && (
                <div className="w-16 h-16 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <Image src={team.logo} alt={team.name} width={64} height={64} />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold neon-glow" style={{ color: 'var(--color-text-primary)' }}>
                  {team.name}
                </h1>
                <p className="text-2xl font-mono font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                  [{team.tag}]
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/teams/${team.$id}/edit`)}
                className="p-2 rounded"
                style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Banish this team?')) router.push('/teams');
                }}
                className="p-2 rounded"
                style={{ backgroundColor: 'var(--color-status-error)', color: 'white' }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {team.region && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>{team.region}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
              <span style={{ color: 'var(--color-text-secondary)' }}>{team.membersCount} members</span>
            </div>
          </div>
        </div>

        {/* Roster */}
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-accent-primary)' }}>
            Roster
          </h2>
          {players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player) => (
                <div
                  key={player.$id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-primary)',
                  }}
                >
                  <p className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                    {player.gamertag}
                  </p>
                  {player.role && (
                    <p className="text-sm" style={{ color: 'var(--color-accent-primary)' }}>
                      {player.role}
                    </p>
                  )}
                  {player.realName && (
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      {player.realName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-tertiary)' }}>No players in roster</p>
          )}
        </div>

        {/* Match History */}
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-accent-primary)' }}>
            Match History
          </h2>
          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.$id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-primary)',
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {match.status} - {match.round}
                    </span>
                    <span className="text-xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                      {match.scoreA} - {match.scoreB}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-tertiary)' }}>No match history</p>
          )}
        </div>
      </div>
    </div>
  );
}
